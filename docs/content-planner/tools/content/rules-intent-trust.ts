/**
 * Intent rules (IN1 to IN4, rules/search-intent.md) and Trust rules (TR1 to TR5, rules/eeat-and-people-first.md). Pass or fail,
 * no score. The rules are reusable; what a page must show for each intent, which links build trust, and the authority wording
 * to watch all come from the project's profile data (paths.profiles). Without that data both groups are skipped with a note.
 * A rule whose severity is "warn" in the profile data shows its failures as warnings (warn first, then fail).
 */
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { type Detector, type Element, type IntentName, INTENTS, type Profiles } from "../../schemas/profiles";
import { briefFor, type Ctx, ledgerFor } from "./context";
import { copyStrings, type Doc, lineOf, wc } from "./parse";
import { type Finding, type Group, type RuleResult, rule, skipped } from "./types";

type Json = Record<string, unknown>;

/** What a page shows to a reader, gathered from the sections a reader can see (page specs) or from the text (articles). */
export type Scope = { types: Set<string>; fields: Set<string>; text: string[]; labels: string[]; hrefs: string[]; headings: string[]; table: boolean; answer: boolean };
const emptyScope = (): Scope => ({ types: new Set(), fields: new Set(), text: [], labels: [], hrefs: [], headings: [], table: false, answer: false });

const sectionsOf = (doc: Doc): Json[] => {
  const spec = JSON.parse(doc.raw.join("\n")) as Json;
  return Array.isArray(spec.sections) ? (spec.sections as Json[]) : [];
};

function collectKeys(v: unknown, fields: Set<string>, hrefs: string[]): void {
  if (Array.isArray(v)) { for (const x of v) collectKeys(x, fields, hrefs); return; }
  if (!v || typeof v !== "object") return;
  for (const [k, x] of Object.entries(v as Json)) {
    const filled = typeof x === "string" ? x.trim() !== "" : Array.isArray(x) ? x.length > 0 : x !== null && x !== undefined;
    if (filled) fields.add(k);
    if (k === "href" && typeof x === "string") hrefs.push(x);
    else if (k === "links" && Array.isArray(x)) { for (const l of x) if (typeof l === "string") hrefs.push(l); }
    else collectKeys(x, fields, hrefs);
  }
}

/** The scope of a set of page-spec sections. */
export function scopeOfSections(ctx: Ctx, sections: Json[]): Scope {
  const s = emptyScope();
  for (const sec of sections) {
    s.types.add(String(sec.type));
    const c = (sec.content ?? {}) as Json;
    for (const h of [c.h1, c.h2]) if (typeof h === "string") s.headings.push(h);
    if (typeof c.answer === "string" && c.answer.trim()) s.answer = true;
  }
  collectKeys(sections, s.fields, s.hrefs);
  for (const t of copyStrings(sections, ctx.copy)) (t.label ? s.labels : s.text).push(t.text);
  s.text.push(...s.labels);
  return s;
}

const TABLE_ROW = /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/;
/** The scope of an article: all of it, or only what comes in the first `firstWords` words after the H1. */
export function scopeOfArticle(doc: Doc, firstWords?: number): Scope {
  let cutoff = Infinity;
  if (firstWords) {
    let words = 0;
    const start = doc.h1[0]?.n ?? 0;
    for (const l of doc.lines) {
      if (l.n <= start) continue;
      words += wc(l.text);
      if (words >= firstWords) { cutoff = l.n; break; }
    }
  }
  const s = emptyScope();
  s.text = doc.lines.filter((l) => l.n <= cutoff).map((l) => l.text);
  s.hrefs = doc.links.filter((l) => l.n <= cutoff).map((l) => l.href);
  s.headings = doc.headings.filter((h) => h.n <= cutoff).map((h) => h.text);
  s.table = doc.lines.some((l) => l.n <= cutoff && TABLE_ROW.test(l.text));
  s.answer = Boolean(doc.answer && doc.answer.n <= cutoff);
  s.labels = doc.links.filter((l) => l.n <= cutoff).map((l) => l.text);
  return s;
}

/** Sections a reader sees: the host's visibility result when it has one for this page, otherwise every authored section. */
export function visibleSections(ctx: Ctx, doc: Doc): Json[] {
  const sections = sectionsOf(doc);
  const vis = ctx.visibility?.pages[doc.front.slug ?? ""]?.sections;
  if (!vis) return sections;
  const shown = new Set(vis.filter((s) => s.visible).map((s) => s.id));
  return sections.filter((s) => shown.has(String(s.id)));
}

