/**
 * Proves check-content catches what it should. Three fixtures pass, three fail, each failing exactly one different rule.
 * Run: npm run test:content
 */
import assert from "node:assert/strict";
import { test } from "node:test";
import { checkDoc, loadDoc } from "./check-content";

process.env.CHECK_CONTENT_REGISTER = "docs/content-planner/eval/fixtures/register.md";
process.env.CHECK_CONTENT_FACTS = "docs/content-planner/eval/fixtures/facts";

const FIX = "docs/content-planner/eval/fixtures";

const failed = (file: string): string[] => checkDoc(loadDoc(`${FIX}/${file}`)).filter((r) => !r.ok).map((r) => r.id);

test("pass-guide.md passes every rule", () => {
  assert.deepEqual(failed("pass-guide.md"), []);
});

test("pass-draft-with-flags.md passes: open flags and placeholder author are allowed in a Draft", () => {
  assert.deepEqual(failed("pass-draft-with-flags.md"), []);
  const g1 = checkDoc(loadDoc(`${FIX}/pass-draft-with-flags.md`)).find((r) => r.id === "G1");
  assert.match(g1?.note ?? "", /open flag/);
});

test("pass-page.json passes: page JSON is read too", () => {
  assert.deepEqual(failed("pass-page.json"), []);
});

test("fail-structure.md fails only S2 (heading level skipped)", () => {
  assert.deepEqual(failed("fail-structure.md"), ["S2"]);
  const s2 = checkDoc(loadDoc(`${FIX}/fail-structure.md`)).find((r) => r.id === "S2");
  assert.ok((s2?.failures[0]?.line ?? 0) > 1, "reports the line");
});

test("fail-facts.md fails only F1 (a number with no ledger entry)", () => {
  assert.deepEqual(failed("fail-facts.md"), ["F1"]);
  const f1 = checkDoc(loadDoc(`${FIX}/fail-facts.md`)).find((r) => r.id === "F1");
  assert.match(f1?.failures[0]?.message ?? "", /250 ms/);
});

test("fail-flags.md fails only G1 (open flag in a non-Draft page)", () => {
  assert.deepEqual(failed("fail-flags.md"), ["G1"]);
});
