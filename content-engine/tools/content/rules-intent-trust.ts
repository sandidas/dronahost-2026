/**
 * Intent rules (IN1 to IN5, rules/search-intent.md) and Trust rules (TR1 to TR8, rules/eeat-and-people-first.md). Pass or fail,
 * no score. The rules are reusable; what a page must show for each intent, which links build trust, and the authority wording
 * to watch all come from the project's profile data (paths.profiles). Without that data both groups are skipped with a note.
 * A rule whose severity is "warn" in the profile data shows its failures as warnings (warn first, then fail).
 */
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { type Detector, type Element, type IntentName, INTENTS, type Profiles } from "../../schemas/profiles";
import { isIsoDate } from "../dates";
import { briefFor, type Ctx, ledgerFor } from "./context";
import { copyStrings, type Doc, lineOf, wc } from "./parse";
import { type Finding, type Group, type RuleResult, rule, skipped } from "./types";

type Json = Record<string, unknown>;

/**
 * What a page shows to a reader, gathered from the sections a reader can see (page specs) or from the text (articles).
 * `anchors` are the short strings a reader scans: headings, FAQ questions and item titles. IN5 matches reader questions to them.
 */
export type Scope = { types: Set<string>; fields: Set<string>; text: string[]; labels: string[]; hrefs: string[]; headings: string[]; anchors: string[]; table: boolean; answer: boolean };
const emptyScope = (): Scope => ({ types: new Set(), fields: new Set(), text: [], labels: [], hrefs: [], headings: [], anchors: [], table: false, answer: false });
const ANCHOR_KEYS = new Set(["h1", "h2", "h3", "title", "q"]);

const sectionsOf = (doc: Doc): Json[] => {
  const spec = JSON.parse(doc.raw.join("\n")) as Json;
  return Array.isArray(spec.sections) ? (spec.sections as Json[]) : [];
};

