/**
 * check-content v2: pass or fail per rule, with the file, the line and the fix. No score.
 * Reads page specs (.json) and Markdown drafts and posts (.md, .mdx). Groups: Structure, Keyword, Voice, Facts, People,
 * Experience, Sources, Metadata, Schema, Policy, Overlap, Blueprint, Intent, Trust, Elements, Flags. Paths, limits and every word list come from
 * content-engine.config.json and project/rules.config.json. Rules marked "(project rule)" are ours, not Google's (rules/sources.md).
 *
 * Usage: npx tsx content-engine/tools/check-content.ts [file or folder ...] [--help]
 * Default: the drafts and pages folders in the config. Exits 1 if any rule fails.
 * In a Draft (front matter `state` starts with "Draft"), the readiness rules (S4, S5, E1, E3, SO1, IN2, IN3, IN5, TR2, TR4, TR6,
 * TR7, CP1 to CP5) report warnings instead of failures, and open [HUMAN REVIEW] flags are allowed. They fail once the state is not Draft.
 */
import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { cliError, isMain } from "./is-main";
import { compare } from "./similarity";
import { type Ctx, hostCwd, loadContext } from "./content/context";
import { type Doc, loadDoc as loadDocRaw } from "./content/parse";
import { blueprintRules, loadBlueprints, runCopySource, runVisibility, signatureRules } from "./content/rules-blueprint";
import { intentRules, trustRules } from "./content/rules-intent-trust";
import { experienceRules, factRules, flagRules, peopleRules, policyRules, sourceRules } from "./content/rules-facts";
import { elementRules, inboundRules, qualityRules } from "./content/rules-quality";
import { keywordRules, metadataRules, schemaRules, structureRules, voiceRules } from "./content/rules-text";
import { type Finding, GROUP_ORDER, type RuleResult, normSlug, rule } from "./content/types";
import { CONFIG_FILE } from "./load-config";

export { loadContext } from "./content/context";
export type { Ctx } from "./content/context";
export type { Doc } from "./content/parse";
export type { RuleResult, Group } from "./content/types";

/** Rules that gate "Ready for owner review". In a Draft they warn. */
const READY_ONLY = new Set(["S4", "S5", "E1", "E3", "SO1", "IN2", "IN3", "IN5", "TR2", "TR4", "TR6", "TR7", "CP1", "CP2", "CP3", "CP4", "CP5"]);
/** Rules no owner waiver can turn off: forbidden claims, the location rule, pressure wording and unknown claim references. */
export const NON_WAIVABLE = new Set(["PO2", "PO4", "TR8", "F3"]);

export const loadDoc = (ctx: Ctx, file: string): Doc => loadDocRaw(file, ctx.copy);

function overlapRules(ctx: Ctx, doc: Doc): RuleResult[] {
  const matches = compare(doc.file, { config: ctx.config, resolvePath: ctx.resolvePath });
  const over = matches.filter((m) => m.containment > ctx.config.limits.similarity.threshold);
  const own = over.filter((m) => m.rule === "OV1");
  const serp = over.filter((m) => m.rule === "OV2");
  const f = (ms: typeof matches): Finding[] => ms.map((m) => ({ line: 1, message: `${(m.containment * 100).toFixed(0)}% of the shingles also appear in ${m.other} ("${m.phrase}")` }));
  return [
    rule("OV1", "Overlap", "Not a rewrite of our own pages (project rule)", f(own)),
    rule("OV2", "Overlap", "Not a rewrite of the SERP notes in the brief (project rule)", f(serp)),
  ];
}

export function checkDoc(ctx: Ctx, doc: Doc, opts: { overlap?: boolean } = {}): RuleResult[] {
  const results = [
    ...structureRules(ctx, doc), ...keywordRules(ctx, doc), ...voiceRules(ctx, doc), ...qualityRules(ctx, doc), ...elementRules(ctx, doc), ...factRules(ctx, doc), ...peopleRules(ctx, doc),
    ...experienceRules(ctx, doc), ...sourceRules(ctx, doc), ...metadataRules(ctx, doc), ...schemaRules(ctx, doc), ...policyRules(ctx, doc),
    ...(opts.overlap === false ? [] : overlapRules(ctx, doc)), ...blueprintRules(ctx, doc), ...intentRules(ctx, doc), ...trustRules(ctx, doc), ...flagRules(doc),
  ];
  const staged = !/^draft/i.test(doc.state) ? results : results.map((r) => READY_ONLY.has(r.id) && !r.ok
    ? { ...r, ok: true, failures: [], warnings: [...r.warnings, ...r.failures], note: "readiness rule: warns in a Draft" }
    : r);
  return applyOwnerWaivers(doc, staged);
}

