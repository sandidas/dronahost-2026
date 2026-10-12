import { slugify } from "@/lib/portal/slug";
import { blockText, docHeadings } from "./doc";
import type { BuilderDoc, PostKind } from "./model";
import { SEO_LIMITS } from "./seo";

/**
 * The SEO tab's Generate buttons. Every suggestion is built from the page's own words (title, headings, summary and
 * text), never invented, and follows the project's rules (content-engine/rules/content-writing-rules.md §7): the
 * keyword first in the title, no brand suffix (the metadata helper adds it), a description that does not repeat the
 * title, a short slug. Client-safe and instant; only the slug's uniqueness needs the database (lib/portal/posts.ts).
 */

export type SeoSource = { doc: BuilderDoc; kind: PostKind; title: string; excerpt: string; keyword: string };
type Input = SeoSource;

const STOP = new Set(
  "a an and are as at be but by can do does for from has have how i if in into is it its may more most no not of on or our so than that the their them then there these they this to up was we were what when where which who why will with you your yours about after all also any been before both each few here just only other over same some such too very via vs".split(" "),
);

const words = (s: string): string[] => s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9\s-]/g, " ").split(/[\s-]+/).filter(Boolean);
const meaningful = (s: string): string[] => words(s).filter((w) => w.length > 2 && !STOP.has(w) && !/^\d+$/.test(w));
const sentenceCase = (s: string) => (s ? s[0]!.toUpperCase() + s.slice(1) : s);

/** Cuts at a word boundary at or before `max` characters, without a trailing comma or dash. */
function cut(s: string, max: number): string {
  const t = s.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  const at = t.lastIndexOf(" ", max);
  return t.slice(0, at > max * 0.6 ? at : max).replace(/[\s,;:–—-]+$/, "");
}

/** The headline a visitor sees: the page's H1 (a post's title, a page's first hero), otherwise the title. */
function headline({ doc, kind, title }: Input): string {
  const h1 = docHeadings(doc, title, kind).find((h) => h.level === 1);
  return h1?.text.trim() || title.trim();
}

/** The page's words, headline and headings counted three times (they say what the page is about). */
function corpus(input: Input): { body: string; weighted: string } {
  const heads = docHeadings(input.doc, input.title, input.kind).map((h) => h.text).join(" ");
  const body = input.doc.blocks.map(blockText).join(" ");
  return { body, weighted: `${headline(input)} ${heads} `.repeat(3) + `${input.excerpt} ${body}` };
}

/** The most frequent meaningful words, best first. */
export function topWords(input: Input, limit = 8): string[] {
  const count = new Map<string, number>();
  for (const w of meaningful(corpus(input).weighted)) count.set(w, (count.get(w) ?? 0) + 1);
  return [...count.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, limit).map(([w]) => w);
}

/** A focus keyword: the two- or three-word phrase the page repeats most, or its most frequent word. */
export function suggestKeyword(input: Input): string {
  const count = new Map<string, number>();
  for (const chunk of corpus(input).weighted.toLowerCase().split(/[.,;:!?()\n"“”]+/)) {
    const w = words(chunk);
    for (let n = 2; n <= 3; n++) {
      for (let i = 0; i + n <= w.length; i++) {
        const phrase = w.slice(i, i + n);
        if (STOP.has(phrase[0]!) || STOP.has(phrase[n - 1]!) || phrase.some((x) => x.length < 2)) continue;
        const key = phrase.join(" ");
        count.set(key, (count.get(key) ?? 0) + (n === 3 ? 1.2 : 1));
      }
    }
  }
  const best = [...count.entries()].filter(([, n]) => n >= 2).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0];
  return best?.[0] ?? topWords(input, 1)[0] ?? "";
}

/** A search title: keyword first, at most 60 characters, from the page's own headline. */
export function suggestTitle(input: Input): string {
  const base = headline(input);
  const kw = input.keyword.trim();
  const max = SEO_LIMITS.title.max;
  if (!kw || base.toLowerCase().startsWith(kw.toLowerCase())) return cut(base, max);
  if (base.toLowerCase().includes(kw.toLowerCase())) return cut(base, max);
  const joined = `${sentenceCase(kw)}: ${base}`;
  return joined.length <= max ? joined : cut(sentenceCase(kw), max);
}

/** A meta description: whole sentences from the summary or the opening text, 70 to 160 characters where the page allows. */
export function suggestDescription(input: Input): string {
  const title = headline(input).toLowerCase();
  // One line per paragraph or heading; headings and labels have no closing full stop, so they are not sentences.
  const lines = [input.excerpt, ...input.doc.blocks.map(blockText)].flatMap((s) => s.split(/\n+/)).map((s) => s.replace(/\s+/g, " ").trim());
  const sentences = lines
    .flatMap((s) => s.match(/[^.!?]+[.!?]+(?=\s|$)/g) ?? [])
    .map((s) => s.trim())
    // Never the title again, and only real sentences.
    .filter((s) => s.split(" ").length >= 4 && s.toLowerCase().replace(/[.!?]+$/, "") !== title);
  const max = SEO_LIMITS.description.max - 5;
  let out = "";
  for (const s of [...new Set(sentences)]) {
    const next = out ? `${out} ${s}` : s;
    if (next.length > max) break;
    out = next;
    if (out.length >= SEO_LIMITS.description.min + 40) break;
  }
  if (!out && sentences[0]) out = `${cut(sentences[0], max - 1)}…`;
  return out;
}

/** A short address: the focus keyword when there is one, otherwise the headline without filler words. */
export function suggestSlug(input: Input): string {
  const kw = slugify(input.keyword);
  if (kw) return kw;
  const all = words(headline(input));
  const kept = all.filter((w) => !STOP.has(w));
  return slugify((kept.length >= 2 ? kept : all).slice(0, 6).join(" ")).slice(0, 60).replace(/-+$/, "");
}

/** Words that can go in front of a taken slug to make it unique: the page's own most frequent words not in it yet. */
export function slugPrefixWords(input: Input, slug: string): string[] {
  const used = new Set(slug.split("-"));
  return topWords(input, 12).filter((w) => !used.has(w) && /^[a-z0-9]+$/.test(w)).slice(0, 6);
}
