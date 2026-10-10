/** Proves similarity flags copied passages (OV1) and copied SERP notes (OV2). Run: npx tsx --test content-engine/tools/similarity.test.ts */
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { test } from "node:test";
import { compare } from "./similarity";
import { loadCtx } from "./text";

const FIX = "content-engine/eval/fixtures/similarity";
const ctx = loadCtx(`${FIX}/config.json`);
const { threshold } = ctx.config.limits.similarity;

test("a draft that copies another page fails OV1 and shows the shared phrase", () => {
  const m = compare(`${FIX}/drafts/main.md`, ctx);
  const top = m[0];
  assert.equal(top.rule, "OV1");
  assert.ok(top.other.endsWith("other.md"));
  assert.ok(top.containment > threshold);
  assert.match(top.phrase, /always rinse the filter/);
});

test("a different draft with the same slug is skipped, and the doc is not compared to itself", () => {
  const others = compare(`${FIX}/drafts/main.md`, ctx).map((x) => x.other);
  assert.ok(!others.some((o) => o.endsWith("same-slug-old.md") || o.endsWith("main.md")));
});

test("an original draft has no match above the threshold", () => {
  assert.ok(compare(`${FIX}/drafts/clean.md`, ctx).every((m) => m.containment <= threshold));
});

test("copied SERP notes fail OV2, and only the SERP section is used", () => {
  const m = compare(`${FIX}/drafts/serp-copy.md`, ctx).filter((x) => x.rule === "OV2");
  assert.equal(m.length, 1);
  assert.ok(m[0].containment > threshold);
  assert.equal(compare(`${FIX}/drafts/clean.md`, ctx).filter((x) => x.rule === "OV2").length, 0);
});

test("CLI exits 1 with a FAIL line for copied text and 0 for original text", () => {
  const env = { ...process.env, CONTENT_ENGINE_CONFIG: `${FIX}/config.json` };
  const go = (f: string) => spawnSync("npx", ["tsx", "content-engine/tools/similarity.ts", `${FIX}/drafts/${f}`], { env, encoding: "utf8" });
  const bad = go("main.md");
  assert.equal(bad.status, 1);
  assert.match(bad.stdout, /FAIL OV1 .*main\.md:\d+ .* Fix: /);
  assert.equal(go("clean.md").status, 0);
  assert.match(go("serp-copy.md").stdout, /FAIL OV2/);
});

test("a different file with the root slug \"/\" is skipped as the old version of the same page", () => {
  const others = compare(`${FIX}/drafts/root-new.md`, ctx).map((x) => x.other);
  assert.ok(!others.some((o) => o.endsWith("root-old.md")));
});
