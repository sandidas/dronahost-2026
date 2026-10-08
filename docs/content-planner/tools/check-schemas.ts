/**
 * Validates the Zod schemas against their fixtures and templates. Files named `<kind>-valid*` must pass and
 * `<kind>-invalid*` must fail, where kind is brief (.md), ledger (.json), page (.json) or post (.md).
 * Also validates the real config files and the two JSON templates. Usage: npx tsx docs/content-planner/tools/check-schemas.ts [--help]
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { PLANNER_DIR, loadConfig } from "./load-config";
import { KINDS, validateFile } from "./validate-schema-file";

if (process.argv.includes("--help")) {
  console.log("check-schemas: every <kind>-valid fixture passes its schema, every <kind>-invalid fixture fails, and the real config and templates pass.");
  process.exit(0);
}

let failures = 0;
const report = (label: string, pass: boolean, detail: string[] = []) => {
  if (!pass) failures++;
  console.log(`  ${pass ? "PASS" : "FAIL"} ${label}`);
  for (const d of detail) console.log(`         ${d}`);
};

const dir = join(PLANNER_DIR, "eval/fixtures/schemas");
for (const name of readdirSync(dir).sort()) {
  const r = validateFile(join(dir, name));
  const expectValid = /-valid/.test(name) && !/-invalid/.test(name);
  report(`${name} ${expectValid ? "validates" : "is rejected"}`, r.ok === expectValid, r.ok === expectValid ? [] : r.problems);
}

for (const rel of ["templates/fact-ledger.json", "templates/page-skeleton.json"]) {
  const kind = rel.includes("ledger") ? "ledger" : "page";
  const r = KINDS[kind].schema.safeParse(JSON.parse(readFileSync(join(PLANNER_DIR, rel), "utf8")));
  report(`${rel} validates`, r.success, r.success ? [] : r.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`));
}

try {
  loadConfig();
  report("content-planner.config.json and project/rules.config.json validate", true);
} catch (e) {
  report("config files validate", false, [(e as Error).message]);
}

const loaded = loadConfig();
const ledgerDir = loaded.resolvePath(loaded.config.paths.facts);
for (const name of readdirSync(ledgerDir).filter((n) => n.endsWith(".json")).sort()) {
  const r = KINDS.ledger.schema.safeParse(JSON.parse(readFileSync(join(ledgerDir, name), "utf8")));
  report(`${name} (project ledger) validates`, r.success, r.success ? [] : r.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`));
}
console.log(failures ? `\n${failures} schema check(s) failed.` : "\nAll schema checks passed.");
process.exit(failures ? 1 : 0);
