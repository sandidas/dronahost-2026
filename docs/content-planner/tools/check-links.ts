/**
 * Markdown link checker: every relative link in the scanned .md files must point to a file or folder that exists.
 * External links (http, https, mailto) and same-page anchors are not fetched. Links inside code fences are ignored.
 * Usage: npx tsx docs/content-planner/tools/check-links.ts [file or folder ...]   Default: the planner folder, CLAUDE.md, docs/rules.
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

if (process.argv.includes("--help")) {
  console.log("check-links [file or folder ...]: fail on any relative Markdown link whose target does not exist. Default: docs/content-planner, CLAUDE.md, docs/rules.");
  process.exit(0);
}

const SKIP_DIRS = new Set(["node_modules", ".git", ".next"]);
function collect(p: string): string[] {
  if (!existsSync(p)) return [];
  if (!statSync(p).isDirectory()) return p.endsWith(".md") ? [p] : [];
  return readdirSync(p).sort().flatMap((n) => (SKIP_DIRS.has(n) ? [] : collect(join(p, n))));
}

const args = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const files = (args.length ? args : ["docs/content-planner", "CLAUDE.md", "docs/rules"]).flatMap(collect);
let broken = 0;
for (const file of files) {
  let fence = false;
  readFileSync(file, "utf8").split("\n").forEach((text, i) => {
    if (text.trim().startsWith("```")) fence = !fence;
    if (fence) return;
    for (const m of text.replace(/`[^`]*`/g, "").matchAll(/\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)) {
      const target = m[1];
      if (/^(https?:|mailto:|#|tel:|\/)/.test(target)) continue; // "/path" is a site route, not a file
      const path = decodeURIComponent(target.split("#")[0]);
      if (!path || existsSync(resolve(dirname(file), path))) continue;
      broken++;
      console.log(`  FAIL ${file}:${i + 1} broken link "${target}". Fix: point it at an existing file.`);
    }
  });
}
console.log(broken ? `\n${broken} broken link(s) in ${files.length} file(s).` : `No broken links in ${files.length} Markdown file(s).`);
process.exit(broken ? 1 : 0);
