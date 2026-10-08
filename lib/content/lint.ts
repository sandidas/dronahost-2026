import { CLAIMS } from "@/content/claims";
import { collectHrefs } from "./schemas/page";
import type { PageSpecData } from "./schemas/page";

export type LintIssue = { level: "error" | "warn"; where: string; message: string };

/** Phrases the content rules ban ("Phrases to avoid" and the CTA rules). Matched whole-word, case-insensitive. */
export const BANNED_PHRASES = [
  "don't fret", "do the needful", "revert back", "prepone", "best of luck", "kindly", "world-class", "blazing fast", "cutting-edge",
  "state-of-the-art", "next-generation", "revolutionary", "game-changing", "one-to-one support", "supercharge", "unlock the power",
  "take your business to the next level", "all-in-one", "seamless", "robust platform", "scalable infrastructure", "empower your team",
  "lorem ipsum",
];

/** Generic CTA labels the rules ban. */
export const BANNED_CTAS = ["click here", "learn more", "read more", "get started", "submit", "sign up", "buy now", "try it", "order now"];

/** Object keys whose strings are structure, not copy. */
const NON_COPY_KEYS = new Set([
  "id", "type", "variant", "icon", "href", "source", "show", "highlight", "claims", "tiles", "channels", "links", "requires",
  "requiresClaim", "hoursFrom", "onlyPublished", "hideIfEmpty", "showRenewalPrice",
]);
/** Keys that hold a button or link label. */
const LABEL_KEYS = new Set(["label", "cta"]);

/** Copy strings with a name for where they came from. `claim:` and `feature:` refs and `{{tokens}}` are not copy. */
export function copyStrings(value: unknown, path = ""): { where: string; text: string; label: boolean }[] {
  if (typeof value === "string") {
    return /^(claim|feature):/.test(value) ? [] : [{ where: path, text: value.replace(/\{\{[^}]*\}\}/g, ""), label: false }];
  }
  if (Array.isArray(value)) return value.flatMap((v, i) => copyStrings(v, `${path}[${i}]`));
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([k, v]) => {
      if (NON_COPY_KEYS.has(k)) return [];
      const parts = copyStrings(v, path ? `${path}.${k}` : k);
      return LABEL_KEYS.has(k) ? parts.map((p) => ({ ...p, label: true })) : parts;
    });
  }
  return [];
}

const sentences = (text: string): string[] => text.split(/(?<=[.?!])\s+/).map((s) => s.trim()).filter(Boolean);
const words = (text: string): string[] => text.split(/\s+/).filter((w) => /[A-Za-z]/.test(w));

function syllables(word: string): number {
  const w = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!w) return 0;
  const groups = w.replace(/e$/, "").match(/[aeiouy]+/g);
  return Math.max(1, groups ? groups.length : 1);
}

/** Flesch-Kincaid grade level of a block of prose. */
export function gradeLevel(text: string): number {
  const ss = sentences(text);
  const ws = words(text);
  if (ss.length === 0 || ws.length === 0) return 0;
  const syl = ws.reduce((n, w) => n + syllables(w), 0);
  return 0.39 * (ws.length / ss.length) + 11.8 * (syl / ws.length) - 15.59;
}

/** Digits with a unit, a currency amount, or "24/7": a number that must come from claims.ts or pricing.json, not from copy. */
const UNCLAIMED_NUMBER = /(\d[\d.,]*\s?(%|ms|gb|tb|mb|minutes?|mins?|hours?|days?|weeks?|months?|years?|x\b|\/month|\/year))|([$£€]\s?\d)|\b24\/7\b|\b\d{2,}\+?\s+(sites|customers|clients|countries)\b/i;

const MAX_GRADE = 11;
const MAX_SENTENCE_WORDS = 28;
const MIN_INTERNAL_LINKS = 3;

