/** check-register: the existing checks, plan numbers, and the in-flight cap. */
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { checkRegister } from "./check-register";

const HDR = "| Keyword | Locale | Secondary | Intent check | Volume / KD | Target URL | Owner | Status | Next review | AI cited |\n|---|---|---|---|---|---|---|---|---|---|\n";
const row = (k: string, url: string, status = "validated", review = "", sec = "", locale = "en-US") => `| ${k} | ${locale} | ${sec} | | | \`${url}\` | | ${status} | ${review} | |\n`;
const run = (body: string, plans: Set<string> | null = null, maxInFlight = 3) => {
  const f = join(mkdtempSync(join(tmpdir(), "reg-")), "register.md");
  writeFileSync(f, `## Plan 03: Informational\n\n${HDR}${body}`);
  return checkRegister(f, { maxInFlight, paused: false, plans });
};
const errors = (r: ReturnType<typeof run>) => r.issues.filter((i) => i.level === "error").map((i) => i.rule);

test("a clean register passes", () => assert.deepEqual(errors(run(row("a b c", "/a") + row("d e f", "/b"))), []));
test("a duplicate keyword, a duplicate URL and a clashing secondary fail", () => {
  assert.ok(errors(run(row("a b c", "/a") + row("a b c", "/b"))).includes("R9"));
  assert.ok(errors(run(row("a b c", "/a") + row("d e f", "/a"))).includes("R10"));
  assert.ok(errors(run(row("a b c", "/a") + row("d e f", "/b", "validated", "", "a b c"))).includes("R11"));
});
test("a bad status, a bad locale, an uppercase keyword and a published row without a date fail", () => {
  assert.ok(errors(run(row("a b c", "/a", "nonsense"))).includes("R4"));
  assert.ok(errors(run(row("a b c", "/a", "validated", "", "", "xx-XX"))).includes("R3"));
  assert.ok(errors(run(row("A b c", "/a"))).includes("R2"));
  assert.ok(errors(run(row("a b c", "/a", "published"))).includes("R8"));
});
test("a plan number with no plan file fails", () => assert.ok(errors(run(row("a b c", "/a"), new Set(["01"]))).includes("R16")));
test("more pages in flight than the cap fails (GV1)", () => {
  const body = ["briefed", "drafting", "review", "drafting"].map((s, i) => row(`k${i} a b`, `/p${i}`, s)).join("");
  assert.ok(errors(run(body, null, 3)).includes("GV1"));
  assert.deepEqual(errors(run(body, null, 4)), []);
});
test("an empty register is a warning, not an error", () => {
  const r = run("");
  assert.deepEqual(errors(r), []);
  assert.ok(r.issues.some((i) => i.rule === "R14"));
});
