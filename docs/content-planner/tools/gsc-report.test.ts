import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseCsv, readMetrics, buildReport, expectedCtr, CsvShapeError } from "./gsc-report";

const dir = fileURLToPath(new URL("../eval/fixtures/gsc/", import.meta.url));
const tool = fileURLToPath(new URL("./gsc-report.ts", import.meta.url));

test("parseCsv handles quotes, commas and doubled quotes", () => {
  assert.deepEqual(parseCsv('a,"b, ""c""",d\n1,2,3\n'), [["a", 'b, "c"', "d"], ["1", "2", "3"]]);
});

test("reads queries and percent CTR", () => {
  const q = readMetrics(join(dir, "queries.csv"), "query");
  assert.equal(q.length, 5);
  assert.equal(q[1].name, 'widgets, gadgets and "more"');
  assert.ok(Math.abs(q[0].ctr - 0.025) < 1e-9);
});

test("expected CTR table", () => {
  assert.equal(expectedCtr(1), 0.25);
  assert.equal(expectedCtr(8), 0.02);
});

test("report proposes each rule once and states they are suggestions", () => {
  const out = buildReport(readMetrics(join(dir, "queries.csv"), "query"), readMetrics(join(dir, "pages.csv"), "page"), 28, true, "2026-01-01");
  assert.match(out, /\[a\] query "example plan guide": rewrite title and description/);
  assert.match(out, /\[b\] query "widgets, gadgets and "more"": add a section/);
  assert.match(out, /\[c\] query "far away phrase": check the search results/);
  assert.match(out, /\[d\] query "rare phrase": too little data; wait/);
  assert.doesNotMatch(out, /\[a\] query "top phrase"/);
  assert.match(out, /\[a\] page "https:\/\/example.com\/thin"/);
  assert.match(out, /suggestions, not guarantees/);
  assert.match(out, /\| date \| page \| change \| result \| rule \|/);
  assert.match(out, /1-3: 2/);
});

test("wrong columns exit 1 with GS1 naming the column", () => {
  assert.throws(() => readMetrics(join(dir, "bad.csv"), "query"), (e: Error) => e instanceof CsvShapeError && /CTR, Position/.test(e.message));
  const r = spawnSync("npx", ["tsx", tool, join(dir, "bad.csv")], { encoding: "utf8" });
  assert.equal(r.status, 1);
  assert.match(r.stdout, /FAIL GS1 .*bad\.csv:1 .*Fix:/);
});

test("good file exits 0 via CLI", () => {
  const r = spawnSync("npx", ["tsx", tool, join(dir, "queries.csv"), "--days", "7"], { encoding: "utf8" });
  assert.equal(r.status, 0);
  assert.match(r.stdout, /last 7 days/);
});