/**
 * An owner decision can overrule a rule for one page. Front matter: `waive_rules: K2, P2`, `waive_reason`, `waive_approved_by`.
 * The failures of those rules then show as warnings that name the owner. Without a reason and an approver the waiver is ignored.
 */
function applyOwnerWaivers(doc: Doc, results: RuleResult[]): RuleResult[] {
  const f = doc.front;
  const ids = new Set((f.waive_rules ?? "").split(/[,;\s]+/).map((x) => x.trim().toUpperCase()).filter((x) => x && !NON_WAIVABLE.has(x)));
  if (!ids.size || !f.waive_reason?.trim() || !f.waive_approved_by?.trim()) return results;
  const note = `waived by ${f.waive_approved_by.trim()}: ${f.waive_reason.trim()}`;
  return results.map((r) => ids.has(r.id) && !r.ok ? { ...r, ok: true, failures: [], warnings: [...r.warnings, ...r.failures], note } : r);
}

/** Cross-page rules: no two pages share a title or a description. */
export function duplicateRules(docs: Doc[]): Map<string, RuleResult[]> {
  const out = new Map<string, RuleResult[]>();
  for (const [id, name, pick] of [["OV3", "Title is unique across pages", (d: Doc) => d.title], ["OV4", "Description is unique across pages", (d: Doc) => d.description]] as const) {
    const seen = new Map<string, Doc>();
    for (const d of docs) {
      const v = pick(d)?.trim().toLowerCase();
      const failures: Finding[] = [];
      if (v) {
        const other = seen.get(v);
        // A Markdown draft and the page spec built from it (same URL, different file kind) may share a title. Anything else clashes.
        const sameUrl = other && other.kind !== d.kind && normSlug(other.front.slug) !== "" && normSlug(other.front.slug) === normSlug(d.front.slug);
        if (other && !sameUrl) failures.push({ line: 1, message: `same ${id === "OV3" ? "title" : "description"} as ${other.file}` });
        else if (!other) seen.set(v, d);
      }
      out.set(d.file, [...(out.get(d.file) ?? []), rule(id, "Overlap", name, failures)]);
    }
  }
  return out;
}

export function report(file: string, results: RuleResult[]): boolean {
  console.log(`\n${file}`);
  let group = "";
  for (const r of results) {
    if (r.group !== group) { group = r.group; console.log(`  ${group}`); }
    const tag = r.skipped ? "SKIP" : r.ok ? "PASS" : "FAIL";
    console.log(`    ${tag} ${r.id} ${r.name}${r.note ? ` (${r.note})` : ""}`);
    for (const f of r.failures) console.log(`         FAIL ${r.id} ${file}:${f.line} ${f.message}`);
    for (const w of r.warnings) console.log(`         warn ${r.id} ${file}:${w.line} ${w.message}`);
  }
  return results.every((r) => r.ok);
}

/** Content files under the given paths, folders walked recursively. A path that does not exist is returned in `missing`. */
function collect(paths: string[]): { files: string[]; missing: string[] } {
  const files: string[] = [];
  const missing: string[] = [];
  const walk = (dir: string): void => {
    for (const f of readdirSync(dir).sort()) {
      if (/^(README|\.)/.test(f) || f === "node_modules") continue;
      const p = join(dir, f);
      if (statSync(p).isDirectory()) walk(p);
      else if (/\.(md|mdx|json)$/.test(f)) files.push(p);
    }
  };
  for (const p of paths) {
    if (!existsSync(p)) missing.push(p);
    else if (statSync(p).isDirectory()) walk(p);
    else files.push(p);
  }
  return { files, missing };
}