const FIRST_SCREEN_SECTIONS = 2;
const FIRST_SCREEN_WORDS = 200;
export function pageScopes(ctx: Ctx, doc: Doc): { whole: Scope; first: Scope } {
  if (doc.kind === "json") {
    const shown = visibleSections(ctx, doc);
    return { whole: scopeOfSections(ctx, shown), first: scopeOfSections(ctx, shown.slice(0, FIRST_SCREEN_SECTIONS)) };
  }
  return { whole: scopeOfArticle(doc), first: scopeOfArticle(doc, FIRST_SCREEN_WORDS) };
}

const test = (pattern: string, value: string): boolean => new RegExp(pattern, "i").test(value);
const pathOnly = (href: string): string => href.split("#")[0] || "/";

/** Does the scope show what the detector looks for? */
export function detect(d: Detector, s: Scope): boolean {
  if ("sectionType" in d) return s.types.has(d.sectionType);
  if ("field" in d) return s.fields.has(d.field);
  if ("text" in d) return s.text.some((t) => test(d.text, t));
  if ("href" in d) return s.hrefs.some((h) => test(d.href, pathOnly(h)));
  if ("heading" in d) return s.headings.some((h) => test(d.heading, h));
  if ("table" in d) return s.table;
  return s.answer;
}
const shows = (e: Element, s: Scope): boolean => e.any.some((d) => detect(d, s));

/** A failure when the rule is set to warn first becomes a warning. */
function make(ctx: Ctx, id: string, group: Group, name: string, failures: Finding[], extra: Partial<RuleResult> = {}): RuleResult {
  const warnFirst = ctx.profiles?.severity[id] === "warn";
  if (warnFirst && failures.length) return rule(id, group, name, [], { ...extra, warnings: [...(extra.warnings ?? []), ...failures], note: extra.note ?? "warn first: set severity to fail in the profile data once pages are measured" });
  return rule(id, group, name, failures, extra);
}

const normIntent = (v: string | undefined): IntentName | null => {
  const t = (v ?? "").trim();
  const found = INTENTS.find((i) => i.toLowerCase() === t.toLowerCase());
  return found ?? null;
};

/** The search intent a page declares: its own front matter or page-spec field, otherwise the brief. */
export function intentOf(ctx: Ctx, doc: Doc): { primary: IntentName | null; secondary: IntentName | null; source: string } {
  const brief = briefFor(ctx, doc);
  const own = normIntent(doc.front.intent_primary);
  const primary = own ?? normIntent(brief?.front.intent_primary);
  const sec = normIntent(doc.front.intent_secondary) ?? normIntent(brief?.front.intent_secondary);
  return { primary, secondary: sec && sec !== primary ? sec : null, source: own ? "the page" : primary ? "the brief" : "none" };
}

const IN_IDS: [string, string][] = [
  ["IN1", "Search intent declared and confirmed against the live results"],
  ["IN2", "The page shows what its search intent needs"],
  ["IN3", "The first screen serves the intent"],
  ["IN4", "Calls to action fit the intent"],
];

const ctaLabels = (doc: Doc): { label: string; at: number }[] => {
  if (doc.kind !== "json") return [];
  const out: { label: string; at: number }[] = [];
  const walk = (v: unknown): void => {
    if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === "object") {
      for (const [k, x] of Object.entries(v as Json)) {
        const label = x && typeof x === "object" ? (x as Json).label : undefined;
        if (typeof label === "string" && /^(cta|primaryCta)/.test(k)) out.push({ label, at: lineOf(doc.raw, label) });
        else walk(x);
      }
    }
  };
  walk(sectionsOf(doc));
  const rulesCta = (JSON.parse(doc.raw.join("\n")) as Json).rules as Json | undefined;
  const primary = rulesCta?.primaryCta as Json | undefined;
  if (primary && typeof primary.label === "string") out.push({ label: primary.label, at: lineOf(doc.raw, primary.label) });
  return out;
};

