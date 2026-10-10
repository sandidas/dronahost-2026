/** The governor counts pages in flight and new briefs per month, and refuses beyond the caps or when paused. */
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { briefDate, governorStatus } from "./governor";
import { loadConfig } from "./load-config";

const HDR = "| Keyword | Locale | Secondary | Intent check | Volume / KD | Target URL | Owner | Status | Next review | AI cited |\n|---|---|---|---|---|---|---|---|---|---|\n";
function setup(statuses: string[], briefDates: string[]) {
  const dir = mkdtempSync(join(tmpdir(), "gov-"));
  writeFileSync(join(dir, "register.md"), `## Plan 03: Informational\n\n${HDR}${statuses.map((s, i) => `| keyword number ${i} | en-US | | | | \`/kb/p${i}\` | | ${s} | | |\n`).join("")}`);
  mkdirSync(join(dir, "briefs"));
  briefDates.forEach((d, i) => writeFileSync(join(dir, "briefs", `b${i}.md`), `---\ncreated_on: ${d}\n---\n# Brief\n`));
  return { registerFile: join(dir, "register.md"), briefsDir: join(dir, "briefs") };
}
const config = (over: Partial<ReturnType<typeof loadConfig>["config"]["governor"]> = {}) => { const c = loadConfig().config; return { ...c, governor: { ...c.governor, ...over } }; };

test("under the caps a new brief may start", () => {
  const s = governorStatus({ config: config(), ...setup(["drafting", "unvalidated"], ["2026-10-02"]), today: "2026-10-09" });
  assert.equal(s.allowed, true);
  assert.equal(s.inFlight, 1);
  assert.equal(s.monthCount, 1);
});

test("the in-flight cap refuses another brief", () => {
  const s = governorStatus({ config: config(), ...setup(["briefed", "drafting", "review"], []), today: "2026-10-09" });
  assert.equal(s.allowed, false);
  assert.match(s.reasons.join(" "), /in flight/);
});

test("the monthly cap refuses another brief, and only this month's briefs count", () => {
  const dates = ["2026-10-01", "2026-10-02", "2026-10-03", "2026-10-04", "2026-09-30"];
  const s = governorStatus({ config: config(), ...setup([], dates), today: "2026-10-09" });
  assert.equal(s.monthCount, 4);
  assert.equal(s.allowed, false);
});

test("the pause switch refuses everything", () => {
  const s = governorStatus({ config: config({ paused: true }), ...setup([], []), today: "2026-10-09" });
  assert.equal(s.allowed, false);
  assert.match(s.reasons[0], /pause/);
});

test("a brief date comes from created_on or from a Written line", () => {
  assert.equal(briefDate("---\ncreated_on: 2026-10-01\n---\n"), "2026-10-01");
  assert.equal(briefDate("Status: x. Written 2026-10-08 by a tool."), "2026-10-08");
  assert.equal(briefDate("no date"), null);
});
