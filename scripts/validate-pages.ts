/**
 * Validates every page spec in content/pages/*.json against the section schemas, then checks that no two pages share a
 * layout signature. Exits 1 on any error so CI fails the build. Warnings (not failures) are printed for guidelines such as
 * FAQ answers under 40 words.
 * Usage: npx tsx scripts/validate-pages.ts [dir]
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { findSignatureCollisions } from "../lib/content/layout-signature";
import { parsePage } from "../lib/content/page";
import { wordCount } from "../lib/content/schemas/common";

const dir = process.argv[2] ?? "content/pages";
let files: string[] = [];
try {
  files = readdirSync(dir).filter((f) => f.endsWith(".json"));
} catch {
  console.log(`No ${dir} folder yet: nothing to validate.`);
  process.exit(0);
}

let errors = 0;
const pages: ReturnType<typeof parsePage>[] = [];
for (const file of files) {
  try {
    const page = parsePage(JSON.parse(readFileSync(join(dir, file), "utf8")));
    pages.push(page);
    for (const s of page.sections) {
      if (s.type !== "FAQSection") continue;
      for (const item of s.content.items) {
        const n = wordCount(item.a);
        if (n < 40 && !item.a.includes("{{")) console.log(`warning ${file}: FAQ "${item.q}" has a ${n}-word answer (guideline is 40 to 80)`);
      }
    }
    console.log(`ok      ${file} (${page.sections.length} sections)`);
  } catch (err) {
    errors++;
    console.log(`FAIL    ${file}\n${(err as Error).message}`);
  }
}

for (const c of findSignatureCollisions(pages)) {
  errors++;
  console.log(`FAIL    pages share a layout signature (${c.signature}): ${c.pages.join(", ")}`);
}

console.log(errors ? `\n${errors} problem(s).` : `\nAll ${files.length} page spec(s) valid.`);
process.exit(errors ? 1 : 0);
