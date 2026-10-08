/**
 * Runs the engine's unit tests. By default they run against the sample project (eval/sample-project), so they prove the engine
 * does not depend on any real project's data. `--project` runs the tests in project/tests (they import this host's app files)
 * against the real config. Usage: npx tsx docs/content-planner/tools/run-tests.ts [--project] [--help]
 */
import { spawnSync } from "node:child_process";
import { readdirSync } from "node:fs";
import { join } from "node:path";
import { PLANNER_DIR } from "./load-config";

if (process.argv.includes("--help")) {
  console.log("run-tests [--project]: engine tests against the sample project; with --project, this project's own tests against its real config.");
  process.exit(0);
}
const project = process.argv.includes("--project");
const dir = project ? join(PLANNER_DIR, "project/tests") : join(PLANNER_DIR, "tools");
const files = readdirSync(dir).filter((f) => f.endsWith(".test.ts")).sort().map((f) => join(dir, f));
const env = { ...process.env };
if (!project && !env.CONTENT_PLANNER_CONFIG) env.CONTENT_PLANNER_CONFIG = join(PLANNER_DIR, "eval/sample-project/content-planner.config.json");
const r = spawnSync("npx", ["tsx", "--test", ...files], { stdio: "inherit", env });
process.exit(r.status ?? 1);