const invoked = isMain(import.meta.url);
/**
 * The host page-spec adapter: the project's own checks of a page spec that the engine cannot know (section schemas, layout rules).
 * `adapters.pageSpec.command` runs once per run when a page spec is among the files. It must exit 0 to pass.
 */
export function hostPageSpecCheck(ctx: Ctx, docs: Doc[]): { ran: boolean; ok: boolean } {
  const command = ctx.config.adapters.pageSpec?.command;
  if (!command || !docs.some((d) => d.kind === "json")) return { ran: false, ok: true };
  console.log("\nHost page-spec check");
  const r = spawnSync(command, { shell: true, encoding: "utf8", cwd: hostCwd(ctx) });
  const ok = r.status === 0;
  console.log(`    ${ok ? "PASS" : "FAIL"} SC2 Page specs satisfy the host's own schema and layout checks (${command})`);
  if (!ok) for (const l of `${r.stdout}${r.stderr}`.split("\n").filter(Boolean).slice(0, 12)) console.log(`         ${l}`);
  return { ran: true, ok };
}

/** Loads, checks and reports each file (plus the cross-page duplicate rules). Returns the number of files with failures. */
export function runChecks(ctx: Ctx, files: string[]): number {
  const docs: Doc[] = [];
  const unreadable: string[] = [];
  for (const f of files) {
    try { docs.push(loadDoc(ctx, f)); } catch (e) { unreadable.push(`${f}: ${(e as Error).message}`); }
  }
  // The Blueprint group needs the project's blueprint data and, for page specs, the host's two adapter results.
  const hasSpec = docs.some((d) => d.kind === "json");
  ctx.blueprints = ctx.blueprints ?? loadBlueprints(ctx);
  let visError = "";
  if (hasSpec && ctx.blueprints) {
    if (ctx.visibility === undefined) { const v = runVisibility(ctx); ctx.visibility = v.vis; visError = v.error ?? ""; }
    ctx.copySource = ctx.copySource ?? runCopySource(ctx);
  }
  const dupes = duplicateRules(docs);
  const sigs = signatureRules(docs, ctx.blueprints ?? null);
  const inbound = inboundRules(ctx, docs);
  let failed = unreadable.length;
  for (const u of unreadable) console.log(`\n${u}\n    FAIL could not read`);
  if (visError) { failed++; console.log(`\nHost visibility adapter\n  FAIL BP0 ${CONFIG_FILE}:1 ${visError}. Fix: make adapters.pageVisibility.command exit 0 and print the visibility JSON, or remove it from the config`); }
  for (const d of docs) {
    const all = [...checkDoc(ctx, d), ...(dupes.get(d.file) ?? []), ...(sigs.get(d.file) ?? []), ...(inbound.get(d.file) ?? [])].sort((a, b) => GROUP_ORDER.indexOf(a.group) - GROUP_ORDER.indexOf(b.group));
    if (!report(d.file, all)) failed++;
  }
  const host = hostPageSpecCheck(ctx, docs);
  if (!host.ok) failed++;
  console.log(`\n${files.length} file(s) checked, ${failed} with failures.`);
  return failed;
}

export { collect as collectFiles };

async function main(): Promise<void> {
  if (process.argv.includes("--help")) {
    console.log("check-content [file or folder ...]: run every content rule (pass or fail, no score) on page specs and Markdown drafts. Default: the drafts and pages folders in content-engine.config.json.");
    process.exit(0);
  }
  const ctx = await loadContext();
  const args = process.argv.slice(2).filter((a) => !a.startsWith("--"));
  // The default folders may not exist yet in a new project; a path the user typed must exist.
  const { files, missing } = collect(args.length ? args : [ctx.resolvePath(ctx.config.paths.drafts), ctx.resolvePath(ctx.config.paths.pages)].filter(existsSync));
  for (const m of missing) console.log(`  FAIL CC0 ${m}:1 no such file or folder. Fix: pass an existing page spec, draft or folder`);
  const failed = runChecks(ctx, files);
  process.exit(failed || missing.length ? 1 : 0);
}

if (invoked) main().catch((e) => cliError("check-content", CONFIG_FILE, e));