export function intentRules(ctx: Ctx, doc: Doc): RuleResult[] {
  const p = ctx.profiles ?? null;
  if (!p) return IN_IDS.map(([id, name]) => skipped(id, "Intent", name, "no profile data configured (paths.profiles)"));
  const intent = intentOf(ctx, doc);
  const brief = briefFor(ctx, doc);

  // IN1
  const f1: Finding[] = [];
  if (!intent.primary) f1.push({ line: 1, message: doc.kind === "json" ? 'no search intent: add "searchIntent" (Learn, Solve, Compare, Buy, Find or Plan) to the page spec, or an intent_primary in its brief' : "no search intent: add intent_primary to the front matter or the brief" });
  if (brief && intent.primary) {
    const bi = normIntent(brief.front.intent_primary);
    if (bi && bi !== intent.primary) f1.push({ line: 1, message: `the page says ${intent.primary} but the brief says ${bi}. Settle which one the live results support` });
    const serp = brief.front.serp_checked_on;
    if (!serp) f1.push({ line: 1, message: "the brief has no serp_checked_on: the intent was never compared with the live results" });
    else if (serp === "unavailable" && !brief.front.intent_confirmed_by) f1.push({ line: 1, message: "the live results were unavailable and no owner confirmed the intent (intent_confirmed_by in the brief)" });
  }
  const out: RuleResult[] = [make(ctx, "IN1", "Intent", IN_IDS[0][1], f1, { note: intent.primary ? `${intent.primary}${intent.secondary ? ` (then ${intent.secondary})` : ""}, from ${intent.source}` : undefined })];
  if (!intent.primary) return [...out, ...IN_IDS.slice(1).map(([id, name]) => skipped(id, "Intent", name, "no intent declared"))];

  const prof = p.intents[intent.primary];
  const { whole, first } = pageScopes(ctx, doc);

  // IN2: the primary intent's needs are failures; the secondary intent's needs are warnings.
  const f2: Finding[] = prof.needs.filter((e) => !shows(e, whole)).map((e) => ({ line: 1, message: `${intent.primary} intent: the page does not show ${e.label}` }));
  const w2: Finding[] = intent.secondary ? p.intents[intent.secondary].needs.filter((e) => !shows(e, whole)).map((e) => ({ line: 1, message: `secondary ${intent.secondary} intent: the page does not show ${e.label}` })) : [];
  out.push(make(ctx, "IN2", "Intent", IN_IDS[1][1], f2, { warnings: w2 }));

  // IN3
  const f3: Finding[] = [];
  for (const id of prof.firstScreen) {
    const e = prof.needs.find((n) => n.id === id);
    if (e && !shows(e, first)) f3.push({ line: 1, message: `${intent.primary} intent: ${e.label} is not in the first screen` });
  }
  for (const a of prof.avoidFirstScreen) if (detect(a.detector, first)) f3.push({ line: 1, message: `${intent.primary} intent: the first screen has ${a.label}` });
  out.push(make(ctx, "IN3", "Intent", IN_IDS[2][1], f3));

  // IN4
  const labels = doc.kind === "json" ? ctaLabels(doc) : doc.links.filter((l) => first.hrefs.includes(l.href)).map((l) => ({ label: l.text, at: l.n }));
  const f4: Finding[] = [];
  for (const c of labels) for (const pat of prof.avoidLabels) if (test(pat, c.label)) f4.push({ line: c.at, message: `"${c.label}" does not fit a ${intent.primary} page (matches ${pat})` });
  out.push(make(ctx, "IN4", "Intent", IN_IDS[3][1], f4));
  return out;
}

const TR_IDS: [string, string][] = [
  ["TR1", "A reader can find out who is responsible"],
  ["TR2", "Pages that ask for money link the policies they rely on"],
  ["TR3", "Wording that claims authority has a source"],
  ["TR4", "The page states its honest limits"],
  ["TR5", "The page was reviewed recently"],
];

const archetypeOf = (doc: Doc): string => doc.archetype ?? (doc.kind === "md" ? "article" : "");
const today = (): Date => (process.env.CHECK_CONTENT_TODAY ? new Date(`${process.env.CHECK_CONTENT_TODAY}T00:00:00Z`) : new Date());

function siteWideLinks(ctx: Ctx, t: Profiles["trust"]): string {
  const rel = t.identity.siteWideFile;
  if (!rel) return "";
  const file = resolve(ctx.resolvePath("."), rel);
  return existsSync(file) ? readFileSync(file, "utf8") : "";
}