function collectKeys(v: unknown, fields: Set<string>, hrefs: string[], anchors: string[]): void {
  if (Array.isArray(v)) { for (const x of v) collectKeys(x, fields, hrefs, anchors); return; }
  if (!v || typeof v !== "object") return;
  for (const [k, x] of Object.entries(v as Json)) {
    const filled = typeof x === "string" ? x.trim() !== "" : Array.isArray(x) ? x.length > 0 : x !== null && x !== undefined;
    if (filled) fields.add(k);
    if (k === "href" && typeof x === "string") hrefs.push(x);
    else if (k === "links" && Array.isArray(x)) { for (const l of x) if (typeof l === "string") hrefs.push(l); }
    else {
      if (ANCHOR_KEYS.has(k) && typeof x === "string" && x.trim()) anchors.push(x);
      collectKeys(x, fields, hrefs, anchors);
    }
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
  collectKeys(sections, s.fields, s.hrefs, s.anchors);
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
  // Headings, FAQ questions, and lines that are only a bold phrase (the way drafts write FAQ questions and item titles).
  const bold = doc.lines.filter((l) => l.n <= cutoff).map((l) => l.text.trim().match(/^\*\*([^*]+)\*\*:?\s*$/)?.[1]).filter((t): t is string => Boolean(t));
  s.anchors = [...s.headings, ...doc.faq.filter((f) => f.n <= cutoff).map((f) => f.q), ...bold];
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

/** The first screen: limits.firstScreen (default the first 2 visible sections of a page spec, the first 200 words of an article). */
export function pageScopes(ctx: Ctx, doc: Doc): { whole: Scope; first: Scope } {
  const fs = ctx.config.limits.firstScreen;
  if (doc.kind === "json") {
    const shown = visibleSections(ctx, doc);
    return { whole: scopeOfSections(ctx, shown), first: scopeOfSections(ctx, shown.slice(0, fs.sections)) };
  }
  return { whole: scopeOfArticle(doc), first: scopeOfArticle(doc, fs.words) };
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
  ["IN5", "The reader's follow-up questions from the brief are answered on the page"],
];

/** The "Reader questions" table in a brief: question, and the heading or FAQ question on the page that answers it. */
export type ReaderQuestion = { question: string; answeredBy: string; line: number };
const READER_HEADING = /^#{2,3}\s+(\d+[a-z]?\.\s+)?reader questions\b/i;
const ANSWERED_PREFIX = /^(faq|h[1-4]|heading|section|title|answer(ed)? by)\s*:\s*/i;
export function readerQuestions(brief: { text: string } | null): ReaderQuestion[] | null {
  if (!brief) return null;
  const lines = brief.text.split("\n");
  const start = lines.findIndex((l) => READER_HEADING.test(l.trim()));
  if (start < 0) return null;
  const out: ReaderQuestion[] = [];
  for (let i = start + 1; i < lines.length; i++) {
    const t = lines[i].trim();
    if (/^#{1,6}\s/.test(t)) break;
    if (!t.startsWith("|") || TABLE_ROW.test(t)) continue;
    const cells = t.split("|").slice(1, -1).map((c) => c.trim());
    if (cells.length < 2 || /^question$/i.test(cells[0])) continue;
    out.push({ question: cells[0], answeredBy: cells[1].replace(ANSWERED_PREFIX, "").replace(/^["“”']|["“”']$/g, "").trim(), line: i + 1 });
  }
  return out;
}
const norm = (t: string): string => t.toLowerCase().replace(/[*_`]/g, "").replace(/\s+/g, " ").replace(/[?.!:]+$/g, "").trim();

/** Words of a normalized anchor, for the overlap match in IN5. */
const tokens = (t: string): string[] => t.split(/[^a-z0-9]+/).filter((w) => w.length > 1);
/** IN5: an anchor answers a question when it contains the brief's wording, or shares 60% or more of its words. */
export function anchorMatches(anchor: string, want: string): boolean {
  if (!anchor || !want) return false;
  if (anchor.includes(want)) return true;
  const w = new Set(tokens(want));
  if (!w.size) return false;
  const a = new Set(tokens(anchor));
  return [...w].filter((x) => a.has(x)).length / w.size >= 0.6;
}

const ctaLabels = (ctx: Ctx, doc: Doc): { label: string; at: number }[] => {
  if (doc.kind !== "json") return [];
  const keys = new Set([...ctx.config.limits.ctaKeys, ...(ctx.blueprints?.ctaKeys.primary ?? []), ...(ctx.blueprints?.ctaKeys.secondary ?? [])]);
  const out: { label: string; at: number }[] = [];
  const walk = (v: unknown): void => {
    if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === "object") {
      for (const [k, x] of Object.entries(v as Json)) {
        const label = x && typeof x === "object" ? (x as Json).label : undefined;
        if (typeof label === "string" && keys.has(k)) out.push({ label, at: lineOf(doc.raw, label) });
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
  const labels = doc.kind === "json" ? ctaLabels(ctx, doc) : doc.links.filter((l) => first.hrefs.includes(l.href)).map((l) => ({ label: l.text, at: l.n }));
  const f4: Finding[] = [];
  for (const c of labels) for (const pat of prof.avoidLabels) if (test(pat, c.label)) f4.push({ line: c.at, message: `"${c.label}" does not fit a ${intent.primary} page (matches ${pat})` });
  out.push(make(ctx, "IN4", "Intent", IN_IDS[3][1], f4));

  // IN5: every reader question the brief lists is answered by a visible heading, FAQ question or item title (Needs Met).
  const questions = readerQuestions(brief);
  if (!brief) out.push(skipped("IN5", "Intent", IN_IDS[4][1], "no brief for this page"));
  else if (!questions) out.push(make(ctx, "IN5", "Intent", IN_IDS[4][1], [{ line: 1, message: `the brief ${brief.path} has no "Reader questions" table: list the questions the reader asks next and where the page answers each` }]));
  else {
    const anchors = whole.anchors.map(norm).filter(Boolean);
    const f5: Finding[] = [];
    for (const q of questions) {
      if (FLAG_RE.test(q.answeredBy) || !q.answeredBy) { f5.push({ line: 1, message: `"${q.question}" is not answered yet (brief line ${q.line})` }); continue; }
      const want = norm(q.answeredBy);
      if (!anchors.some((a) => anchorMatches(a, want))) f5.push({ line: 1, message: `"${q.question}": the brief says it is answered by "${q.answeredBy}", but no visible heading, FAQ question or title matches` });
    }
    out.push(make(ctx, "IN5", "Intent", IN_IDS[4][1], f5, { note: `${questions.length} reader question(s) in the brief` }));
  }
  return out;
}
const FLAG_RE = /\[HUMAN REVIEW/i;

const TR_IDS: [string, string][] = [
  ["TR1", "A reader can find out who is responsible"],
  ["TR2", "Pages that ask for money link the policies they rely on"],
  ["TR3", "Wording that claims authority has a source"],
  ["TR4", "The page states its honest limits"],
  ["TR5", "The page was reviewed recently"],
  ["TR6", "Who reviewed the page, when, and how to report an error is visible"],
  ["TR7", "First-hand experience is visible on the page"],
  ["TR8", "No wording that pressures or deceives the reader"],
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
    if (!isIsoDate(when)) out.push(skipped("TR5", "Trust", TR_IDS[4][1], "no real review date (P1 reports it)"));
    else {
      const age = Math.floor((today().getTime() - new Date(`${when}T00:00:00Z`).getTime()) / 86_400_000);
      const f: Finding[] = age < 0 ? [{ line: lineOf(doc.raw, when), message: `the review date ${when} is in the future. Use the date a person actually reviewed the page` }]
        : age > t.freshness.maxAgeDays ? [{ line: lineOf(doc.raw, when), message: `last reviewed ${age} days ago (${when}), the limit is ${t.freshness.maxAgeDays}` }] : [];
      out.push(make(ctx, "TR5", "Trust", TR_IDS[4][1], f, { note: `${age} days since review` }));
    }
  }

  // TR6: provenance the reader can see. A page spec's provenance section must carry the same date as the page's review date.
  if (!t.provenance) out.push(skipped("TR6", "Trust", TR_IDS[5][1], "no provenance profile (trust.provenance)"));
  else if (!applies(t.provenance.appliesTo)) out.push(skip(5));
  else {
    const f: Finding[] = [];
    if (!t.provenance.any.some((d) => detect(d, whole))) f.push({ line: 1, message: "nothing on the page says who reviewed it, when, or how to report an error. Add the provenance section (page spec) or the byline (article)" });
    if (doc.kind === "json") {
      const when = doc.front.reviewed_on ?? "";
      for (const sec of visibleSections(ctx, doc)) {
        const c = (sec.content ?? {}) as Json;
        if (typeof c.reviewedOn === "string" && when && c.reviewedOn !== when) f.push({ line: lineOf(doc.raw, c.reviewedOn), message: `the visible review date ${c.reviewedOn} differs from rules.reviewedOn (${when}). Only change the visible date when a person rechecks the whole page` });
      }
    }
    out.push(make(ctx, "TR6", "Trust", TR_IDS[5][1], f));
  }

  // TR7: first-hand experience a reader can see (a real result, review, measured number, screenshot, or a section marked firstHand).
  if (!t.experience) out.push(skipped("TR7", "Trust", TR_IDS[6][1], "no experience profile (trust.experience)"));
  else if (!applies(t.experience.appliesTo)) out.push(skip(6));
  else {
    const ok = t.experience.any.some((d) => detect(d, whole));
    out.push(make(ctx, "TR7", "Trust", TR_IDS[6][1], ok ? [] : [{ line: 1, message: "no first-hand element is visible: a real result, a real review, a measured number, a real screenshot, or a decision we made and why (marked firstHand). Supply one, or list it with npm run content:owed" }]));
  }

  // TR8: pressure and deception. Every hit fails; there is no source that excuses fake urgency.
  if (!t.pressure) out.push(skipped("TR8", "Trust", TR_IDS[7][1], "no pressure profile (trust.pressure)"));
  else if (!applies(t.pressure.appliesTo)) out.push(skip(7));
  else {
    const f: Finding[] = [];
    const seen = new Set<string>();
    for (const text of [...whole.text, ...whole.labels]) {
      for (const pat of t.pressure.patterns) {
        for (const m of text.matchAll(new RegExp(pat, "gi"))) {
          const key = `${m[0].toLowerCase()}@${text}`;
          if (seen.has(key)) continue;
          seen.add(key);
          f.push({ line: lineOf(doc.raw, text), message: `"${m[0]}" pressures or misleads the reader. Remove it: state the real deadline, limit or condition, or say nothing` });
        }
      }
    }
    out.push(make(ctx, "TR8", "Trust", TR_IDS[7][1], f));
  }
  return out;
}
