/**
 * wp-posts: read WordPress posts over the REST API (read only) and run every content rule on each one.
 * The field map, the URL template and the status map come from config.adapters.wordpress; credentials come only from the
 * environment variables named there. Nothing here changes WordPress. See rules/wordpress-content-model.md.
 *
 * Usage: wp-posts [--id N] [--status publish,draft,pending] [--fixture file.json] [--optional] [--help]
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { Config } from "../schemas/config";
import { checkDoc, duplicateRules, loadContext, report, type Ctx, type RuleResult } from "./check-content";
import { docFromText } from "./content/parse";
import { htmlToMarkdown } from "./html-to-md";

export type WpConfig = NonNullable<Config["adapters"]["wordpress"]>;
export type WpPost = Record<string, unknown>;
export type PostResult = { label: string; id: string; results: RuleResult[]; ok: boolean };

/** Reads a dotted path such as `_embedded.author.0.name`. Returns undefined for anything missing. */
export function getPath(obj: unknown, dotted: string): unknown {
  let cur: unknown = obj;
  for (const key of dotted.split(".")) {
    if (cur === null || typeof cur !== "object") return undefined;
    cur = (cur as Record<string, unknown>)[key];
  }
  return cur;
}

const GROUP_ORDER = ["Structure", "Keyword", "Voice", "Facts", "People", "Experience", "Sources", "Metadata", "Schema", "Policy", "Overlap", "Flags"];
const oneLine = (s: string): string => s.replace(/\s+/g, " ").trim();
const plain = (html: string): string => oneLine(htmlToMarkdown(html).replace(/[*_`#>]/g, ""));

function scalar(post: WpPost, wp: WpConfig, key: string): string | undefined {
  const path = wp.fields[key];
  const v = path ? getPath(post, path) : undefined;
  if (typeof v === "string") return oneLine(v) || undefined;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  return undefined;
}
const yesNo = (v: string | undefined): string | undefined => (v === undefined ? undefined : /^(1|true|yes|y)$/i.test(v) ? "yes" : "no");

/** Builds the Markdown text check-content reads. A field the post does not have is omitted, never invented. */
export function postToMarkdown(post: WpPost, wp: WpConfig, config?: Config): string {
  void config; // reserved: nothing in the config changes the mapping yet
  const title = scalar(post, wp, "title");
  const titleText = title ? plain(title) : undefined;
  const slug = scalar(post, wp, "slug");
  const urlPath = scalar(post, wp, "url_path") ?? (slug ? wp.urlTemplate.replace("{slug}", slug) : undefined);
  const status = typeof post.status === "string" ? post.status : undefined;
  const excerpt = scalar(post, wp, "excerpt") ?? (typeof getPath(post, "excerpt.rendered") === "string" ? String(getPath(post, "excerpt.rendered")) : undefined);
  const front: [string, string | undefined][] = [
    ["slug", urlPath],
    ["primary_keyword", scalar(post, wp, "primary_keyword")],
    ["plan", scalar(post, wp, "plan")],
    ["locale", scalar(post, wp, "locale")],
    ["state", status ? wp.stateMap[status] : undefined],
    ["author", scalar(post, wp, "author")],
    ["reviewer", scalar(post, wp, "reviewer")],
    ["ai_assisted", yesNo(scalar(post, wp, "ai_assisted"))],
    ["reviewed_on", scalar(post, wp, "reviewed_on")],
    ["next_review_on", scalar(post, wp, "next_review_on")],
    ["seo_title", scalar(post, wp, "seo_title") ?? titleText],
    ["meta_description", scalar(post, wp, "meta_description") ?? (excerpt ? plain(excerpt) : undefined)],
    ["author_page", scalar(post, wp, "author_page")],
    ["reviews_source", scalar(post, wp, "reviews_source")],
  ];
  const head = front.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`);
  const contentHtml = getPath(post, wp.fields.content ?? "content.rendered");
  const body = typeof contentHtml === "string" ? htmlToMarkdown(contentHtml) : "";
  const withH1 = !/^# /m.test(body) && titleText ? `# ${titleText}\n\n${body}` : body;
  return `---\n${head.join("\n")}\n---\n${withH1.trim()}\n`;
}

export type FetchOptions = {
  apiUrl: string; user?: string; password?: string; statuses?: string; id?: number; fetchImpl?: typeof fetch; timeoutMs?: number;
};

async function getJson(url: URL, headers: Record<string, string>, f: typeof fetch, timeoutMs: number): Promise<{ data: unknown; pages: number }> {
  let target = url;
  for (let hop = 0; hop < 4; hop++) {
    const res = await f(target, { headers, redirect: "manual", signal: AbortSignal.timeout(timeoutMs) });
    if (res.status >= 300 && res.status < 400) {
      const loc = res.headers.get("location");
      const next = loc ? new URL(loc, target) : null;
      if (!next || next.host !== url.host) throw new Error(`WordPress redirected ${target.pathname} to another host; not followed`);
      target = next;
      continue;
    }
    if (res.status !== 200) throw new Error(`WordPress returned HTTP ${res.status} for ${target.pathname}`);
    let data: unknown;
    try { data = await res.json(); } catch { throw new Error(`WordPress sent a body for ${target.pathname} that is not JSON`); }
    return { data, pages: Number(res.headers.get("x-wp-totalpages") ?? 1) || 1 };
  }
  throw new Error(`Too many redirects for ${url.pathname}`);
}

/** Reads posts (all pages, or one by id). Sends HTTP Basic only when both user and password are set. Never logs them. */
export async function fetchPosts(opts: FetchOptions): Promise<WpPost[]> {
  const f = opts.fetchImpl ?? fetch;
  const base = opts.apiUrl.replace(/\/+$/, "");
  const headers: Record<string, string> = { Accept: "application/json" };
  if (opts.user && opts.password) headers.Authorization = `Basic ${Buffer.from(`${opts.user}:${opts.password}`).toString("base64")}`;
  const timeout = opts.timeoutMs ?? 15000;
  if (opts.id !== undefined) {
    const { data } = await getJson(new URL(`${base}/posts/${opts.id}?_embed=1`), headers, f, timeout);
    return [data as WpPost];
  }
  const out: WpPost[] = [];
  let pages = 1;
  for (let page = 1; page <= pages && page <= 100; page++) {
    const url = new URL(`${base}/posts`);
    url.searchParams.set("per_page", "100");
    url.searchParams.set("page", String(page));
    url.searchParams.set("_embed", "1");
    if (opts.statuses) url.searchParams.set("status", opts.statuses);
    const res = await getJson(url, headers, f, timeout);
    if (!Array.isArray(res.data)) throw new Error("WordPress did not return a list of posts");
    out.push(...(res.data as WpPost[]));
    pages = res.pages;
  }
  return out;
}

/** Runs every rule on each post, plus the cross-post duplicate rules. Overlap is skipped (a post is not a file in the repo). */
export function checkPosts(posts: WpPost[], ctx: Ctx, wp: WpConfig | undefined = ctx.config.adapters.wordpress): PostResult[] {
  if (!wp) throw new Error("config.adapters.wordpress is not set");
  const docs = posts.map((p, i) => {
    const id = typeof p.id === "number" || typeof p.id === "string" ? String(p.id) : String(i + 1);
    return { id, doc: docFromText(`post-${id}`, postToMarkdown(p, wp, ctx.config), "md", ctx.copy) };
  });
  const dupes = duplicateRules(docs.map((d) => d.doc));
  return docs.map(({ id, doc }) => {
    const results = [...checkDoc(ctx, doc, { overlap: false }), ...(dupes.get(doc.file) ?? [])]
      .sort((a, b) => GROUP_ORDER.indexOf(a.group) - GROUP_ORDER.indexOf(b.group));
    return { label: doc.file, id, results, ok: results.every((r) => r.ok) };
  });
}

const HELP = "wp-posts [--id N] [--status publish,draft,pending] [--fixture file.json] [--optional]: read posts from the WordPress REST API (read only) and run every content rule on each. --fixture reads a JSON array of REST posts instead of the network. --optional exits 0 with a skip message when the posts adapter is not configured. Exits 1 if any post fails.";

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  if (args.includes("--help")) { console.log(HELP); process.exit(0); }
  const val = (flag: string): string | undefined => { const i = args.indexOf(flag); return i >= 0 ? args[i + 1] : undefined; };
  const ctx = await loadContext();
  const wp = ctx.config.adapters.wordpress;
  const fixture = val("--fixture");
  const apiUrl = wp ? process.env[wp.apiUrlEnv] : undefined;
  if (!wp || (!fixture && (ctx.config.adapters.posts !== "wordpress" || !apiUrl))) {
    const why = !wp ? "config.adapters.wordpress is not set" : ctx.config.adapters.posts !== "wordpress" ? 'config.adapters.posts is not "wordpress"' : `environment variable ${wp.apiUrlEnv} is not set`;
    console.log(`${args.includes("--optional") ? "SKIP" : "FAIL"} wp-posts: ${why}.${args.includes("--optional") ? "" : " Fix: set it, or pass --fixture file.json."}`);
    process.exit(args.includes("--optional") ? 0 : 1);
  }
  try {
    const id = val("--id");
    const posts = fixture
      ? (JSON.parse(readFileSync(fixture, "utf8")) as WpPost[])
      : await fetchPosts({ apiUrl: apiUrl as string, user: process.env[wp.userEnv], password: process.env[wp.passwordEnv], statuses: val("--status") ?? "publish,draft,pending", id: id ? Number(id) : undefined });
    const results = checkPosts(posts, ctx, wp);
    let failed = 0;
    for (const r of results) if (!report(r.label, r.results)) failed++;
    console.log(`\n${results.length} post(s) checked, ${failed} with failures.`);
    process.exit(failed ? 1 : 0);
  } catch (e) {
    console.log(`  FAIL wp-posts ${(e as Error).message}. Fix: check the API URL, the credentials and that the REST API is reachable.`);
    process.exit(1);
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) void main();
