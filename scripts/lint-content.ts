/**
 * Content linter for page specs (docs/reference/RULES_REVIEW_AND_PAGE_SYSTEM.md section 3.6): banned phrases, exclamation
 * marks, numbers that must come from claims or pricing, banned CTAs, reading level, sentence length, internal links, unknown
 * claim refs, and duplicate titles across pages. Exits 1 on any error. Usage: npx tsx scripts/lint-content.ts [dir]
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { claimUsage, lintPage } from "../lib/content/lint";
import { parsePage } from "../lib/content/page";

const dir = process.argv[2] ?? "content/pages";
let files: string[] = [];
try {
  files = readdirSync(dir).filter((f) => f.endsWith(".json"));
} catch {
  console.log(`No ${dir} folder: nothing to lint.`);
  process.exit(0);
}

let errors = 0;
const titles = new Map<string, string>();
const descriptions = new Map<string, string>();
for (const file of files) {
  const spec = parsePage(JSON.parse(readFileSync(join(dir, file), "utf8")));
  const issues = lintPage(spec);
  for (const [map, value, what] of [[titles, spec.seo.title, "title"], [descriptions, spec.seo.description, "description"]] as const) {
    const other = map.get(value);
    if (other) issues.push({ level: "error", where: "seo", message: `duplicate ${what} with ${other}` });
    map.set(value, file);
  }
  const errs = issues.filter((i) => i.level === "error");
  errors += errs.length;
  console.log(`${errs.length ? "FAIL" : "ok  "}    ${file}: ${errs.length} error(s), ${issues.length - errs.length} warning(s)`);
  for (const i of issues) console.log(`  ${i.level === "error" ? "error" : "warn "} ${i.where}: ${i.message}`);
  const hidden = claimUsage(spec).filter((c) => !c.renders);
  if (hidden.length) console.log(`  info  claims referenced but not rendering today: ${hidden.map((c) => `${c.id} (${c.status})`).join(", ")}`);
}
console.log(errors ? `\n${errors} error(s).` : "\nContent lint passed.");
process.exit(errors ? 1 : 0);
