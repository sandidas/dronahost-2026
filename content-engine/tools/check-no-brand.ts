/**
 * No-brand test: the reusable core (rules/ plans/ templates/ schemas/ eval/ tools/ claude/ later/, README.md, CHANGELOG.md:
 * everything copy-engine copies) must not name the project,
 * its owner, its channels, its location, its providers or any price. The word lists come from project/rules.config.json.
 * Usage: npx tsx content-engine/tools/check-no-brand.ts [--help]
 */
import { readLf } from "./eol";
import { existsSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { CORE_DIRS, CORE_FILES } from "./copy-engine";
import { PLANNER_DIR, loadConfig } from "./load-config";

if (process.argv.includes("--help")) {
  console.log("check-no-brand: fail if the reusable core mentions a term or pattern listed in project/rules.config.json (noBrand).");
  process.exit(0);
}

const TEXT = /\.(md|mdx|ts|js|mjs|cjs|json|txt|ya?ml|csv)$/;

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
const allowTerms = rules.noBrand.allowTerms ?? [];
const allowed = (rel: string, label: string): boolean => allowTerms.some((a) => a.file === rel && a.term.toLowerCase() === label.toLowerCase());

let hits = 0;
let files = 0;
const lists: string[][] = [...CORE_DIRS.map((dir) => { try { return walk(join(PLANNER_DIR, dir)); } catch { return []; } }), CORE_FILES.map((f) => join(PLANNER_DIR, f)).filter(existsSync)];
for (const list of lists) {
  for (const file of list) {
    const rel = relative(PLANNER_DIR, file).split(sep).join("/");
    if (allow.some((a) => rel === a || rel.startsWith(`${a}/`))) continue;
    files++;
    readLf(file).split("\n").forEach((text, i) => {
      for (const t of terms) if (t.re.test(text) && !allowed(rel, t.label)) { hits++; console.log(`  FAIL ${rel}:${i + 1} names "${t.label}". Fix: use a placeholder such as [Brand] or move it to project/.`); }
      for (const p of patterns) if (p.re.test(text)) { hits++; console.log(`  FAIL ${rel}:${i + 1} matches pattern ${p.label} (a price). Fix: use [Price] or move it to project/.`); }
    });
  }
}
console.log(hits ? `\n${hits} brand hit(s) in ${files} core file(s).` : `No-brand test passed (${files} core files).`);
process.exit(hits ? 1 : 0);
