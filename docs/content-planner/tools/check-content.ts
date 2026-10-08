/**
 * check-content v2: pass or fail per rule, with the file, the line and the fix. No score.
 * Reads page specs (.json) and Markdown drafts and posts (.md, .mdx). Groups: Structure, Keyword, Voice, Facts, People,
 * Experience, Sources, Metadata, Schema, Policy, Overlap, Flags. Paths, limits and every word list come from
 * content-planner.config.json and project/rules.config.json. Rules marked "(project rule)" are ours, not Google's (rules/sources.md).
 *
 * Usage: npx tsx docs/content-planner/tools/check-content.ts [file or folder ...] [--help]
 * Default: the drafts and pages folders in the config. Exits 1 if any rule fails.
 * In a Draft (front matter `state` starts with "Draft"), the readiness rules (S4, S5, E1, E3, SO1) report warnings instead of
 * failures, and open [HUMAN REVIEW] flags are allowed. They fail once the state is not Draft.
 */
import { existsSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { compare } from "./similarity";
import { type Ctx, loadContext } from "./content/context";
import { type Doc, loadDoc as loadDocRaw } from "./content/parse";
import { experienceRules, factRules, flagRules, peopleRules, policyRules, sourceRules } from "./content/rules-facts";
import { keywordRules, metadataRules, schemaRules, structureRules, voiceRules } from "./content/rules-text";
import { type Finding, type RuleResult, rule } from "./content/types";

export { loadContext } from "./content/context";
export type { Ctx } from "./content/context";
export type { Doc } from "./content/parse";
export type { RuleResult, Group } from "./content/types";

/** Rules that gate "Ready for owner review". In a Draft they warn. */
const READY_ONLY = new Set(["S4", "S5", "E1", "E3", "SO1"]);

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
    ...structureRules(ctx, doc), ...keywordRules(ctx, doc), ...voiceRules(ctx, doc), ...factRules(ctx, doc), ...peopleRules(ctx, doc),
    ...experienceRules(ctx, doc), ...sourceRules(ctx, doc), ...metadataRules(ctx, doc), ...schemaRules(ctx, doc), ...policyRules(ctx, doc),
    ...(opts.overlap === false ? [] : overlapRules(ctx, doc)), ...flagRules(doc),
  ];
  if (!/^draft/i.test(doc.state)) return results;
  return results.map((r) => READY_ONLY.has(r.id) && !r.ok
    ? { ...r, ok: true, failures: [], warnings: [...r.warnings, ...r.failures], note: "readiness rule: warns in a Draft" }
    : r);
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
        if (other) failures.push({ line: 1, message: `same ${id === "OV3" ? "title" : "description"} as ${other.file}` });
        else seen.set(v, d);
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

function collect(paths: string[]): string[] {
  const files: string[] = [];
  for (const p of paths) {
    if (!existsSync(p)) continue;
    if (statSync(p).isDirectory()) { for (const f of readdirSync(p).sort()) if (/\.(md|mdx|json)$/.test(f) && !/^(README|\.)/.test(f)) files.push(join(p, f)); }
    else files.push(p);
  }
  return files;
}

const invoked = process.argv[1] ? resolve(process.argv[1]) === fileURLToPath(import.meta.url) : false;
/** Loads, checks and reports each file (plus the cross-page duplicate rules). Returns the number of files with failures. */
export function runChecks(ctx: Ctx, files: string[]): number {
  const docs: Doc[] = [];
  const unreadable: string[] = [];
  for (const f of files) {
    try { docs.push(loadDoc(ctx, f)); } catch (e) { unreadable.push(`${f}: ${(e as Error).message}`); }
  }
  const dupes = duplicateRules(docs);
  let failed = unreadable.length;
  for (const u of unreadable) console.log(`\n${u}\n    FAIL could not read`);
  const order = ["Structure", "Keyword", "Voice", "Facts", "People", "Experience", "Sources", "Metadata", "Schema", "Policy", "Overlap", "Flags"];
  for (const d of docs) {
    const all = [...checkDoc(ctx, d), ...(dupes.get(d.file) ?? [])].sort((a, b) => order.indexOf(a.group) - order.indexOf(b.group));
    if (!report(d.file, all)) failed++;
  }
  console.log(`\n${files.length} file(s) checked, ${failed} with failures.`);
  return failed;
}

export { collect as collectFiles };

async function main(): Promise<void> {
  if (process.argv.includes("--help")) {
    console.log("check-content [file or folder ...]: run every content rule (pass or fail, no score) on page specs and Markdown drafts. Default: the drafts and pages folders in content-planner.config.json.");
    process.exit(0);
  }
  const ctx = await loadContext();
  const args = process.argv.slice(2).filter((a) => !a.startsWith("--"));
  const files = collect(args.length ? args : [ctx.resolvePath(ctx.config.paths.drafts), ctx.resolvePath(ctx.config.paths.pages)]);
  process.exit(runChecks(ctx, files) ? 1 : 0);
}

if (invoked) void main();
