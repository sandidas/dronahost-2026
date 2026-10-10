/** wp-webhook: the contract (200, 422, 401, 400, 404, 405, 413) against an in-process server, and the refusal to start. */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import type { Server } from "node:http";
import type { AddressInfo } from "node:net";
import { after, before, test } from "node:test";
import { loadContext } from "./check-content";
import { type Deps, handleCheck, startServer } from "./wp-webhook";
import type { WpConfig, WpPost } from "./wp-posts";

const FIX = "content-engine/eval/fixtures";
process.env.CHECK_CONTENT_REGISTER = `${FIX}/register.md`;
process.env.CHECK_CONTENT_FACTS = `${FIX}/facts`;
process.env.CHECK_CONTENT_BRIEFS = `${FIX}/briefs`;

const SECRET = "test-secret-0123456789";
const posts = JSON.parse(readFileSync(`${FIX}/wordpress/posts.json`, "utf8")) as WpPost[];
let server: Server;
let url = "";
let deps: Deps;
const H = { "x-planner-secret": SECRET, "content-type": "application/json" };
const post = (body: string, headers: Record<string, string> = H, path = "/check", method = "POST") => fetch(`${url}${path}`, { method, headers, body: method === "POST" ? body : undefined });

before(async () => {
  const ctx = await loadContext();
  deps = { ctx, wp: ctx.config.adapters.wordpress as WpConfig, secret: SECRET, fetchPost: async (id) => { const p = posts.find((x) => x.id === id); if (!p) throw new Error("missing"); return p; } };
  server = await startServer({ port: 0, deps });
  url = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
});
after(() => { server.close(); });

test("200 for a passing post sent inline, and for one fetched by id", async () => {
  const a = await post(JSON.stringify({ post: posts[0] }));
  assert.equal(a.status, 200);
  assert.deepEqual(await a.json(), { ok: true, checked: 1 });
  assert.equal((await post(JSON.stringify({ id: 101 }))).status, 200);
});

test("422 for a failing post, with the rule ids", async () => {
  const res = await post(JSON.stringify({ post: posts[1] }));
  assert.equal(res.status, 422);
  const body = (await res.json()) as { ok: boolean; failures: { rule: string; line: number; message: string }[] };
  assert.equal(body.ok, false);
  const rules = body.failures.map((f) => f.rule);
  for (const id of ["S3", "P1", "K1"]) assert.ok(rules.includes(id), id);
  assert.ok(body.failures.every((f) => typeof f.line === "number" && f.message));
});

test("401 with no secret or a wrong secret, with no detail", async () => {
  for (const headers of [{ "content-type": "application/json" }, { ...H, "x-planner-secret": "wrong-secret-0123456789" }, { ...H, "x-planner-secret": "short" }]) {
    const res = await post("{}", headers);
    assert.equal(res.status, 401);
    assert.deepEqual(await res.json(), { ok: false });
  }
});

test("400 for bad JSON and for a body with neither id nor post", async () => {
  assert.equal((await post("{not json")).status, 400);
  assert.equal((await post(JSON.stringify({ other: 1 }))).status, 400);
  assert.equal((await post(JSON.stringify({ id: "12" }))).status, 400);
});

test("404 for another path, 405 for another method, 413 over 1 MB", async () => {
  assert.equal((await post("{}", H, "/other")).status, 404);
  assert.equal((await post("", H, "/check", "GET")).status, 405);
  assert.equal((await post(JSON.stringify({ post: { content: { rendered: "x".repeat(1024 * 1024 + 10) } } }))).status, 413);
});

test("handleCheck is pure: it answers without a server", async () => {
  const res = await handleCheck({ method: "POST", url: "/check", headers: { "x-planner-secret": SECRET }, body: JSON.stringify({ post: posts[0] }) }, deps);
  assert.equal(res.status, 200);
});

test("the server refuses to start without a secret or with a short one", async () => {
  await assert.rejects(startServer({ port: 0, deps: { ...deps, secret: "" } }), /not set or is shorter/);
  await assert.rejects(startServer({ port: 0, deps: { ...deps, secret: "too-short" } }), /not set or is shorter/);
});
