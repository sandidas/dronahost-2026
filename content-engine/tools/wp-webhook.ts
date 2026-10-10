/**
 * wp-webhook: a small HTTP endpoint that answers one question for WordPress: does this post pass every content rule?
 * POST /check with header x-planner-secret and a JSON body { "id": 123 } (the post is fetched, read only) or { "post": {...} }.
 * 200 { ok, checked } when every rule passes; 422 { ok:false, failures } when any rule fails; 401, 400, 404, 405, 413 otherwise.
 * It never changes WordPress. The secret comes only from the environment variable named in config.adapters.wordpress.webhookSecretEnv.
 *
 * Usage: wp-webhook [--port 4010] [--host 127.0.0.1] [--help]
 */
import { createHash, timingSafeEqual } from "node:crypto";
import { createServer, type Server } from "node:http";
import { isMain } from "./is-main";
import { type Ctx, loadContext } from "./check-content";
import { type WpConfig, type WpPost, checkPosts, fetchPosts } from "./wp-posts";

export const MAX_BODY = 1024 * 1024;
export const MIN_SECRET = 16;

export type Deps = { ctx: Ctx; wp: WpConfig; secret: string; fetchPost?: (id: number) => Promise<WpPost> };
export type Req = { method: string; url: string; headers: Record<string, string | string[] | undefined>; body: string; bodyTooLarge?: boolean };
export type Res = { status: number; json: Record<string, unknown> };

const digest = (s: string): Buffer => createHash("sha256").update(s).digest();
function secretOk(given: string | string[] | undefined, secret: string): boolean {
  const value = Array.isArray(given) ? given[0] : given;
  if (!value || !secret) return false;
  return timingSafeEqual(digest(value), digest(secret));
}

/** Environment-backed fetcher for a single post. Credentials are read when called and never logged. */
export function envFetchPost(wp: WpConfig): (id: number) => Promise<WpPost> {
  return async (id) => {
    const apiUrl = process.env[wp.apiUrlEnv];
    if (!apiUrl) throw new Error("API URL is not set");
    const [post] = await fetchPosts({ apiUrl, user: process.env[wp.userEnv], password: process.env[wp.passwordEnv], id });
    return post;
  };
}

export async function handleCheck(req: Req, deps: Deps): Promise<Res> {
  if (new URL(req.url, "http://localhost").pathname !== "/check") return { status: 404, json: { ok: false } };
  if (req.method !== "POST") return { status: 405, json: { ok: false } };
  if (!secretOk(req.headers["x-planner-secret"], deps.secret)) return { status: 401, json: { ok: false } };
  if (req.bodyTooLarge || Buffer.byteLength(req.body) > MAX_BODY) return { status: 413, json: { ok: false, error: "body over 1 MB" } };
  let parsed: unknown;
  try { parsed = JSON.parse(req.body); } catch { return { status: 400, json: { ok: false, error: "body is not valid JSON" } }; }
  const input = (parsed && typeof parsed === "object" ? parsed : {}) as { id?: unknown; post?: unknown };
  let post: WpPost;
  if (input.post && typeof input.post === "object" && !Array.isArray(input.post)) post = input.post as WpPost;
  else if (typeof input.id === "number" && Number.isInteger(input.id) && input.id > 0) {
    try { post = await (deps.fetchPost ?? envFetchPost(deps.wp))(input.id); }
    catch { return { status: 502, json: { ok: false, error: "could not read the post from WordPress" } }; }
  } else return { status: 400, json: { ok: false, error: "send { id } or { post }" } };
  const [result] = checkPosts([post], deps.ctx, deps.wp);
  if (result.ok) return { status: 200, json: { ok: true, checked: 1 } };
  const failures = result.results.flatMap((r) => r.failures.map((f) => ({ rule: r.id, line: f.line, message: f.message })));
  return { status: 422, json: { ok: false, failures } };
}

/** Starts the server. Throws before listening if the secret is missing or too short. */
export function startServer({ port, host, deps }: { port: number; host?: string; deps: Deps }): Promise<Server> {
  if (!deps.secret || deps.secret.length < MIN_SECRET) {
    return Promise.reject(new Error(`the secret in ${deps.wp.webhookSecretEnv} is not set or is shorter than ${MIN_SECRET} characters`));
  }
  const server = createServer((req, res) => {
    const chunks: Buffer[] = [];
    let size = 0;
    req.on("data", (c: Buffer) => { size += c.length; if (size <= MAX_BODY) chunks.push(c); });
    req.on("end", () => {
      const headers = { ...req.headers };
      void handleCheck({ method: req.method ?? "", url: req.url ?? "/", headers, body: Buffer.concat(chunks).toString("utf8"), bodyTooLarge: size > MAX_BODY }, deps)
        .catch((): Res => ({ status: 500, json: { ok: false } }))
        .then((out) => { res.writeHead(out.status, { "Content-Type": "application/json" }).end(JSON.stringify(out.json)); });
    });
    req.on("error", () => { res.destroy(); });
  });
  return new Promise((ok, fail) => {
    server.once("error", fail);
    server.listen(port, host ?? "127.0.0.1", () => ok(server));
  });
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  if (args.includes("--help")) {
    console.log("wp-webhook [--port 4010] [--host 127.0.0.1]: serve POST /check for WordPress (header x-planner-secret; body { id } or { post }). Replies 200 when every content rule passes, 422 with the failed rules otherwise. Read only. Refuses to start if the secret variable is unset or under 16 characters.");
    process.exit(0);
  }
  const val = (flag: string): string | undefined => { const i = args.indexOf(flag); return i >= 0 ? args[i + 1] : undefined; };
  const ctx = await loadContext();
  const wp = ctx.config.adapters.wordpress;
  if (!wp) { console.log("  FAIL wp-webhook config.adapters.wordpress is not set. Fix: add the block to the config."); process.exit(1); }
  const host = val("--host") ?? "127.0.0.1";
  const port = Number(val("--port") ?? 4010);
  try {
    await startServer({ port, host, deps: { ctx, wp, secret: process.env[wp.webhookSecretEnv] ?? "" } });
    console.log(`wp-webhook listening on http://${host}:${port}/check`);
  } catch (e) {
    console.log(`  FAIL wp-webhook ${(e as Error).message}. Fix: set the variable to a random value of ${MIN_SECRET} characters or more.`);
    process.exit(1);
  }
}

if (isMain(import.meta.url)) void main();
