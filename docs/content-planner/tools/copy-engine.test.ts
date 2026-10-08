/** copy-engine copies the reusable core only, the same way on every platform (plain Node file copy). */
import assert from "node:assert/strict";
import { existsSync, mkdtempSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { CORE_DIRS, copyEngine } from "./copy-engine";

const fresh = (): string => join(mkdtempSync(join(tmpdir(), "copy-")), "docs/content-planner");

test("the core folders and files are copied, project data and config are not", () => {
  const to = fresh();
  copyEngine({ toPlanner: to });
  for (const d of CORE_DIRS) assert.ok(existsSync(join(to, d)), d);
  assert.ok(existsSync(join(to, "README.md")) && existsSync(join(to, "CHANGELOG.md")));
  assert.equal(existsSync(join(to, "project")), false);
  assert.equal(existsSync(join(to, "content-planner.config.json")), false);
  assert.equal(existsSync(join(to, "MIGRATION_PLAN.md")), false);
});

test("the sample project is copied only when asked", () => {
  const without = fresh();
  copyEngine({ toPlanner: without });
  assert.equal(existsSync(join(without, "eval/sample-project")), false);
  const withSample = fresh();
  copyEngine({ toPlanner: withSample, withSample: true });
  assert.ok(existsSync(join(withSample, "eval/sample-project/content-planner.config.json")));
});

test("a dry run lists what it would copy and writes nothing", () => {
  const to = fresh();
  const listed = copyEngine({ toPlanner: to, dryRun: true });
  assert.ok(listed.includes("rules/") && listed.includes("README.md"));
  assert.equal(existsSync(to), false);
});

test("the copy holds the same tool files as the source", () => {
  const to = fresh();
  copyEngine({ toPlanner: to });
  const names = (d: string) => readdirSync(d).filter((n) => n.endsWith(".ts")).sort();
  assert.deepEqual(names(join(to, "tools")), names(join(__dirname)));
});
