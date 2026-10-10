/**
 * Markdown link checker: every relative link in the scanned .md files must point to a file or folder that exists.
 * External links (http, https, mailto) and same-page anchors are not fetched. Links inside code fences are ignored.
 * Usage: npx tsx content-engine/tools/check-links.ts [file or folder ...]   Default: the engine folder, and the host's CLAUDE.md and
 * docs/rules when they exist (next to the engine folder), from any working folder. Fails when no Markdown file is found.
 */
import { readLf } from "./eol";
import { existsSync, readdirSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { ENGINE_DIR } from "./load-config";

if (process.argv.includes("--help")) {
  console.log("check-links [file or folder ...]: fail on any relative Markdown link whose target does not exist. Default: content-engine, CLAUDE.md, docs/rules.");
  process.exit(0);
}

const SKIP_DIRS = new Set(["node_modules", ".git", ".next"]);
function collect(p: string): string[] {
  if (!existsSync(p)) return [];
  if (!statSync(p).isDirectory()) return p.endsWith(".md") ? [p] : [];
  return readdirSync(p).sort().flatMap((n) => (SKIP_DIRS.has(n) ? [] : collect(join(p, n))));
}

const args = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const host = dirname(ENGINE_DIR);
const defaults = [ENGINE_DIR, ...[join(host, "CLAUDE.md"), join(host, "docs/rules")].filter(existsSync)];
const files = (args.length ? args : defaults).flatMap(collect);
if (files.length === 0) {
  console.log(`  FAIL LK0 ${args.join(", ") || ENGINE_DIR}:1 no Markdown file found. Fix: pass an existing .md file or folder`);
  process.exit(1);
}
let broken = 0;
for (const file of files) {
  let fence = false;
  readLf(file).split("\n").forEach((text, i) => {
    if (text.trim().startsWith("```")) fence = !fence;
    if (fence) return;
    for (const m of text.replace(/`[^`]*`/g, "").matchAll(/\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)) {
      const target = m[1];
      if (/^(https?:|mailto:|#|tel:|\/)/.test(target)) continue; // "/path" is a site route, not a file
      let path = target.split("#")[0];
      try { path = decodeURIComponent(path); } catch { /* a stray "%" stays as typed */ }
      if (!path || existsSync(resolve(dirname(file), path))) continue;
      broken++;
      console.log(`  FAIL ${file}:${i + 1} broken link "${target}". Fix: point it at an existing file.`);
    }
  });
}
console.log(broken ? `\n${broken} broken link(s) in ${files.length} file(s).` : `No broken links in ${files.length} Markdown file(s).`);
process.exit(broken ? 1 : 0);
