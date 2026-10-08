/** Rules on the shape and the words of a page: Structure, Keyword, Voice, Metadata, Schema. */
import type { Ctx } from "./context";
import { rowByKeyword, rowBySlug } from "./context";
import { type Doc, type Line, FLAG, sentencesOf, strip, wc, lineOf } from "./parse";
import { type Finding, type RuleResult, phraseRe, rule, skipped } from "./types";

const GENERIC_ANCHOR = /^(click here|here|read more|learn more|this page|link|more)$/i;
const HTML = /&[a-z]+;|<[a-z/][^>]*>/i;

/** Body lines without front matter, code fences and table separator lines. */
export function proseLines(doc: Doc): Line[] {
  if (doc.kind === "json") return doc.lines.filter((l) => l.text.trim() !== "");
  const out: Line[] = [];
  let fence = false;
  for (const l of doc.lines) {
    if (l.text.trim().startsWith("```")) { fence = !fence; continue; }
    if (fence || l.text.trim() === "" || /^\|?\s*:?-{2,}/.test(l.text.trim())) continue;
    out.push(l);
  }
  return out;
}

const syllables = (word: string): number => {
  const w = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!w) return 0;
  const groups = w.replace(/e$/, "").match(/[aeiouy]+/g);
  return Math.max(1, groups ? groups.length : 1);
};
const words = (t: string): string[] => t.split(/\s+/).filter((w) => /[A-Za-z]/.test(w));

/** Flesch-Kincaid grade of a block of prose. */
export function gradeLevel(text: string): number {
  const ss = text.split(/(?<=[.?!])\s+/).map((s) => s.trim()).filter(Boolean);
  const ws = words(text);
  if (!ss.length || !ws.length) return 0;
  return 0.39 * (ws.length / ss.length) + 11.8 * (ws.reduce((n, w) => n + syllables(w), 0) / ws.length) - 15.59;
}

/** Prose for the grade: multi-sentence paragraphs of 25 or more words (page JSON) or all body paragraphs and FAQ answers (Markdown). */
function gradeProse(doc: Doc): string {
  if (doc.kind === "md") return [...doc.paragraphs.map((p) => p.text), ...doc.faq.map((q) => q.a)].map(strip).join(" ");
  return doc.lines.filter((l) => sentencesOf(l.text).length >= 2 && wc(l.text) >= 25).map((l) => l.text).join(" ");
}