/** Lint one validated page. Errors fail CI; warnings are guidance. */
export function lintPage(spec: PageSpecData): LintIssue[] {
  const issues: LintIssue[] = [];
  const copy = copyStrings(spec.sections);
  const claimIds = new Set(CLAIMS.map((c) => c.id));

  for (const { where, text, label } of copy) {
    const lower = text.toLowerCase();
    for (const phrase of BANNED_PHRASES) {
      if (new RegExp(`(^|[^a-z])${phrase.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}([^a-z]|$)`).test(lower)) issues.push({ level: "error", where, message: `banned phrase "${phrase}"` });
    }
    if (text.includes("!")) issues.push({ level: "error", where, message: "exclamation mark in marketing copy" });
    // Support is ticket and email only (owner decision 22). Never mention any other channel.
    if (/whats\s?app/i.test(text)) issues.push({ level: "error", where, message: "mentions WhatsApp, which is not offered (support is ticket and email only)" });
    if (/live[\s-]?chat/i.test(text)) issues.push({ level: "error", where, message: "mentions live chat, which is not offered (support is ticket and email only)" });
    if (/\b(phone support|phone number|phone line|call us|call our)\b/i.test(text)) issues.push({ level: "error", where, message: "mentions phone support, which is not offered (support is ticket and email only)" });
    if (/&[a-z]+;|<[a-z/][^>]*>/i.test(text)) issues.push({ level: "error", where, message: "raw HTML or entity in copy" });
    if (UNCLAIMED_NUMBER.test(text)) issues.push({ level: "error", where, message: `a number in copy must come from claims.ts or pricing.json: "${text.slice(0, 60)}"` });
    if (label && BANNED_CTAS.includes(lower.trim())) issues.push({ level: "error", where, message: `banned CTA label "${text}"` });
    for (const s of sentences(text)) {
      const n = words(s).length;
      if (n > MAX_SENTENCE_WORDS) issues.push({ level: "error", where, message: `sentence of ${n} words (maximum ${MAX_SENTENCE_WORDS})` });
    }
  }

  const prose = copy.filter((c) => !c.label && sentences(c.text).length >= 2 && words(c.text).length >= 25).map((c) => c.text).join(" ");
  if (prose) {
    const grade = gradeLevel(prose);
    if (grade > MAX_GRADE) issues.push({ level: "error", where: "(page)", message: `reading grade ${grade.toFixed(1)} is above ${MAX_GRADE}` });
    else if (grade > MAX_GRADE - 1) issues.push({ level: "warn", where: "(page)", message: `reading grade ${grade.toFixed(1)} is close to the limit of ${MAX_GRADE}` });
  }

  const internal = [...collectHrefs(spec.sections)].filter((h) => h.startsWith("/"));
  if (internal.length < MIN_INTERNAL_LINKS) issues.push({ level: "error", where: "(page)", message: `${internal.length} distinct internal links (minimum ${MIN_INTERNAL_LINKS})` });

  const refs = JSON.stringify(spec.sections).match(/claim:[a-z0-9-]+/g) ?? [];
  for (const ref of new Set(refs)) {
    if (!claimIds.has(ref.slice("claim:".length))) issues.push({ level: "error", where: "(page)", message: `${ref} is not in claims.ts` });
  }

  for (const s of spec.sections) {
    if (s.type !== "FAQSection") continue;
    s.content.items.forEach((item, i) => {
      const n = words(item.a.replace(/\{\{[^}]*\}\}/g, "")).length;
      if (n > 0 && n < 40) issues.push({ level: "warn", where: `${s.id}.items[${i}].a`, message: `FAQ answer has ${n} words (guideline 40 to 80)` });
    });
  }
  return issues;
}

/** Claims a page references and whether each renders today. For the report; hidden claims are expected, not errors. */
export function claimUsage(spec: PageSpecData): { id: string; renders: boolean; status: string }[] {
  const refs = new Set((JSON.stringify(spec.sections).match(/claim:[a-z0-9-]+/g) ?? []).map((r) => r.slice("claim:".length)));
  return [...refs].map((id) => {
    const claim = CLAIMS.find((c) => c.id === id);
    return { id, renders: Boolean(claim?.verified), status: claim?.status ?? "missing" };
  });
}