export function trustRules(ctx: Ctx, doc: Doc): RuleResult[] {
  const p = ctx.profiles ?? null;
  if (!p) return TR_IDS.map(([id, name]) => skipped(id, "Trust", name, "no profile data configured (paths.profiles)"));
  const arch = archetypeOf(doc);
  const t = p.trust;
  const applies = (list: string[] | undefined): boolean => !list || list.includes(arch);
  const skip = (i: number): RuleResult => skipped(TR_IDS[i][0], "Trust", TR_IDS[i][1], `not checked for "${arch || "this page"}"`);
  const { whole } = pageScopes(ctx, doc);
  const out: RuleResult[] = [];

  // TR1
  if (!applies(t.identity.appliesTo)) out.push(skip(0));
  else {
    const wide = siteWideLinks(ctx, t);
    const onPage = t.identity.hrefs.some((h) => whole.hrefs.some((x) => pathOnly(x) === h));
    const inSite = t.identity.hrefs.some((h) => wide.includes(`"${h}"`) || wide.includes(`'${h}'`));
    out.push(make(ctx, "TR1", "Trust", TR_IDS[0][1], onPage || inSite ? [] : [{ line: 1, message: `nothing links to ${t.identity.hrefs.join(" or ")}, on the page or in the site-wide navigation${t.identity.siteWideFile ? ` (${t.identity.siteWideFile})` : ""}` }]));
  }

  // TR2
  if (!applies(t.policies.appliesTo)) out.push(skip(1));
  else {
    const linked = t.policies.hrefs.filter((h) => whole.hrefs.some((x) => pathOnly(x) === h));
    const f: Finding[] = linked.length < t.policies.min ? [{ line: 1, message: `links ${linked.length} of the policies, needs ${t.policies.min}. Missing: ${t.policies.hrefs.filter((h) => !linked.includes(h)).join(", ")}` }] : [];
    out.push(make(ctx, "TR2", "Trust", TR_IDS[1][1], f));
  }

  // TR3: each hit needs a source in the same section (page specs) or paragraph (articles), or a fact in the ledger.
  if (!applies(t.authority.appliesTo)) out.push(skip(2));
  else {
    const ledger = ledgerFor(ctx, doc).text.toLowerCase();
    const f: Finding[] = [];
    const units: { text: string; sourced: boolean }[] = doc.kind === "json"
      ? visibleSections(ctx, doc).map((sec) => { const sc = scopeOfSections(ctx, [sec]); return { text: sc.text.join("\n"), sourced: sc.hrefs.length > 0 }; })
      : doc.lines.map((l) => ({ text: l.text, sourced: /\]\([^)]+\)/.test(l.text) }));
    for (const u of units) {
      for (const pat of t.authority.patterns) {
        for (const m of u.text.matchAll(new RegExp(pat, "gi"))) {
          if (!u.sourced && !ledger.includes(m[0].toLowerCase())) f.push({ line: lineOf(doc.raw, m[0]), message: `"${m[0]}" claims authority with no source in the same ${doc.kind === "json" ? "section" : "paragraph"} and no ledger fact. Link the source or remove the wording` });
        }
      }
    }
    out.push(make(ctx, "TR3", "Trust", TR_IDS[2][1], f));
  }

  // TR4
  if (!applies(t.honestLimits.appliesTo)) out.push(skip(3));
  else {
    const ok = t.honestLimits.any.some((d) => detect(d, whole));
    out.push(make(ctx, "TR4", "Trust", TR_IDS[3][1], ok ? [] : [{ line: 1, message: "the page never says who it is not for or what it does not cover. Add it from a real limit in the terms, or leave a [HUMAN REVIEW] flag" }]));
  }

  // TR5
  if (!applies(t.freshness.appliesTo)) out.push(skip(4));
  else {
    const when = doc.front.reviewed_on;
    if (!when || !/^\d{4}-\d{2}-\d{2}$/.test(when)) out.push(skipped("TR5", "Trust", TR_IDS[4][1], "no review date (P1 reports it)"));
    else {
      const age = Math.floor((today().getTime() - new Date(`${when}T00:00:00Z`).getTime()) / 86_400_000);
      out.push(make(ctx, "TR5", "Trust", TR_IDS[4][1], age > t.freshness.maxAgeDays ? [{ line: lineOf(doc.raw, when), message: `last reviewed ${age} days ago (${when}), the limit is ${t.freshness.maxAgeDays}` }] : [], { note: `${age} days since review` }));
    }
  }
  return out;
}