export function structureRules(ctx: Ctx, doc: Doc): RuleResult[] {
  const L = ctx.config.limits;
  const out: RuleResult[] = [];
  out.push(rule("S1", "Structure", "Exactly one H1", doc.h1.length === 1 ? [] : [{ line: doc.h1[1]?.n ?? 1, message: doc.h1.length === 0 ? "no H1" : `${doc.h1.length} H1 headings` }]));
  const skips: Finding[] = [];
  let prev = 0;
  for (const h of doc.headings) {
    if (prev && h.level > prev + 1) skips.push({ line: h.n, message: `heading level jumps from h${prev} to h${h.level}: "${h.text.slice(0, 50)}"` });
    prev = h.level;
  }
  out.push(rule("S2", "Structure", "No skipped heading levels", skips));
  const [aMin, aMax] = L.answerBlockWords;
  if (doc.answer) {
    const n = wc(strip(doc.answer.text));
    out.push(rule("S3", "Structure", `Answer block of ${aMin} to ${aMax} words under the H1`, n >= aMin && n <= aMax ? [] : [{ line: doc.answer.n, message: `answer block has ${n} words` }]));
  } else out.push(rule("S3", "Structure", `Answer block of ${aMin} to ${aMax} words under the H1`, [{ line: doc.h1[0]?.n ?? 1, message: "no answer block found under the H1" }]));

  const plan = (rowBySlug(ctx, doc.front.slug ?? "") ?? rowByKeyword(ctx, doc.front.primary_keyword ?? ""))?.planNumber ?? "";
  const own = doc.archetype ? (L.archetypeAliases[doc.archetype] ?? doc.archetype) : "";
  const archetype = L.faqItemsByArchetype[own] ? own : L.archetypeByPlan[plan] ?? "";
  const [fMin, fMax] = L.faqItemsByArchetype[archetype] ?? L.faqItems;
  if (doc.faq.length === 0) out.push(skipped("S4", "Structure", "FAQ item count, answer length and links", "no FAQ on this page"));
  else {
    const f: Finding[] = [];
    const w: Finding[] = [];
    if (doc.faq.length < fMin || doc.faq.length > fMax) f.push({ line: doc.faq[0].n, message: `FAQ has ${doc.faq.length} items, needs ${fMin} to ${fMax}${archetype ? ` (${archetype} pages)` : ""}` });
    for (const q of doc.faq) {
      if (/^\{\{[^}]*\}\}$/.test(q.a.trim())) continue; // a filled-in token such as {{pricing.summary}}
      const n = wc(strip(q.a));
      if (n > L.faqAnswerFailAbove) f.push({ line: q.n, message: `FAQ answer "${q.q.slice(0, 40)}" has ${n} words, the limit is ${L.faqAnswerFailAbove}` });
      else if (n < L.faqAnswerWarnBelow) w.push({ line: q.n, message: `FAQ answer "${q.q.slice(0, 40)}" has ${n} words (guideline ${L.faqAnswerWarnBelow} to ${L.faqAnswerFailAbove})` });
      if ((q.a.match(/\[[^\]]+\]\([^)]+\)/g) ?? []).length > 1) f.push({ line: q.n, message: `FAQ answer "${q.q.slice(0, 40)}" has more than one link` });
    }
    out.push(rule("S4", "Structure", "FAQ item count, answer length and links", f, { warnings: w }));
  }
  const internal = [...new Map(doc.links.filter((l) => l.href.startsWith("/")).map((l) => [l.href, l])).values()];
  const linkFails: Finding[] = [];
  if (internal.length < L.internalLinksMin) linkFails.push({ line: internal[0]?.n ?? 1, message: `${internal.length} internal links, needs ${L.internalLinksMin} or more` });
  for (const g of doc.links.filter((l) => GENERIC_ANCHOR.test(l.text.trim()))) linkFails.push({ line: g.n, message: `anchor text "${g.text}" is not descriptive` });
  out.push(rule("S5", "Structure", `${L.internalLinksMin} or more internal links with descriptive anchors`, linkFails));
  return out;
}

