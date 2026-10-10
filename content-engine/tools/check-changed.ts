/**
 * Runs check-content on the content files that changed (a pull request), so a failure blocks the merge. A content file is a page
 * spec in the pages folder, a draft in the drafts folder, or a file in the posts folder (when posts are files), all from the config.
 * Usage: npx tsx content-engine/tools/check-changed.ts [--base <git ref>] [--files a,b,c] [--all] [--help]
 *   --base   compare HEAD with this ref (a merge base is used). If the ref cannot be read, every content file is checked.
 *   --files  check exactly these files (no git needed). --all checks every content file.
 */
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { cliError, isMain } from "./is-main";
import { CONFIG_FILE } from "./load-config";
import type { Config } from "../schemas/config";
import { loadContext, runChecks } from "./check-content";

/** Content folders as paths relative to `root`, with the file kinds each holds. */
export function contentFolders(config: Config, resolvePath: (p: string) => string, root: string): { dir: string; ext: RegExp }[] {
  const rel = (p: string): string => relative(root, resolvePath(p)).split("\\").join("/");
  const folders = [{ dir: rel(config.paths.pages), ext: /\.json$/ }, { dir: rel(config.paths.drafts), ext: /\.(md|mdx)$/ }];
  if (config.paths.posts && config.adapters.posts === "files") folders.push({ dir: rel(config.paths.posts), ext: /\.(md|mdx|json)$/ });
  return folders;
}

export function selectContentFiles(changed: string[], folders: { dir: string; ext: RegExp }[]): string[] {
  return changed.filter((f) => folders.some((d) => f.startsWith(`${d.dir}/`) && d.ext.test(f) && !/(^|\/)(README|\.)/.test(f.slice(d.dir.length + 1)))).sort();
}

function allFiles(folders: { dir: string; ext: RegExp }[], root: string): string[] {
  const out: string[] = [];
  const walk = (dir: string): void => {
    const abs = join(root, dir);
    if (!existsSync(abs)) return;
    for (const n of readdirSync(abs).sort()) {
      const p = `${dir}/${n}`;
      if (statSync(join(root, p)).isDirectory()) walk(p);
      else out.push(p);
    }
  };
  for (const f of folders) walk(f.dir);
  return selectContentFiles(out, folders);
}

export function changedSince(base: string, root: string): string[] | null {
  try {
    const out = execFileSync("git", ["diff", "--name-only", "--diff-filter=ACMR", `${base}...HEAD`], { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
    return out.split("\n").map((l) => l.trim()).filter(Boolean);
  } catch {
    return null;
  }
}

/** The repository root: git diff prints paths relative to it, whatever folder the tool runs from. Falls back to the current folder. */
export function gitRoot(cwd = process.cwd()): string {
  try { return execFileSync("git", ["rev-parse", "--show-toplevel"], { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim() || cwd; } catch { return cwd; }
}

const invoked = isMain(import.meta.url);
async function main(): Promise<void> {
  const args = process.argv.slice(2);
  if (args.includes("--help")) {
    console.log("check-changed [--base ref] [--files a,b] [--all]: run check-content on the content files that changed in this branch. Exits 1 if any file fails.");
    return;
  }
  const val = (flag: string): string | undefined => (args.indexOf(flag) >= 0 ? args[args.indexOf(flag) + 1] : undefined);
  const ctx = await loadContext();
  const root = gitRoot();
  const folders = contentFolders(ctx.config, ctx.resolvePath, root);
  let files: string[];
  const explicit = val("--files");
  if (explicit) files = explicit.split(",").map((f) => f.trim()).filter(Boolean);
  else if (args.includes("--all")) files = allFiles(folders, root);
  else {
    const base = val("--base") ?? "origin/main";
    const changed = changedSince(base, root);
    if (changed === null) { console.log(`note: could not compare with ${base}; checking every content file`); files = allFiles(folders, root); }
    else files = selectContentFiles(changed, folders);
  }
  if (files.length === 0) { console.log("No content files changed: nothing to check."); return; }
  process.exitCode = runChecks(ctx, explicit ? files : files.map((f) => join(root, f))) ? 1 : 0;
}
if (invoked) main().catch((e) => cliError("check-changed", CONFIG_FILE, e));
