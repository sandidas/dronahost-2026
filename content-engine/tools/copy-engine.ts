/**
 * Copies the reusable engine (rules, plans, templates, schemas, eval, tools, claude, later, README, CHANGELOG) into another
 * project's content-engine folder. It never copies project/ or the config. Plain Node, so it works the same on macOS,
 * Linux and Windows. Usage: npx tsx content-engine/tools/copy-engine.ts --to <project folder> [--with-sample] [--dry-run] [--help]
 */
import { cpSync, existsSync, mkdirSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { isMain } from "./is-main";
import { PLANNER_DIR } from "./load-config";

export const CORE_DIRS = ["rules", "plans", "templates", "schemas", "eval", "tools", "claude", "later"];
export const CORE_FILES = ["README.md", "CHANGELOG.md"];

export function copyEngine(opts: { from?: string; toPlanner: string; withSample?: boolean; dryRun?: boolean }): string[] {
  const from = opts.from ?? PLANNER_DIR;
  const copied: string[] = [];
  const skip = (src: string): boolean => /(^|[\\/])(\.DS_Store|node_modules)$/.test(src) || (!opts.withSample && /[\\/]eval[\\/]sample-project$/.test(src));
  for (const d of CORE_DIRS) {
    const src = join(from, d);
    if (!existsSync(src)) continue;
    copied.push(`${d}/`);
    if (!opts.dryRun) cpSync(src, join(opts.toPlanner, d), { recursive: true, filter: (s) => !skip(s) });
  }
  for (const f of CORE_FILES) {
    if (!existsSync(join(from, f))) continue;
    copied.push(f);
    if (!opts.dryRun) { mkdirSync(opts.toPlanner, { recursive: true }); cpSync(join(from, f), join(opts.toPlanner, f)); }
  }
  return copied;
}

const invoked = isMain(import.meta.url);
if (invoked) {
  const args = process.argv.slice(2);
  if (args.includes("--help") || !args.includes("--to")) {
    console.log("copy-engine --to <project folder> [--with-sample] [--dry-run]: copy the reusable engine to <project>/content-engine. Never copies project/ or the config.");
    process.exit(args.includes("--help") ? 0 : 1);
  }
  const target = resolve(args[args.indexOf("--to") + 1] ?? "");
  if (!existsSync(target) || !statSync(target).isDirectory()) {
    console.log(`  FAIL copy-engine ${target} is not a folder. Fix: create the project folder first, then run this again.`);
    process.exit(1);
  }
  const toPlanner = join(target, "content-engine");
  if (resolve(toPlanner) === resolve(PLANNER_DIR)) { console.log("  FAIL copy-engine the target is this engine's own folder. Fix: pass another project folder."); process.exit(1); }
  const copied = copyEngine({ toPlanner, withSample: args.includes("--with-sample"), dryRun: args.includes("--dry-run") });
  console.log(`${args.includes("--dry-run") ? "Would copy" : "Copied"} ${copied.join(", ")}\n  to ${relative(process.cwd(), toPlanner) || toPlanner}`);
  console.log("Next, in the new project: npm i -D tsx zod && npx tsx content-engine/tools/install.ts");
}