export function keywordRules(ctx: Ctx, doc: Doc): RuleResult[] {
  const kw = (doc.front.primary_keyword ?? "").toLowerCase();
  const slug = doc.front.slug ?? "";
  const out: RuleResult[] = [];
  const k1: Finding[] = [];
  const reg = slug ? rowBySlug(ctx, slug) : undefined;
  if (!ctx.register) k1.push({ line: 1, message: "no register file found" });
  else if (!slug) k1.push({ line: 1, message: "no slug in front matter" });
  else if (!reg) k1.push({ line: lineOf(doc.raw, "slug"), message: `slug ${slug} is not the target URL of any register row` });
  else if (kw && reg.keyword.toLowerCase() !== kw) k1.push({ line: lineOf(doc.raw, "primary_keyword"), message: `register keyword for ${slug} is "${reg.keyword}"` });
  out.push(rule("K1", "Keyword", "Primary keyword is in the register for this URL", k1));

  if (doc.kind === "md" && kw) {
    const body = doc.lines.map((l) => l.text).join("\n");
    const first100 = body.split(/\s+/).slice(0, 100).join(" ").toLowerCase();
    const bits = kw.replace(/^how to /, "").split(/\s+/);
    const near = (t: string) => t.toLowerCase().includes(kw) || bits.every((b) => t.toLowerCase().includes(b));
    const kf: Finding[] = [];
    if (!near(doc.title ?? "")) kf.push({ line: lineOf(doc.raw, "seo_title"), message: "primary keyword not in the title" });
    if (!doc.h1[0] || !near(doc.h1[0].text)) kf.push({ line: doc.h1[0]?.n ?? 1, message: "primary keyword not in the H1" });
    if (!near(first100)) kf.push({ line: doc.h1[0]?.n ?? 1, message: "primary keyword not in the first 100 words" });
    out.push(rule("K2", "Keyword", "Primary keyword in title, H1 and first 100 words", kf));
    const total = wc(body);
    const hits = (body.toLowerCase().match(new RegExp(kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) ?? []).length;
    const density = total ? (hits / total) * 100 : 0;
    out.push(total >= 100 ? rule("K3", "Keyword", "No keyword density spike", density > 3 ? [{ line: 1, message: `the exact keyword appears ${hits} times in ${total} words (${density.toFixed(1)} per 100)` }] : []) : skipped("K3", "Keyword", "No keyword density spike", "page under 100 words"));
  }
  if (ctx.register && slug) {
    const owners = ctx.register.rows.filter((r) => r.status !== "dropped" && r.url !== slug && (r.keyword.toLowerCase() === kw || r.secondary.some((s) => s.toLowerCase() === kw)));
    out.push(rule("K4", "Keyword", "Keyword is not owned by another URL", owners.map((o) => ({ line: o.line, message: `register line ${o.line} gives "${kw}" to ${o.url}` }))));
  }
  return out;
}

export function voiceRules(ctx: Ctx, doc: Doc): RuleResult[] {
  const L = ctx.config.limits;
  const md = doc.kind === "md";
  const prose = proseLines(doc);
  const labelLines = doc.labels;
  const out: RuleResult[] = [];
  const banned: Finding[] = [];
  for (const l of [...prose, ...labelLines]) {
    const low = strip(l.text).toLowerCase();
    for (const p of ctx.rules.bannedPhrases) if (phraseRe(p).test(low)) banned.push({ line: l.n, message: `banned phrase "${p}"` });
  }
  out.push(rule("V1", "Voice", "No banned phrases", banned));
  out.push(rule("V2", "Voice", "No exclamation marks", [...prose, ...labelLines].filter((l) => /!/.test(strip(l.text)) && !/https?:/.test(l.text)).map((l) => ({ line: l.n, message: "exclamation mark" }))));
  const long: Finding[] = [];
  let totalWords = 0;
  let totalSentences = 0;
  for (const p of md ? doc.paragraphs.concat(doc.faq.map((q) => ({ n: q.n, text: q.a }))) : [...prose, ...labelLines]) {
    for (const s of sentencesOf(p.text)) {
      const n = wc(s);
      totalWords += n;
      totalSentences++;
      if (n > L.sentenceMax) long.push({ line: p.n, message: `sentence of ${n} words (maximum ${L.sentenceMax}): "${s.slice(0, 60)}..."` });
    }
  }
  out.push(rule("V3", "Voice", `No sentence over ${L.sentenceMax} words`, long));
  const avg = totalSentences ? totalWords / totalSentences : 0;
  out.push(rule("V4", "Voice", `Average sentence ${L.averageSentenceMax} words or fewer`, avg > L.averageSentenceMax ? [{ line: 1, message: `average sentence is ${avg.toFixed(1)} words` }] : [], { note: `average ${avg.toFixed(1)} words` }));
  const banLabels = new Set([...ctx.rules.bannedCtaLabels, ...ctx.config.cta.bannedLabels].map((x) => x.toLowerCase()));
  const labelTexts = md ? doc.links.map((l) => ({ n: l.n, text: l.text })) : labelLines;
  out.push(rule("V5", "Voice", "No banned CTA label", labelTexts.filter((l) => banLabels.has(l.text.trim().toLowerCase())).map((l) => ({ line: l.n, message: `banned CTA label "${l.text}"` }))));
  out.push(rule("V6", "Voice", "No raw HTML or entity in copy", prose.filter((l) => HTML.test(strip(l.text))).map((l) => ({ line: l.n, message: "raw HTML or entity in copy" }))));
  const grade = gradeProse(doc);
  const override = md ? (doc.front.grade_override_reason && doc.front.grade_override_approved_by ? doc.front.grade_override_reason : "") : (() => {
    const o = (doc.rulesBlock.gradeOverride ?? {}) as { reason?: string; approvedBy?: string };
    return o.reason && o.approvedBy ? o.reason : "";
  })();
  if (!grade) out.push(skipped("V7", "Voice", "Reading grade inside the target", "not enough prose"));
  else {
    const g = gradeLevel(grade);
    const f: Finding[] = [];
    const w: Finding[] = [];
    if (g > L.gradeFailAbove) (override ? w : f).push({ line: 1, message: `reading grade ${g.toFixed(1)} is above ${L.gradeFailAbove}${override ? ` (owner-approved override: ${override})` : ""}` });
    else if (g > L.gradeWarnAbove) w.push({ line: 1, message: `reading grade ${g.toFixed(1)} is above ${L.gradeWarnAbove}` });
    out.push(rule("V7", "Voice", "Reading grade inside the target", f, { warnings: w, note: `grade ${g.toFixed(1)}` }));
  }
  const idioms: Finding[] = [];
  for (const l of prose) for (const i of ctx.rules.idioms) if (phraseRe(i).test(strip(l.text).toLowerCase())) idioms.push({ line: l.n, message: `idiom "${i}" does not translate` });
  out.push(rule("V8", "Voice", "No idioms", idioms));
  const vague: Finding[] = [];
  for (const a of [doc.answer, ...doc.faq.map((q) => ({ n: q.n, text: q.a }))]) if (a && /^(it|this|that|they|these|those)\b/i.test(strip(a.text).trim())) vague.push({ line: a.n, message: "an answer opens with a vague pronoun; name the subject" });
  out.push(rule("V9", "Voice", "Answers name their subject", [], { warnings: vague }));
  return out;
}

export function metadataRules(ctx: Ctx, doc: Doc): RuleResult[] {
  const L = ctx.config.limits;
  const out: RuleResult[] = [];
  const title = doc.title ?? "";
  const desc = doc.description ?? "";
  const tf: Finding[] = [];
  const tw: Finding[] = [];
  if (!title) tf.push({ line: 1, message: "no title" });
  else {
    const total = title.length + L.titleSuffix.length;
    if (total > L.titleFailAbove) tf.push({ line: lineOf(doc.raw, title), message: `title is ${total} characters with the suffix (limit ${L.titleFailAbove})` });
    else if (total > L.titleWarnAbove) tw.push({ line: lineOf(doc.raw, title), message: `title is ${total} characters with the suffix (aim for ${L.titleWarnAbove} or fewer)` });
    if (new RegExp(ctx.rules.brandSuffixPattern, "i").test(title)) tf.push({ line: lineOf(doc.raw, title), message: "title carries a brand suffix; the helper adds it" });
  }
  out.push(rule("M1", "Metadata", "Title present, inside the length limits with the suffix, no typed brand suffix", tf, { warnings: tw }));
  const df: Finding[] = [];
  const dw: Finding[] = [];
  if (!desc) df.push({ line: 1, message: "no description" });
  else {
    if (desc.length > L.descriptionWarnAbove) dw.push({ line: lineOf(doc.raw, desc), message: `description is ${desc.length} characters (aim for ${L.descriptionWarnAbove} or fewer)` });
    if (desc.trim().toLowerCase() === title.trim().toLowerCase()) df.push({ line: lineOf(doc.raw, desc), message: "description repeats the title" });
  }
  out.push(rule("M2", "Metadata", "Description present and not a copy of the title", df, { warnings: dw }));
  const kw = (doc.front.primary_keyword ?? "").toLowerCase();
  const slug = doc.front.slug ?? "";
  const row = kw ? rowByKeyword(ctx, kw) : undefined;
  const m3: Finding[] = [];
  const m3w: Finding[] = [];
  if (row && row.url !== slug) (row.url === "planned" ? m3w : m3).push({ line: lineOf(doc.raw, "slug"), message: row.url === "planned" ? `register URL for "${kw}" is still "planned"` : `slug ${slug || "(none)"} is not the register URL ${row.url}` });
  out.push(rule("M3", "Metadata", "Slug equals the register URL", m3, { warnings: m3w }));
  return out;
}

export function schemaRules(ctx: Ctx, doc: Doc): RuleResult[] {
  if (!doc.schemaTypes.length) return [skipped("SC1", "Schema", "Declared schema is supported by visible content", "no schema declared")];
  const f: Finding[] = [];
  for (const t of doc.schemaTypes) {
    if (t === "FAQPage" && doc.faq.length === 0) f.push({ line: lineOf(doc.raw, "FAQPage"), message: "FAQPage declared but the page has no visible FAQ" });
    if ((t === "Review" || t === "AggregateRating") && !/^https:\/\//.test(doc.front.reviews_source ?? "")) f.push({ line: lineOf(doc.raw, t), message: `${t} declared without real, linked reviews (reviews_source)` });
    if (t === "HowTo" && !doc.lines.some((l) => /^\s*\d+\.\s/.test(l.text)) && doc.kind === "md") f.push({ line: lineOf(doc.raw, "HowTo"), message: "HowTo declared but the page has no numbered steps" });
  }
  return [rule("SC1", "Schema", "Declared schema is supported by visible content", f)];
}
export { FLAG };
void skipped;
