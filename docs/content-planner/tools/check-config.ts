/**
 * Validates content-planner.config.json and project/rules.config.json against their Zod schemas, and checks that every path
 * the config names exists. Usage: npx tsx docs/content-planner/tools/check-config.ts [--help]
 */
import { existsSync } from "node:fs";
import { CONFIG_FILE, loadConfig } from "./load-config";

if (process.argv.includes("--help")) {
  console.log("check-config: validate content-planner.config.json and project/rules.config.json, and that the configured paths exist.");
  process.exit(0);
}

try {
  const { config, resolvePath } = loadConfig();
  const missing = Object.entries(config.paths)
    .filter(([key, p]) => p !== null && key !== "posts" && !existsSync(resolvePath(p)))
    .map(([key, p]) => `paths.${key}: ${p} does not exist`);
  for (const m of missing) console.log(`  FAIL ${m}`);
  console.log(missing.length ? `\n${missing.length} problem(s) in ${CONFIG_FILE}.` : `Config OK (${CONFIG_FILE}).`);
  process.exit(missing.length ? 1 : 0);
} catch (e) {
  console.log(`  FAIL ${(e as Error).message}\nFix: edit ${CONFIG_FILE} to match schemas/config.ts.`);
  process.exit(1);
}
