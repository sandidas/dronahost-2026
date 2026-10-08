/**
 * Blueprint rules (rules/page-blueprints.md, Part E): pass or fail, no score. They run on page specs only. Blueprint data comes
 * from the project (paths.blueprints). Which sections are visible after gating, and how many words they hold, comes from the
 * host's visibility adapter; whether page copy hides in a component comes from the host's copy-source adapter. Without that
 * data a rule is skipped with a note, never passed silently.
 */
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { type Blueprint, type Blueprints, BlueprintsSchema, type Visibility, VisibilitySchema } from "../../schemas/blueprints";
import type { Ctx } from "./context";
import { lineOf, type Doc, wc } from "./parse";
import { type Finding, type RuleResult, rule, skipped } from "./types";

type Json = Record<string, unknown>;
type VisSection = Visibility["pages"][string]["sections"][number];

export type CopySourceResult = { ran: boolean; ok: boolean; lines: string[] };

export function loadBlueprints(ctx: Pick<Ctx, "config" | "resolvePath">): Blueprints | null {
  const rel = process.env.CHECK_CONTENT_BLUEPRINTS ?? ctx.config.paths.blueprints;
  if (!rel) return null;
  const file = process.env.CHECK_CONTENT_BLUEPRINTS ? rel : ctx.resolvePath(rel);
  return existsSync(file) ? BlueprintsSchema.parse(JSON.parse(readFileSync(file, "utf8"))) : null;
}

/** Runs the host's visibility adapter once. Returns null when none is configured, or when it prints something unreadable. */
export function loadVisibility(ctx: Pick<Ctx, "config">): Visibility | null {
  const file = process.env.CHECK_CONTENT_VISIBILITY;
  if (file) return existsSync(file) ? VisibilitySchema.parse(JSON.parse(readFileSync(file, "utf8"))) : null;
  const command = ctx.config.adapters.pageVisibility?.command;
  if (!command) return null;
  const r = spawnSync(command, { shell: true, encoding: "utf8", maxBuffer: 8 * 1024 * 1024 });
  if (r.status !== 0) return null;
  const start = r.stdout.indexOf("{");
  try { return VisibilitySchema.parse(JSON.parse(r.stdout.slice(start))); } catch { return null; }
}

/** Runs the host's copy-source adapter once. */
export function runCopySource(ctx: Pick<Ctx, "config">): CopySourceResult | null {
  const file = process.env.CHECK_CONTENT_COPYSOURCE;
  if (file) return existsSync(file) ? (JSON.parse(readFileSync(file, "utf8")) as CopySourceResult) : null;
  const command = ctx.config.adapters.copySource?.command;
  if (!command) return null;
  const r = spawnSync(command, { shell: true, encoding: "utf8", maxBuffer: 8 * 1024 * 1024 });
  return { ran: true, ok: r.status === 0, lines: `${r.stdout}${r.stderr}`.split("\n").map((l) => l.trim()).filter(Boolean).slice(0, 40) };
}

const NAME = "Blueprint";
const specOf = (doc: Doc): Json => JSON.parse(doc.raw.join("\n")) as Json;
const sectionsOf = (spec: Json): Json[] => (Array.isArray(spec.sections) ? (spec.sections as Json[]) : []);
const isType = (type: string, name: string, heroTypes: string[]): boolean => (name === "Hero" ? heroTypes.includes(type) : type === name);

/** Values at a dotted path. `[*]` walks every item of an array. */
export function valuesAt(root: unknown, path: string): unknown[] {
  let cur: unknown[] = [root];
  for (const part of path.split(".")) {
    const star = part.endsWith("[*]");
    const key = star ? part.slice(0, -3) : part;
    cur = cur.flatMap((v) => {
      const next = v && typeof v === "object" ? (v as Json)[key] : undefined;
      if (star) return Array.isArray(next) ? next : [];
      return next === undefined ? [] : [next];
    });
  }
  return cur;
}

const gateText = (s: VisSection): string => (s.missing.length ? `needs ${s.missing.join(", ")}` : "its gate is not met");

