/**
 * No-brand test: the reusable core (rules/ plans/ templates/ schemas/ eval/ tools/ claude/ later/) must not name the project,
 * its owner, its channels, its location, its providers or any price. The word lists come from project/rules.config.json.
 * Usage: npx tsx docs/content-planner/tools/check-no-brand.ts [--help]
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { PLANNER_DIR, loadConfig } from "./load-config";

if (process.argv.includes("--help")) {
  console.log("check-no-brand: fail if the reusable core mentions a term or pattern listed in project/rules.config.json (noBrand).");
  process.exit(0);
}

const CORE = ["rules", "plans", "templates", "schemas", "eval", "tools", "claude", "later"];
const TEXT = /\.(md|ts|json|txt)$/;

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir).sort()) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (TEXT.test(name)) out.push(p);
  }
  return out;
}

const escape = (s: string): string => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
/** An all-capitals term (an acronym) is matched exactly; other terms ignore case. Both need word boundaries. */
const termRegex = (t: string): RegExp => new RegExp(`(^|[^A-Za-z0-9])${escape(t)}($|[^A-Za-z0-9])`, t === t.toUpperCase() ? "" : "i");

const { rules } = loadConfig();
const terms = rules.noBrand.terms.map((t) => ({ label: t, re: termRegex(t) }));
const patterns = rules.noBrand.patterns.map((p) => ({ label: p, re: new RegExp(p) }));
const allow = rules.noBrand.allowFiles;

let hits = 0;
let files = 0;
for (const dir of CORE) {
  let list: string[] = [];
  try {
    list = walk(join(PLANNER_DIR, dir));
  } catch {
    continue;
  }
  for (const file of list) {
    const rel = relative(PLANNER_DIR, file);
    if (allow.some((a) => rel === a || rel.startsWith(`${a}/`))) continue;
    files++;
    readFileSync(file, "utf8").split("\n").forEach((text, i) => {
      for (const t of terms) if (t.re.test(text)) { hits++; console.log(`  FAIL ${rel}:${i + 1} names "${t.label}". Fix: use a placeholder such as [Brand] or move it to project/.`); }
      for (const p of patterns) if (p.re.test(text)) { hits++; console.log(`  FAIL ${rel}:${i + 1} matches pattern ${p.label} (a price). Fix: use [Price] or move it to project/.`); }
    });
  }
}
console.log(hits ? `\n${hits} brand hit(s) in ${files} core file(s).` : `No-brand test passed (${files} core files).`);
process.exit(hits ? 1 : 0);
