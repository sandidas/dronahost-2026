/**
 * The owner's interview banks are fixed wording (decision 32). This test pins each bank by a hash of its exact lines, so any edit
 * to a question fails here, and checks that every plan that should use a bank names it.
 */
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { PLANNER_DIR } from "./load-config";
import { lf } from "./eol";

const doc = lf(readFileSync(join(PLANNER_DIR, "rules/interview-questions.md"), "utf8"));
const bank = (heading: string): string[] => {
  const start = doc.indexOf(`### ${heading}`);
  assert.ok(start >= 0, `bank "${heading}" exists`);
  const rest = doc.slice(start + heading.length + 4);
  const end = rest.search(/\n(###? |The five banks)/);
  return rest.slice(0, end < 0 ? undefined : end).split("\n").filter((l) => /^\d+\. /.test(l));
};
const sha = (lines: string[]): string => createHash("sha256").update(lines.join("\n")).digest("hex").slice(0, 16);

const BANKS: { heading: string; plan: string; count: number; hash: string }[] = [
  { heading: "Regional pages (Plan 05)", plan: "05-regional-and-location", count: 6, hash: "a4dfd2b63d1378d2" },
  { heading: "Policy pages (Plan 07)", plan: "07-compliance-and-trust", count: 6, hash: "3e990fc58113127f" },
  { heading: "Domain pages (Plan 08)", plan: "08-domains", count: 5, hash: "7d6ee7b815718e5d" },
  { heading: "Brand and trust pages (Plan 09)", plan: "09-navigational-brand", count: 6, hash: "e80a6db80b215d88" },
  { heading: "Off-site work (Plan 15)", plan: "15-off-site-reviews-and-links", count: 5, hash: "134a4052f7bcc12e" },
];

for (const b of BANKS) {
  test(`${b.heading}: the owner's questions are present, numbered, and unchanged`, () => {
    const lines = bank(b.heading);
    assert.equal(lines.length, b.count);
    lines.forEach((l, i) => assert.ok(l.startsWith(`${i + 1}. `), `question ${i + 1} is numbered in order`));
    assert.equal(sha(lines), b.hash, "a question was reworded; the banks are fixed wording (decision 32)");
  });
  test(`${b.heading}: the plan names the bank`, () => {
    const plan = lf(readFileSync(join(PLANNER_DIR, "plans", `${b.plan}.md`), "utf8"));
    assert.match(plan, new RegExp(`\\*\\*Interview:\\*\\*[^\\n]*${b.heading.replace(/ \(Plan \d+\)/, "")}`));
  });
}

test("'none' drops the section and answers are recorded word for word", () => {
  assert.match(doc, /treat "none" as a gap/);
  assert.match(doc, /word for word/);
});