/** Status for one page: Ready when every required section is visible, otherwise Blocked with the sections and facts. */
export function pageStatus(blueprint: Blueprint, heroTypes: string[], sections: VisSection[]): { status: "Ready" | "Blocked"; why: string[] } {
  const why: string[] = [];
  for (const req of blueprint.required) {
    const candidates = sections.filter((s) => isType(s.type, req, heroTypes));
    if (candidates.some((s) => s.visible)) continue;
    why.push(candidates.length ? `${req} is hidden (${candidates.map(gateText).join("; ")})` : `${req} is missing from the page spec`);
  }
  return { status: why.length ? "Blocked" : "Ready", why };
}

function limitRules(bp: Blueprints, doc: Doc, spec: Json): RuleResult {
  const fails: Finding[] = [];
  for (const s of sectionsOf(spec)) {
    const type = String(s.type);
    for (const lim of bp.sectionLimits[type] ?? []) {
      for (const v of valuesAt(s, lim.path)) {
        const n = lim.unit === "items" ? (Array.isArray(v) ? v.length : -1) : typeof v === "string" ? (lim.unit === "chars" ? v.length : wc(v.replace(/\{\{[^}]*\}\}/g, ""))) : -1;
        if (n < 0 || (typeof v === "string" && v.includes("{{") && lim.unit === "words")) continue;
        const sample = typeof v === "string" ? v : String(s.id);
        if (lim.max !== undefined && n > lim.max) fails.push({ line: lineOf(doc.raw, sample), message: `${type} "${s.id}": ${lim.what} has ${n} ${lim.unit}, the limit is ${lim.max}` });
        else if (lim.min !== undefined && n < lim.min) fails.push({ line: lineOf(doc.raw, sample), message: `${type} "${s.id}": ${lim.what} has ${n} ${lim.unit}, the minimum is ${lim.min}` });
      }
    }
  }
  return rule("BP5", NAME, "Every section field is inside its limit", fails);
}

