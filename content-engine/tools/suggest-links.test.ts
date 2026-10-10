/** Proves suggest-links ranks real targets and fails SL1 when too few exist. Run: npx tsx --test content-engine/tools/suggest-links.test.ts */
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { test } from "node:test";
import { suggest } from "./suggest-links";
import { loadCtx, loadText } from "./text";

const FIX = "content-engine/eval/fixtures/suggest-links";
const ctx = loadCtx(`${FIX}/config.json`);
const run = (f: string) => suggest(loadText(`${FIX}/drafts/${f}`, ctx), ctx);

test("suggests register and inventory targets with anchors, reasons and live or planned", () => {
  const list = run("doc.md");
  const by = (t: string) => list.find((s) => s.target === t);
  assert.ok(list.length >= 3);
  assert.equal(by("/blog-hosting")?.live, true);
  assert.equal(by("/blog-hosting")?.anchor, "managed blog hosting");
  assert.match(by("/blog-hosting")?.reason ?? "", /shares terms.*supported page/);
  assert.equal(by("/blog-hosting")?.linked, true);
  assert.equal(by("/kb/site-backup")?.live, false);
  assert.equal(by("/kb/site-backup")?.anchor, "site backup guide");
  assert.ok(by("/kb/speed-up-blog"), "same plan and shared terms");
  assert.match(by("/kb/speed-up-blog")?.reason ?? "", /same plan/);
});

test("never suggests dropped, excluded, other-locale, placeholder-URL or own pages", () => {
  const targets = run("doc.md").map((s) => s.target);
  for (const t of ["/domains", "/banned-topic", "/de/hosting", "/[slug]", "/kb/blog-checklist"]) assert.ok(!targets.includes(t), t);
  assert.ok(!run("doc.md").some((s) => /^(click here|here|read more|learn more)$/i.test(s.anchor)));
});

test("CLI exits 1 with SL1 when fewer than N suggestions exist, 0 when enough", () => {
  const env = { ...process.env, CONTENT_ENGINE_CONFIG: `${FIX}/config.json` };
  const go = (f: string, extra: string[] = []) => spawnSync("npx", ["tsx", "content-engine/tools/suggest-links.ts", `${FIX}/drafts/${f}`, ...extra], { env, encoding: "utf8" });
  const bad = go("lonely.md");
  assert.equal(bad.status, 1);
  assert.match(bad.stdout, /FAIL SL1 .*lonely\.md:1 .* Fix: /);
  assert.equal(go("doc.md").status, 0);
  assert.equal(go("doc.md", ["--min", "20"]).status, 1);
});
