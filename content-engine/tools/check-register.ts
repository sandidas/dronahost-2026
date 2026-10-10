/**
 * Checks the keyword register: one owner per keyword and URL per locale, valid values, valid plan numbers, and the governor.
 * Exits 1 on any error; warnings (likely overlaps, an empty register, the pause switch) are printed but do not fail.
 * Usage: npx tsx content-engine/tools/check-register.ts [register-file] [--help]
 */
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { isMain } from "./is-main";
import { PLANNER_DIR, loadConfig } from "./load-config";
import { isIsoDate } from "./dates";
import { IN_FLIGHT, LOCALES, STATUSES, isConcreteUrl, norm, readRegister, type Row } from "./register";

export type Issue = { level: "error" | "warn"; line: number; rule: string; message: string };

const AI_CITED = new Set(["", "yes", "no"]);
const re = (s: string): string => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Plan numbers that have a plan file in plans/ or later/ next to the register's planner folder. */
function knownPlans(plannerDir: string): Set<string> {
  const found = new Set<string>();
  for (const dir of ["plans", "later"]) {
    const full = join(plannerDir, dir);
    if (!existsSync(full)) continue;
    for (const f of readdirSync(full)) {
      const m = f.match(/^(\d{2})-/);
      if (m) found.add(m[1]);
    }
  }
  return found;
}

export function checkRegister(file: string, opts: { maxInFlight: number; paused: boolean; plans: Set<string> | null }): { issues: Issue[]; rows: Row[] } {
  const parsed = readRegister(file);
  const issues: Issue[] = parsed.errors.map((e) => ({ level: "error" as const, line: e.line, rule: "R1", message: e.message }));
  const err = (line: number, rule: string, message: string) => issues.push({ level: "error", line, rule, message });
  const warn = (line: number, rule: string, message: string) => issues.push({ level: "warn", line, rule, message });
  const rows = parsed.rows;

  if (rows.length === 0) warn(1, "R14", "no register rows yet");
  for (const r of rows) {
    if (!r.keyword) err(r.line, "R15", "empty keyword");
    if (r.keyword !== r.keyword.toLowerCase()) err(r.line, "R2", `keyword must be lowercase: "${r.keyword}"`);
    if (!(LOCALES as readonly string[]).includes(r.locale)) err(r.line, "R3", `unknown locale "${r.locale}"`);
    if (!(STATUSES as readonly string[]).includes(r.status)) err(r.line, "R4", `unknown status "${r.status}"`);
    if (!AI_CITED.has(r.aiCited)) err(r.line, "R5", `AI cited must be yes, no or blank: "${r.aiCited}"`);
    if (r.url !== "planned" && !r.url.startsWith("/")) err(r.line, "R6", `Target URL must start with "/" or be "planned": "${r.url}"`);
    if (r.review && !isIsoDate(r.review)) err(r.line, "R7", `Next review must be a real YYYY-MM-DD date: "${r.review}"`);
    if (r.status === "published" && !r.review) err(r.line, "R8", "a published row needs a next review date");
    if (opts.plans && r.planNumber && !opts.plans.has(r.planNumber)) err(r.line, "R16", `Plan ${r.planNumber} has no file in plans/ or later/`);
  }

  const live = rows.filter((r) => r.status !== "dropped");
  const byKeyword = new Map<string, Row>();
  for (const r of live) {
    const key = `${r.locale}::${norm(r.keyword)}`;
    const other = byKeyword.get(key);
    if (other) err(r.line, "R9", `"${r.keyword}" (${r.locale}) is already a primary keyword on line ${other.line}`);
    else byKeyword.set(key, r);
  }
  const byUrl = new Map<string, Row>();
  for (const r of live.filter((x) => isConcreteUrl(x.url))) {
    const key = `${r.locale}::${r.url}`;
    const other = byUrl.get(key);
    if (other) err(r.line, "R10", `${r.url} (${r.locale}) already targets "${other.keyword}" on line ${other.line}. Put the phrase in Secondary.`);
    else byUrl.set(key, r);
  }
  const secondaries = new Map<string, Row>();
  for (const r of live) {
    for (const s of r.secondary) {
      const key = `${r.locale}::${norm(s)}`;
      const primary = byKeyword.get(key);
      if (primary) err(r.line, "R11", `secondary "${s}" is a primary keyword on line ${primary.line}`);
      const other = secondaries.get(key);
      if (other && other !== r) err(r.line, "R12", `secondary "${s}" is also a secondary on line ${other.line}`);
      secondaries.set(key, r);
    }
  }
  for (const a of live) {
    for (const b of live) {
      if (a === b || a.locale !== b.locale || a.url === b.url || norm(a.keyword).length >= norm(b.keyword).length || !norm(a.keyword).includes(" ")) continue;
      if (new RegExp(`(^| )${re(norm(a.keyword))}( |$)`).test(norm(b.keyword))) warn(b.line, "R13", `"${b.keyword}" contains "${a.keyword}" (line ${a.line}) but targets a different page. Check the intents differ.`);
    }
  }

  // Governor: the in-flight cap and the pause switch (the monthly cap is checked by the governor tool, which reads the briefs).
  const inFlight = rows.filter((r) => IN_FLIGHT.has(r.status));
  if (inFlight.length > opts.maxInFlight) err(inFlight[opts.maxInFlight].line, "GV1", `${inFlight.length} pages in flight (briefed, drafting or review); the cap is ${opts.maxInFlight}`);
  if (opts.paused) warn(1, "GV2", "the governor is paused (governor.paused in the config): no new brief may start");
  return { issues, rows };
}

const invoked = isMain(import.meta.url);
if (invoked) {
  if (process.argv.includes("--help")) {
    console.log("check-register [register-file]: validate the keyword register (R1-R16) and the governor in-flight cap (GV1). Paths and caps come from content-engine.config.json.");
    process.exit(0);
  }
  const { config, resolvePath } = loadConfig();
  const file = process.argv.slice(2).find((a) => !a.startsWith("--")) ?? resolvePath(config.paths.register);
  const { issues, rows } = checkRegister(file, { maxInFlight: config.governor.maxInFlight, paused: config.governor.paused, plans: knownPlans(PLANNER_DIR) });
  for (const i of issues) console.log(`  ${i.level === "error" ? "FAIL " : "warn "} ${i.rule} ${file}:${i.line} ${i.message}`);
  const errors = issues.filter((i) => i.level === "error").length;
  const counts = STATUSES.map((s) => `${s} ${rows.filter((r) => r.status === s).length}`).filter((t) => !t.endsWith(" 0"));
  console.log(`${rows.length} register rows (${counts.join(", ")}). ${errors ? `${errors} error(s).` : "Register check passed."}`);
  process.exit(errors ? 1 : 0);
}