function ctaRules(bp: Blueprints, ctx: Ctx, doc: Doc, spec: Json): RuleResult {
  const primary: { label: string; where: string }[] = [];
  const secondary: { label: string; where: string }[] = [];
  const walk = (v: unknown, path: string): void => {
    if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${path}[${i}]`));
    else if (v && typeof v === "object") {
      for (const [k, x] of Object.entries(v as Json)) {
        const label = x && typeof x === "object" ? (x as Json).label : undefined;
        if (typeof label === "string" && bp.ctaKeys.primary.includes(k)) primary.push({ label, where: `${path}.${k}` });
        else if (typeof label === "string" && bp.ctaKeys.secondary.includes(k)) secondary.push({ label, where: `${path}.${k}` });
        else walk(x, path ? `${path}.${k}` : k);
      }
    }
  };
  walk(spec, "");
  const fails: Finding[] = [];
  const at = (l: string): number => lineOf(doc.raw, l);
  const distinct = (xs: { label: string }[]): string[] => [...new Set(xs.map((x) => x.label.trim().toLowerCase()))];
  if (distinct(primary).length > 1) fails.push({ line: at(primary[1].label), message: `more than one primary call to action label: ${[...new Set(primary.map((p) => `"${p.label}"`))].join(", ")}. Use one label wherever it appears` });
  if (distinct(secondary).length > 1) fails.push({ line: at(secondary[1].label), message: `more than one secondary action: ${[...new Set(secondary.map((p) => `"${p.label}"`))].join(", ")}. At most one` });
  const banned = [...ctx.config.cta.bannedLabels, ...(ctx.rules.bannedCtaLabels ?? [])].map((b) => b.toLowerCase());
  const price = new RegExp(bp.pricePattern);
  for (const c of [...primary, ...secondary]) {
    if (banned.includes(c.label.trim().toLowerCase())) fails.push({ line: at(c.label), message: `banned button label "${c.label}"` });
    if (price.test(c.label)) fails.push({ line: at(c.label), message: `a price inside the button label "${c.label}"` });
  }
  return rule("BP7", NAME, "One primary label, at most one secondary, no banned label, no price in a label", fails);
}

/** Blueprint rules for one page spec. Markdown drafts and articles are not page specs: the group is skipped. */
export function blueprintRules(ctx: Ctx, doc: Doc): RuleResult[] {
  const ids: [string, string][] = [
    ["BP1", "Blueprint named and known"], ["BP2", "Visible sections inside the blueprint range"], ["BP3", "Required sections visible (status Ready or Blocked)"],
    ["BP4", "Sections follow the order pattern"], ["BP5", "Every section field is inside its limit"], ["BP6", "No section type repeated beyond its allowance"],
    ["BP7", "One primary label, at most one secondary, no banned label, no price in a label"], ["BP9", "Page copy comes from the page JSON or the strings file, not a component"],
    ["BP10", "No section shows while its gate is closed"], ["BP11", "Visible words inside the planning range"],
  ];
  const all = (note: string): RuleResult[] => ids.map(([id, name]) => skipped(id, NAME, name, note));
  if (doc.kind !== "json") return all("not a page spec");
  const bps = ctx.blueprints ?? null;
  if (!bps) return all("no blueprint data configured (paths.blueprints)");
  const spec = specOf(doc);
  const name = typeof spec.blueprint === "string" ? spec.blueprint : "";
  const bp = bps.blueprints[name];
  const out: RuleResult[] = [rule("BP1", NAME, "Blueprint named and known", bp ? [] : [{ line: 1, message: name ? `blueprint "${name}" does not exist. Known: ${Object.keys(bps.blueprints).join(", ")}` : `the page spec has no "blueprint" field. Name one of: ${Object.keys(bps.blueprints).join(", ")}` }])];
  if (!bp) return [...out, ...ids.slice(1).map(([id, n]) => skipped(id, NAME, n, "no blueprint"))];

  const authored = sectionsOf(spec);
  const vis = ctx.visibility?.pages[String(spec.path ?? "")]?.sections ?? null;
  const visible = vis?.filter((s) => s.visible) ?? [];
  const noVis = "no visibility adapter result for this page";

  // BP2 Count
  if (!vis) out.push(skipped("BP2", NAME, "Visible sections inside the blueprint range", noVis));
  else {
    const n = visible.length;
    const [lo, hi] = bp.sections;
    const f: Finding[] = [];
    const w: Finding[] = [];
    if (n > hi) f.push({ line: 1, message: `${n} visible sections, the ${name} blueprint allows at most ${hi}` });
    else if (n < bp.publishMinimum) f.push({ line: 1, message: `${n} visible sections, the ${name} blueprint needs at least ${bp.publishMinimum} to publish` });
    else if (n < lo) w.push({ line: 1, message: `${n} visible sections, below the range ${lo} to ${hi}: gating is hiding ${lo - n} or more` });
    out.push(rule("BP2", NAME, "Visible sections inside the blueprint range", f, { warnings: w, note: `${n} visible of ${authored.length}` }));
  }

  // BP3 Required, status
  if (!vis) out.push(skipped("BP3", NAME, "Required sections visible (status Ready or Blocked)", noVis));
  else {
    const st = pageStatus(bp, bps.heroTypes, vis);
    out.push(rule("BP3", NAME, "Required sections visible (status Ready or Blocked)", st.why.map((m) => ({ line: 1, message: `Blocked: ${m}` })), { note: `Status: ${st.status}` }));
  }

  // BP4 Order
  if (!vis) out.push(skipped("BP4", NAME, "Sections follow the order pattern", noVis));
  else {
    const f: Finding[] = [];
    const w: Finding[] = [];
    const pos = (type: string): number => bp.order.findIndex((o) => isType(type, o, bps.heroTypes));
    let maxSeen = -1;
    let maxType = "";
    for (const s of visible) {
      const p = pos(s.type);
      const req = bp.required.some((r) => isType(s.type, r, bps.heroTypes));
      const at = lineOf(doc.raw, `"id": "${s.id}"`);
      if (p < 0) { w.push({ line: at, message: `${s.type} is not in the ${name} order pattern` }); continue; }
      if (p < maxSeen) (req ? f : w).push({ line: at, message: `${s.type} comes after ${maxType}, but the pattern puts it before` });
      else { maxSeen = p; maxType = s.type; }
    }
    out.push(rule("BP4", NAME, "Sections follow the order pattern", f, { warnings: w }));
  }

  out.push(limitRules(bps, doc, spec));

  // BP6 Duplicates (visible sections count; without visibility, authored)
  {
    const types = (vis ? visible : authored.map((s) => ({ type: String(s.type), id: String(s.id) }))).map((s) => ({ type: s.type, id: s.id }));
    const count = new Map<string, number>();
    const f: Finding[] = [];
    for (const s of types) {
      const n = (count.get(s.type) ?? 0) + 1;
      count.set(s.type, n);
      const allow = bps.duplicateAllowance[s.type] ?? 1;
      if (n > allow) f.push({ line: lineOf(doc.raw, `"id": "${s.id}"`), message: `${s.type} appears ${n} times, the allowance is ${allow}` });
    }
    out.push(rule("BP6", NAME, "No section type repeated beyond its allowance", f));
  }

  out.push(ctaRules(bps, ctx, doc, spec));

  // BP9 Copy source
  const cs = ctx.copySource ?? null;
  out.push(!cs || !cs.ran ? skipped("BP9", NAME, "Page copy comes from the page JSON or the strings file, not a component", "no copy-source adapter result") : rule("BP9", NAME, "Page copy comes from the page JSON or the strings file, not a component", cs.ok ? [] : cs.lines.map((l) => ({ line: 1, message: l }))));

  // BP10 Gate
  if (!vis) out.push(skipped("BP10", NAME, "No section shows while its gate is closed", noVis));
  else out.push(rule("BP10", NAME, "No section shows while its gate is closed", visible.filter((s) => !s.gatesOk).map((s) => ({ line: lineOf(doc.raw, `"id": "${s.id}"`), message: `${s.type} "${s.id}" shows although ${gateText(s)}` }))));

  // BP11 Thin or long
  if (!vis) out.push(skipped("BP11", NAME, "Visible words inside the planning range", noVis));
  else {
    const total = visible.reduce((a, s) => a + s.words, 0);
    const [lo, hi] = bp.words;
    const w: Finding[] = total < lo ? [{ line: 1, message: `thin: ${total} visible words, the planning range is ${lo} to ${hi}` }] : total > hi ? [{ line: 1, message: `long: ${total} visible words, the planning range is ${lo} to ${hi}` }] : [];
    out.push(rule("BP11", NAME, "Visible words inside the planning range", [], { warnings: w, note: `${total} words` }));
  }
  return out;
}

/** Cross-page rule: no two pages share a hero variant and the same first four section types. */
export function signatureRules(docs: Doc[], bps: Blueprints | null): Map<string, RuleResult[]> {
  const out = new Map<string, RuleResult[]>();
  const keyOf = (spec: Json): string => {
    const [hero, ...rest] = sectionsOf(spec);
    if (!hero) return "";
    const h = typeof hero.variant === "string" ? `${hero.type}:${hero.variant}` : String(hero.type);
    return [h, ...rest.slice(0, 4).map((s) => String(s.type))].join(" > ");
  };
  const pages = docs.filter((d) => d.kind === "json").map((d) => ({ d, key: keyOf(specOf(d)) }));
  for (const p of pages) {
    const clash = pages.filter((o) => o !== p && o.key && o.key === p.key);
    const r = bps
      ? rule("BP8", NAME, "Layout signature is unique across pages", clash.map((o) => ({ line: 1, message: `same hero variant and first four section types as ${o.d.file} (${p.key})` })))
      : skipped("BP8", NAME, "Layout signature is unique across pages", "no blueprint data configured");
    out.set(p.d.file, [r]);
  }
  return out;
}
