/** The evaluation harness passes on the shipped cases and goes red when an expectation changes. Run: npm run test:tools */
import assert from "node:assert/strict";
import { cpSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { runCases } from "./eval";
import { deriveKeyword, isPlainKeyword } from "./resolve";

const CASES = "content-engine/eval/cases";

test("every shipped evaluation case matches its expectation", async () => {
  const results = await runCases(CASES);
  assert.equal(results.length, 11);
  assert.deepEqual(results.filter((r) => !r.ok), []);
});

test("changing an expectation makes the harness fail", async () => {
  const dir = mkdtempSync(join(tmpdir(), "eval-"));
  cpSync(CASES, dir, { recursive: true });
  const f = join(dir, "01-fix.json");
  const c = JSON.parse(readFileSync(f, "utf8"));
  c.expect.plan = "03";
  writeFileSync(f, JSON.stringify(c));
  const bad = (await runCases(dir)).filter((r) => !r.ok);
  assert.deepEqual(bad.map((r) => r.id), ["01-fix"]);
  assert.match(bad[0].problems[0], /plan/);
});

test("a title is not a plain keyword, and the derived keyword drops punctuation and filler", () => {
  assert.equal(isPlainKeyword("how to check wordpress version"), true);
  assert.equal(isPlainKeyword("How to Check Your WordPress Version?"), false);
  assert.equal(deriveKeyword("How to Check Your WordPress Version?"), "how to check wordpress version");
});
