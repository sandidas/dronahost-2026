/**
 * Installs the engine into a host project: Claude commands, agents and skills, npm scripts, and a first project/ folder.
 * Usage: npx tsx content-engine/tools/install.ts [--host dir] [--planner dir] [--dry-run]
 */
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { askMissing, initProject } from "./init-project";
import { isMain } from "./is-main";

const PLANNER_DIR = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/** The one script map. `{p}` is the planner path relative to the host. */
export const SCRIPT_FILES: Record<string, string> = {
  "content:check": "check-content", "content:register": "check-register", "content:governor": "governor", "content:eval": "eval",
  "content:gen-schema": "gen-schema", "content:suggest-links": "suggest-links", "content:similarity": "similarity", "content:owed": "owed",
  "content:gsc-report": "gsc-report", "content:refresh-queue": "refresh-queue", "content:install": "install", "content:init-project": "init-project",
  "content:links": "check-links", "content:no-brand": "check-no-brand", "content:config": "check-config", "content:schemas": "check-schemas", "content:resolve": "resolve", "content:ci": "ci", "content:copy": "copy-engine", "content:voice": "voice-card", "content:changed": "check-changed", "content:posts": "wp-posts", "content:webhook": "wp-webhook",
};
export const scriptMap = (plannerRel: string): Record<string, string> =>
  Object.fromEntries(Object.entries(SCRIPT_FILES).map(([k, f]) => [k, `tsx ${plannerRel}/tools/${f}.ts`]));

export type InstallOptions = { host: string; planner: string; dryRun: boolean; interactive: boolean };
export type InstallReport = { lines: string[]; failed: boolean; changes: number };

function copyAll(from: string, to: string, label: string, o: InstallOptions, r: InstallReport): void {
  if (!existsSync(from)) return;
  for (const f of readdirSync(from).filter((n) => n.endsWith(".md")).sort()) {
    const src = join(from, f);
    const dst = join(to, f);
    if (existsSync(dst)) {
      const same = readFileSync(src).equals(readFileSync(dst));
      r.lines.push(same ? `  same ${label}/${f}` : `  differs, kept ${label}/${f} (your copy is different; compare it by hand)`);
      continue;
    }
    r.lines.push(`  ${o.dryRun ? "would copy" : "copied"} ${label}/${f}`);
    r.changes++;
    if (!o.dryRun) { mkdirSync(to, { recursive: true }); copyFileSync(src, dst); }
  }
}

/** Each skill is a folder with a SKILL.md: claude/skills/<name>/SKILL.md -> .claude/skills/<name>/SKILL.md. */
function copySkills(from: string, to: string, o: InstallOptions, r: InstallReport): void {
  if (!existsSync(from)) return;
  for (const name of readdirSync(from).filter((n) => existsSync(join(from, n, "SKILL.md"))).sort()) {
    copyAll(join(from, name), join(to, name), `.claude/skills/${name}`, o, r);
  }
}

export async function install(o: InstallOptions): Promise<InstallReport> {
  const r: InstallReport = { lines: [], failed: false, changes: 0 };
  const host = resolve(o.host);
  const planner = resolve(o.planner);
  const pkgFile = join(host, "package.json");
  if (!existsSync(pkgFile)) {
    r.failed = true;
    r.lines.push(`  FAIL IN1 ${pkgFile}:1 no package.json in the host folder. Fix: run from the host project root or pass --host <dir>.`);
    return r;
  }
  copyAll(join(planner, "claude/commands"), join(host, ".claude/commands"), ".claude/commands", o, r);
  copyAll(join(planner, "claude/agents"), join(host, ".claude/agents"), ".claude/agents", o, r);
  copySkills(join(planner, "claude/skills"), join(host, ".claude/skills"), o, r);

  const pkg = JSON.parse(readFileSync(pkgFile, "utf8")) as { scripts?: Record<string, string> };
  const scripts = pkg.scripts ?? {};
  const rel = relative(host, planner).split(sep).join("/") || ".";
  let added = 0;
  for (const [name, cmd] of Object.entries(scriptMap(rel))) {
    if (name in scripts) { if (scripts[name] !== cmd) r.lines.push(`  differs, kept npm script ${name}`); continue; }
    scripts[name] = cmd;
    added++;
  }
  if (added) {
    r.changes += added;
    r.lines.push(`  ${o.dryRun ? "would add" : "added"} ${added} npm script(s) to package.json`);
    if (!o.dryRun) writeFileSync(pkgFile, JSON.stringify({ ...pkg, scripts }, null, 2) + "\n");
  } else r.lines.push("  npm scripts already present");

  if (!existsSync(join(planner, "project")) || !existsSync(join(planner, "content-engine.config.json"))) {
    const cmd = `npx tsx ${rel}/tools/init-project.ts --name "ExampleCo" --domain example.com --owner "Sam Example" --locale en-US`;
    if (o.dryRun) r.lines.push(`  would create the project/ folder and config (init-project)`);
    else if (!o.interactive) r.lines.push(`  project/ or the config is missing. Run: ${cmd}`);
    else {
      const res = initProject({ ...(await askMissing({})), out: planner });
      r.changes += res.created.length;
      r.lines.push(`  init-project created ${res.created.length} file(s), kept ${res.kept.length}`);
    }
  }
  r.lines.push(r.changes ? "" : "Nothing changed: already installed.");
  r.lines.push("Next steps:", "  1. npm run content:config and npm run content:no-brand", "  2. Set the brand and voice in project/settings.json and project/voice.json (npm run content:voice shows them), then fill project/PROJECT.md (business facts)", "  3. Add rows to project/keyword-register.md, then npm run content:register");
  return r;
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  if (args.includes("--help")) {
    console.log("install [--host dir] [--planner dir] [--dry-run]\nCopies Claude commands, agents and skills, adds npm scripts (never removes any), and sets up project/ if missing. Safe to run twice.");
    return;
  }
  const opt = (n: string): string | undefined => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : undefined; };
  const r = await install({ host: opt("--host") ?? process.cwd(), planner: opt("--planner") ?? PLANNER_DIR, dryRun: args.includes("--dry-run"), interactive: Boolean(process.stdin.isTTY) });
  console.log(r.lines.join("\n"));
  process.exit(r.failed ? 1 : 0);
}

if (isMain(import.meta.url)) void main();
