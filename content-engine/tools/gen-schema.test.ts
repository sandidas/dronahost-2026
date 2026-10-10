/** Proves gen-schema generates only from visible fields and catches schema that disagrees with the page. Run: npx tsx --test content-engine/tools/gen-schema.test.ts */
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { check, generate } from "./gen-schema";
import { loadCtx, loadText } from "./text";

const FIX = "content-engine/eval/fixtures/gen-schema";
const ctx = loadCtx(`${FIX}/config.json`);
const doc = (f: string) => loadText(`${FIX}/${f}`, ctx);
const ids = (out: string[]): string[] => out.map((l) => l.trim().split(" ")[1]);
const checkFile = (md: string, ld: string): string[] => {
  const raw = readFileSync(`${FIX}/${ld}`, "utf8");
  return check(doc(md), JSON.parse(raw), ld, raw.split("\n"));
};

test("generate builds BlogPosting, BreadcrumbList and FAQPage from visible fields", () => {
  const r = generate(doc("draft.md"));
  assert.deepEqual(r.failures, []);
  const g = (r.graph as { "@graph": Record<string, unknown>[] })["@graph"];
  assert.deepEqual(g.map((n) => n["@type"]), ["BlogPosting", "BreadcrumbList", "FAQPage"]);
  assert.equal(g[0].headline, "How to check your site speed");
  assert.equal(g[0].dateModified, "2026-10-08");
  assert.equal("datePublished" in g[0], false);
  assert.equal(JSON.stringify(g).includes("Rating"), false);
  const crumbs = (g[1].itemListElement as { name: string }[]).map((c) => c.name);
  assert.deepEqual(crumbs, ["Home", "Kb", "Check Site Speed"]);
});

test("generated JSON-LD passes its own check", () => {
  const d = doc("draft.md");
  const g = generate(d).graph;
  assert.deepEqual(check(d, JSON.parse(JSON.stringify(g)), "gen.json", []), []);
});

test("placeholder author and date are omitted with warnings; no FAQ section means no FAQPage", () => {
  const r = generate(doc("draft-placeholder.md"));
  const post = (r.graph as { "@graph": Record<string, unknown>[] })["@graph"];
  assert.deepEqual(post.map((n) => n["@type"]), ["BlogPosting", "BreadcrumbList"]);
  assert.equal("author" in post[0], false);
  assert.equal("dateModified" in post[0], false);
  assert.equal(r.warnings.filter((w) => /author|reviewed_on/.test(w)).length, 2);
});

test("check fails JS2 when the headline differs from the H1", () => {
  const out = checkFile("draft.md", "bad-headline.jsonld");
  assert.ok(ids(out).includes("JS2"));
  assert.match(out.join("\n"), /differs from the visible H1/);
  assert.match(out.join("\n"), /FAQ/);
});

test("check fails JS3 for AggregateRating without reviews_source", () => {
  const out = checkFile("draft.md", "bad-rating.jsonld");
  assert.ok(ids(out).includes("JS3"));
});

test("check fails JS2 for an unknown person, an unset published date and a changed FAQ", () => {
  const text = checkFile("draft.md", "bad-person-faq.jsonld").join("\n");
  assert.match(text, /Pat Stranger/);
  assert.match(text, /datePublished/);
  assert.match(text, /differs from the visible answer|missing from the JSON-LD/);
});

test("CLI exits 1 on a failing check and 0 on --help", () => {
  const env = { ...process.env, CONTENT_ENGINE_CONFIG: `${FIX}/config.json` };
  const bad = spawnSync("npx", ["tsx", "content-engine/tools/gen-schema.ts", `${FIX}/draft.md`, "--check", `${FIX}/bad-headline.jsonld`], { env, encoding: "utf8" });
  assert.equal(bad.status, 1);
  assert.match(bad.stdout, /FAIL JS2 .*bad-headline\.jsonld:\d+ .* Fix: /);
  assert.equal(spawnSync("npx", ["tsx", "content-engine/tools/gen-schema.ts", "--help"], { env, encoding: "utf8" }).status, 0);
});
