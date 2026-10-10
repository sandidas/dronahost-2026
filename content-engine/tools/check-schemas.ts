/**
 * Validates the Zod schemas against their fixtures and templates. Files named `<kind>-valid*` must pass and
 * `<kind>-invalid*` must fail, where kind is brief (.md), ledger (.json), page (.json) or post (.md).
 * Also validates the real config files and the two JSON templates. Usage: npx tsx content-engine/tools/check-schemas.ts [--help]
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { CONFIG_FILE, type Loaded, PLANNER_DIR, loadConfig } from "./load-config";
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
/** Reads and parses one JSON file; a broken file is a FAIL line, never a stack trace. */
const readJson = (file: string): { ok: true; data: unknown } | { ok: false } => {
  try { return { ok: true, data: JSON.parse(readFileSync(file, "utf8")) }; } catch (e) {
    failures++;
    console.log(`  FAIL SCH1 ${file}:1 ${(e as Error).message.split("\n")[0]}. Fix: make the file valid JSON`);
    return { ok: false };
  }
};

const dir = join(PLANNER_DIR, "eval/fixtures/schemas");
for (const name of existsSync(dir) ? readdirSync(dir).sort() : []) {
  let r: { ok: boolean; problems: string[] };
  try { r = validateFile(join(dir, name)); } catch (e) { r = { ok: false, problems: [(e as Error).message.split("\n")[0]] }; }
  const expectValid = /-valid/.test(name) && !/-invalid/.test(name);
  report(`${name} ${expectValid ? "validates" : "is rejected"}`, r.ok === expectValid, r.ok === expectValid ? [] : r.problems);
}

for (const rel of ["templates/fact-ledger.json", "templates/page-skeleton.json"]) {
  const kind = rel.includes("ledger") ? "ledger" : "page";
  const j = readJson(join(PLANNER_DIR, rel));
  if (!j.ok) continue;
  const r = KINDS[kind].schema.safeParse(j.data);
  report(`${rel} validates`, r.success, r.success ? [] : r.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`));
}

let loaded: Loaded | null = null;
try {
  loaded = loadConfig();
  report("content-engine.config.json and project/rules.config.json validate", true);
} catch (e) {
  report("config files validate", false, [`FAIL SCH2 ${CONFIG_FILE}:1 ${(e as Error).message.split("\n")[0]}. Fix: correct the config, then run check-schemas again`]);
}

const ledgerDir = loaded ? loaded.resolvePath(loaded.config.paths.facts) : "";
for (const name of ledgerDir && existsSync(ledgerDir) ? readdirSync(ledgerDir).filter((n) => n.endsWith(".json")).sort() : []) {
  const j = readJson(join(ledgerDir, name));
  if (!j.ok) continue;
  const r = KINDS.ledger.schema.safeParse(j.data);
  report(`${name} (project ledger) validates`, r.success, r.success ? [] : r.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`));
}
console.log(failures ? `\n${failures} schema check(s) failed.` : "\nAll schema checks passed.");
process.exit(failures ? 1 : 0);
