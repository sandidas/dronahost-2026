/** wp-posts: field mapping, state mapping, fixture mode and a live round trip against an in-process server. */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createServer, type IncomingMessage, type Server } from "node:http";
import type { AddressInfo } from "node:net";
import { after, before, test } from "node:test";
import { type Ctx, loadContext } from "./check-content";
import { type WpConfig, type WpPost, checkPosts, fetchPosts, getPath, postToMarkdown } from "./wp-posts";

const FIX = "content-engine/eval/fixtures";
process.env.CHECK_CONTENT_REGISTER = `${FIX}/register.md`;
process.env.CHECK_CONTENT_FACTS = `${FIX}/facts`;
process.env.CHECK_CONTENT_BRIEFS = `${FIX}/briefs`;

const posts = JSON.parse(readFileSync(`${FIX}/wordpress/posts.json`, "utf8")) as WpPost[];
let ctx: Ctx;
let wp: WpConfig;
before(async () => { ctx = await loadContext(); wp = ctx.config.adapters.wordpress as WpConfig; });

test("getPath reads dotted paths and array indexes, and returns undefined for gaps", () => {
  const o = { a: { b: [{ c: "x" }] } };
  assert.equal(getPath(o, "a.b.0.c"), "x");
  assert.equal(getPath(o, "a.z.0.c"), undefined);
  assert.equal(getPath(null, "a"), undefined);
});

test("postToMarkdown maps the fields, the URL template and the H1", () => {
  const md = postToMarkdown(posts[0], wp);
  assert.match(md, /^---\nslug: \/kb\/check-wordpress-version\n/);
  for (const line of ["primary_keyword: how to check wordpress version", "author: Sam Example", "reviewer: Sam Example", "ai_assisted: yes", "reviewed_on: 2026-10-08", "next_review_on: 2027-04-08", "author_page: /about/sam-example"]) assert.ok(md.includes(`\n${line}\n`), line);
  assert.match(md, /---\n# How to check your WordPress version\n\nYou can check/);
  assert.match(md, /\n## Find it in the dashboard\n/);
});

test("meta.url_path wins over the template; missing fields are omitted; title and excerpt are fallbacks", () => {
  const md = postToMarkdown({ slug: "s", status: "draft", title: { rendered: "Tom &amp; Jerry" }, excerpt: { rendered: "<p>The <b>summary</b>.</p>" }, content: { rendered: "<h1>Own H1</h1><p>Body.</p>" }, meta: { url_path: "/guides/s", ai_assisted: false } }, wp);
  assert.match(md, /^---\nslug: \/guides\/s\n/);
  assert.match(md, /\nai_assisted: no\n/);
  assert.match(md, /\nseo_title: Tom & Jerry\n/);
  assert.match(md, /\nmeta_description: The summary\.\n/);
  assert.ok(!/primary_keyword|author|reviewed_on/.test(md.split("---")[1]));
  assert.equal(md.split("\n").filter((l) => l.startsWith("# ")).length, 1);
});

test("the status map gives the state; an unmapped status gives none", () => {
  const state = (status: string) => postToMarkdown({ status, title: { rendered: "T" }, content: { rendered: "" } }, wp).match(/\nstate: (.*)\n/)?.[1];
  assert.equal(state("publish"), "Published");
  assert.equal(state("draft"), "Draft");
  assert.equal(state("pending"), "Ready for owner review");
  assert.equal(state("trash"), undefined);
});

test("fixture mode: one post passes every rule and one fails with named rules", () => {
  const [good, bad] = checkPosts(posts, ctx, wp);
  assert.deepEqual(good.results.filter((r) => !r.ok).map((r) => r.id), []);
  assert.equal(good.ok, true);
  assert.equal(bad.ok, false);
  const ids = bad.results.filter((r) => !r.ok).map((r) => r.id);
  for (const id of ["S3", "P1", "K1"]) assert.ok(ids.includes(id), id);
});

test("two posts with the same title fail the duplicate rule", () => {
  const dup = [posts[0], { ...posts[0], id: 103, slug: "other" }];
  assert.ok(checkPosts(dup, ctx, wp)[1].results.some((r) => r.id === "OV3" && !r.ok));
});

// ---- live round trip against an in-process server (not the repo mock)
type Seen = { url: string; auth: string | undefined };
let server: Server;
let base = "";
const seen: Seen[] = [];
const all = Array.from({ length: 5 }, (_, i) => ({ id: i + 1, slug: `p${i + 1}` }));
before(async () => {
  server = createServer((req: IncomingMessage, res) => {
    const url = new URL(req.url ?? "/", "http://localhost");
    seen.push({ url: req.url ?? "", auth: req.headers.authorization });
    if (url.pathname.endsWith("/forbidden/posts")) { res.writeHead(403).end("no"); return; }
    if (url.pathname.endsWith("/redirect/posts")) { res.writeHead(302, { Location: "http://other.invalid/x" }).end(); return; }
    if (/\/posts\/\d+$/.test(url.pathname)) { res.writeHead(200, { "Content-Type": "application/json" }).end(JSON.stringify({ id: 7, slug: "one" })); return; }
    const page = Number(url.searchParams.get("page") ?? 1);
    res.writeHead(200, { "Content-Type": "application/json", "X-WP-TotalPages": "3" });
    res.end(JSON.stringify(all.slice((page - 1) * 2, page * 2)));
  });
  await new Promise<void>((r) => server.listen(0, "127.0.0.1", r));
  base = `http://127.0.0.1:${(server.address() as AddressInfo).port}/wp-json/wp/v2`;
});
after(() => { server.close(); });

test("fetchPosts pages through every page with the right query and sends Basic auth only when set", async () => {
  seen.length = 0;
  const got = await fetchPosts({ apiUrl: base, user: "u", password: "p w", statuses: "publish,draft" });
  assert.deepEqual(got.map((p) => p.id), [1, 2, 3, 4, 5]);
  assert.equal(seen.length, 3);
  assert.ok(seen[0].url.includes("per_page=100") && seen[0].url.includes("_embed=1") && seen[0].url.includes("status=publish%2Cdraft"));
  assert.ok(seen.every((s) => s.auth === `Basic ${Buffer.from("u:p w").toString("base64")}`));
  seen.length = 0;
  await fetchPosts({ apiUrl: base, user: "u" });
  assert.ok(seen.every((s) => s.auth === undefined));
});

test("fetchPosts by id reads one post", async () => {
  assert.deepEqual((await fetchPosts({ apiUrl: base, id: 7 })).map((p) => p.id), [7]);
});

test("a non-200 gives a clear error and a redirect to another host is not followed", async () => {
  await assert.rejects(fetchPosts({ apiUrl: `${base}/forbidden`, user: "u", password: "secret-value" }), (e: Error) => /HTTP 403/.test(e.message) && !e.message.includes("secret-value"));
  await assert.rejects(fetchPosts({ apiUrl: `${base}/redirect` }), /another host/);
});
