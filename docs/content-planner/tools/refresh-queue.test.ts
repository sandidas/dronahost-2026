import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { parseRegister } from "./register";
import { buildQueue } from "./refresh-queue";

const fx = (f: string): string => fileURLToPath(new URL(`../eval/fixtures/refresh/${f}`, import.meta.url));
const tool = fileURLToPath(new URL("./refresh-queue.ts", import.meta.url));
const run = (cfg: string, ...args: string[]) =>
  spawnSync("npx", ["tsx", tool, ...args], { encoding: "utf8", env: { ...process.env, CONTENT_PLANNER_CONFIG: fx(cfg) } });

test("buildQueue lists due rows only inside the window, sorted", () => {
  const rows = parseRegister(`## Plan 01: x\n\n| Keyword | Locale | Secondary | Intent check | Volume / KD | Target URL | Owner | Status | Next review | AI cited |\n|---|---|---|---|---|---|---|---|---|---|\n| a | en-US | | | | \`/a\` | | published | 2026-02-20 | |\n| b | en-US | | | | \`/b\` | | published | 2026-02-05 | |\n| c | en-US | | | | \`/c\` | | published | 2026-09-01 | |\n`).rows;
  const { due } = buildQueue(rows, "2026-02-01", 30, null);
  assert.deepEqual(due.map((d) => d.row.keyword), ["b", "a"]);
});

test("rows due soon pass", () => {
  const r = run("config-ok.json", "--today", "2026-02-01");
  assert.equal(r.status, 0, r.stdout);
  assert.match(r.stdout, /soon page/);
  assert.doesNotMatch(r.stdout, /later page/);
});

test("overdue row fails RQ2", () => {
  const r = run("config-overdue.json", "--today", "2026-02-01");
  assert.equal(r.status, 1);
  assert.match(r.stdout, /FAIL RQ2 .*OVERDUE: "old page"/);
});

test("published row with no date fails RQ1", () => {
  const r = run("config-nodate.json", "--today", "2026-02-01");
  assert.equal(r.status, 1);
  assert.match(r.stdout, /FAIL RQ1 .*Fix:/);
});

test("empty register says nothing due", () => {
  const r = run("config-empty.json", "--today", "2026-02-01");
  assert.equal(r.status, 0);
  assert.match(r.stdout, /nothing due/);
});

test("--gsc lists prune and performance", () => {
  const r = run("config-ok.json", "--today", "2026-02-01", "--gsc", fx("gsc-pages.csv"));
  assert.match(r.stdout, /\/later: prune review/);
  assert.match(r.stdout, /\/soon: performance/);
});
