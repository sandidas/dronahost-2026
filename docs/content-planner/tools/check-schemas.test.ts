/** Proves the schemas accept what they should and reject what they should. Run: npm run test:schemas */
import assert from "node:assert/strict";
import { test } from "node:test";
import { validateFile } from "./validate-schema-file";

const FIX = "docs/content-planner/eval/fixtures/schemas";

test("valid fixtures pass their schemas", () => {
  for (const f of ["brief-valid.md", "ledger-valid.json", "page-valid.json", "post-valid.md"]) assert.equal(validateFile(`${FIX}/${f}`).ok, true, f);
});

test("a brief cannot be approved without a confirmed gain, and a paused governor refuses it", () => {
  const r = validateFile(`${FIX}/brief-invalid-approved-without-gain.md`);
  assert.equal(r.ok, false);
  assert.ok(r.problems.some((p) => /information_gain_status/.test(p)));
  assert.ok(r.problems.some((p) => /governor_paused/.test(p)));
});

test("a verified fact needs a date and a checker, and ids are unique", () => {
  const r = validateFile(`${FIX}/ledger-invalid-verified-without-date.json`);
  assert.equal(r.ok, false);
  assert.ok(r.problems.some((p) => /retrievedOn/.test(p)));
  assert.ok(r.problems.some((p) => /duplicate fact id/.test(p)));
});

test("a page needs a review date", () => {
  const r = validateFile(`${FIX}/page-invalid-no-review-date.json`);
  assert.equal(r.ok, false);
  assert.ok(r.problems.some((p) => /reviewedOn/.test(p)));
});

test("a page cannot reuse a section id", () => {
  const r = validateFile(`${FIX}/page-invalid-duplicate-section.json`);
  assert.equal(r.ok, false);
  assert.ok(r.problems.some((p) => /duplicate section id/.test(p)));
});

test("only a Draft may carry a placeholder reviewer", () => {
  assert.equal(validateFile(`${FIX}/post-invalid-placeholder-reviewer.md`).ok, false);
});

test("a file with no schema prefix is rejected", () => {
  assert.equal(validateFile("docs/content-planner/eval/fixtures/pass-page.json").ok, false, "pass-page.json is not named with a schema prefix");
});
