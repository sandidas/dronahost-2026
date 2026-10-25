/** Reads a Markdown draft (front matter + body) or a page spec JSON into one Doc shape that the rules check. */
import { lf } from "../eol";
import { readFileSync } from "node:fs";
import { extname } from "node:path";
import { parseFrontMatter } from "../front-matter";

export type Line = { n: number; text: string };
export type Doc = {
  file: string;
  kind: "md" | "json";
  front: Record<string, string>;
  lines: Line[]; // body lines (md) or copy lines (json), label strings excluded
  labels: Line[]; // button and link labels (json only)
  raw: string[];
  h1: { n: number; text: string }[];
  headings: { n: number; level: number; text: string }[];
  paragraphs: { n: number; text: string }[];
  /** Internal links. `body` is true for a link in running copy, false for a button, CTA or report link. */
  links: { n: number; text: string; href: string; body?: boolean }[];
  /** Links to another site (http or https, any host not in contentPages.ownHosts is decided by the rules). */
  external: { n: number; text: string; href: string }[];
  /** Images with their alt text. Page specs: any object with a string `alt`. Markdown: `![alt](src)`. */
  images: { n: number; alt: string }[];
  /** Videos. Page specs: any object with a `youtubeId` or `videoUrl`. Markdown: a video link, `<video>` or `<iframe>`. */
  videos: { n: number; src: string }[];
  /** The page spec's blueprint id (or front matter `blueprint`), if it names one. */
  blueprint?: string;
  faq: { n: number; q: string; a: string }[];
  answer?: { n: number; text: string };
  title?: string;
  description?: string;
  state: string;
  schemaTypes: string[];
  rulesBlock: Record<string, unknown>;
  /** The page's own archetype (front matter `archetype` or the page spec's `archetype`), if it names one. */
  archetype?: string;
};
export type CopyOptions = { nonCopyKeys: string[]; labelKeys: string[] };

export const FLAG = /\[HUMAN REVIEW[^\]]*\]/g;
export const wc = (t: string): number => t.split(/\s+/).filter((w) => /[A-Za-z0-9]/.test(w)).length;
/** A Markdown link `[text](href "title")`, not an image. Shared by every parser so they agree on what a link is. */
export const LINK_RE = /(?<!!)\[([^\]]+)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
export const IMAGE_RE = /!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
/** A URL that plays a video: YouTube, Vimeo, Wistia, Loom or a video file. */
export const VIDEO_URL = /(youtube\.com\/(watch|embed)|youtube-nocookie\.com\/embed|youtu\.be\/|vimeo\.com\/|wistia\.(com|net)\/|loom\.com\/share|\.(mp4|webm)(\?|$))/i;
/** Images go first (their alt text stays), so `![alt](x.png)` never leaves a stray "!". */
export const strip = (t: string): string => t.replace(/`[^`]*`/g, "").replace(/\[HUMAN REVIEW[^\]]*\]/g, "").replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/[*_>#]/g, "");

/** Abbreviations that never end a sentence, that end one only before a capital, and "No." before a number. */
const ABBR_ALWAYS = /(?:^|[\s(])(?:e\.g|i\.e|vs|approx|cf|mr|mrs|ms|dr)\.$/i;
const ABBR_SOFT = /(?:^|[\s(])(?:etc|inc|ltd|co|u\.s|u\.k)\.$/i;
const ABBR_NUMBER = /(?:^|[\s(])no\.$/i;
/** Splits prose into sentences at . ? ! followed by space, except after the abbreviations above. */
export function splitSentences(t: string): string[] {
  const parts = t.split(/(?<=[.?!])\s+/);
  const out: string[] = [];
  let cur = "";
  parts.forEach((p, i) => {
    cur = cur ? `${cur} ${p}` : p;
    const next = parts[i + 1];
    if (next !== undefined && (ABBR_ALWAYS.test(cur) || (ABBR_SOFT.test(cur) && !/^[A-Z]/.test(next)) || (ABBR_NUMBER.test(cur) && /^\d/.test(next)))) return;
    out.push(cur.trim());
    cur = "";
  });
  return out.filter(Boolean);
}
export const sentencesOf = (t: string): string[] => splitSentences(strip(t)).filter((s) => wc(s) > 0);

export function lineOf(raw: string[], needle: string): number {
  const probe = needle.slice(0, 40);
  const i = raw.findIndex((l) => l.includes(probe.replace(/"/g, '\\"')) || l.includes(probe));
  return i >= 0 ? i + 1 : 1;
}

/** Copy strings with the path they came from. `claim:` and `feature:` refs and `{{tokens}}` are not copy. */
export function copyStrings(value: unknown, opts: CopyOptions, path = ""): { where: string; text: string; label: boolean }[] {
  const nonCopy = new Set(opts.nonCopyKeys);
  const labelKeys = new Set(opts.labelKeys);
  const walk = (v: unknown, p: string): { where: string; text: string; label: boolean }[] => {
    if (typeof v === "string") return /^(claim|feature):/.test(v) ? [] : [{ where: p, text: v.replace(/\{\{[^}]*\}\}/g, ""), label: false }];
    if (Array.isArray(v)) return v.flatMap((x, i) => walk(x, `${p}[${i}]`));
    if (v && typeof v === "object") {
      return Object.entries(v).flatMap(([k, x]) => {
        if (nonCopy.has(k)) return [];
        const parts = walk(x, p ? `${p}.${k}` : k);
        return labelKeys.has(k) ? parts.map((q) => ({ ...q, label: true })) : parts;
      });
    }
    return [];
  };
  return walk(value, path);
}

/** A page spec's `waivers` block as the same front-matter keys a Markdown draft uses (waive_rules, waive_reason, waive_approved_by). */
function waiverFront(w: unknown): Record<string, string> {
  if (!w || typeof w !== "object") return {};
  const o = w as { rules?: unknown; reason?: unknown; approvedBy?: unknown };
  return Array.isArray(o.rules) ? { waive_rules: o.rules.map(String).join(", "), waive_reason: String(o.reason ?? ""), waive_approved_by: String(o.approvedBy ?? "") } : {};
}

function parseMarkdown(file: string, text: string): Doc {
  text = lf(text);
  const raw = text.split("\n");
  const { front } = parseFrontMatter(text);
  const bodyStart = raw[0]?.trim() === "---" ? raw.findIndex((l, i) => i > 0 && l.trim() === "---") + 1 : 0;
  const lines: Line[] = raw.map((t, i) => ({ n: i + 1, text: t })).slice(bodyStart);
  const headings: Doc["headings"] = [];
  const paragraphs: Doc["paragraphs"] = [];
  const links: Doc["links"] = [];
  const external: Doc["external"] = [];
  const images: Doc["images"] = [];
  const videos: Doc["videos"] = [];
  const faq: Doc["faq"] = [];
  let inFaq = false;
  let fence = false;
  let para: { n: number; text: string } | null = null;
  let faqQ: { n: number; q: string; a: string[] } | null = null;
  const flushPara = () => { if (para) paragraphs.push(para); para = null; };
  const flushFaq = () => { if (faqQ) faq.push({ n: faqQ.n, q: faqQ.q, a: faqQ.a.join(" ").trim() }); faqQ = null; };
  for (const { n, text: t } of lines) {
    if (t.trim().startsWith("```")) { fence = !fence; flushPara(); continue; }
    if (fence) continue;
    const h = t.match(/^(#{1,6})\s+(.*)$/);
    if (h) {
      flushPara();
      const level = h[1].length;
      if (inFaq && level === 3) { flushFaq(); faqQ = { n, q: h[2].trim(), a: [] }; }
      else {
        if (level <= 2) { flushFaq(); inFaq = level === 2 && /^faq\b/i.test(h[2].trim()); }
        headings.push({ n, level, text: h[2].trim() });
      }
      continue;
    }
    for (const m of t.matchAll(LINK_RE)) {
      if (/^https?:\/\//i.test(m[2])) external.push({ n, text: m[1], href: m[2] });
      else links.push({ n, text: m[1], href: m[2], body: true });
      if (VIDEO_URL.test(m[2])) videos.push({ n, src: m[2] });
    }
    // A bare URL is a link too (GitHub-flavored Markdown links it), unless it already sits inside a Markdown link or image.
    for (const m of t.replace(LINK_RE, "").replace(IMAGE_RE, "").matchAll(/https?:\/\/[^\s)<>"]+/g)) external.push({ n, text: m[0], href: m[0].replace(/[.,;:]+$/, "") });
    for (const m of t.matchAll(IMAGE_RE)) images.push({ n, alt: m[1] });
    for (const m of t.matchAll(/<img\b[^>]*\balt="([^"]*)"/gi)) images.push({ n, alt: m[1] });
    const tag = t.match(/<(?:video|iframe)\b[^>]*\bsrc="([^"]+)"/i);
    if (tag && (/<video/i.test(t) || VIDEO_URL.test(tag[1]))) videos.push({ n, src: tag[1] });
    if (t.trim() === "") { flushPara(); continue; }
    if (faqQ) { if (!t.trim().startsWith("`")) faqQ.a.push(t.trim()); continue; }
    if (/^(\s*[-*]\s|\s*\d+\.\s|\s*>|\|)/.test(t) || /^\*Drafted with AI|^\*Written by/.test(t.trim())) { flushPara(); continue; }
    if (!para) para = { n, text: t.trim() };
    else para.text += " " + t.trim();
  }
  flushPara();
  flushFaq();
  const h1 = headings.filter((h) => h.level === 1).map(({ n, text: tx }) => ({ n, text: tx }));
  const answer = paragraphs.find((p) => h1.length > 0 && p.n > h1[0].n);
  return {
    file, kind: "md", front, lines, labels: [], raw, h1, headings, paragraphs, links, external, images, videos, faq, answer, blueprint: front.blueprint || undefined,
    title: front.seo_title, description: front.meta_description, state: front.state ?? "",
    schemaTypes: (front.schema ?? "").split(";").map((s) => s.trim()).filter(Boolean), rulesBlock: {}, archetype: front.archetype || undefined,
  };
}

type Json = Record<string, unknown>;
function parseJson(file: string, text: string, copy: CopyOptions): Doc {
  text = lf(text);
  const raw = text.split("\n");
  const spec = JSON.parse(text) as Json;
  const sections = (Array.isArray(spec.sections) ? spec.sections : []) as Json[];
  const h1: Doc["h1"] = [];
  const headings: Doc["headings"] = [];
  const links: Doc["links"] = [];
  const external: Doc["external"] = [];
  const images: Doc["images"] = [];
  const videos: Doc["videos"] = [];
  const faq: Doc["faq"] = [];
  let answer: Doc["answer"];
  const add = (s: string | undefined, push: (n: number) => void) => s && push(lineOf(raw, s));
  for (const sec of sections) {
    const c = (sec.content ?? {}) as Json;
    add(c.h1 as string, (n) => h1.push({ n, text: c.h1 as string }));
    add(c.h2 as string, (n) => headings.push({ n, level: 2, text: c.h2 as string }));
    if (typeof c.answer === "string" && !answer) answer = { n: lineOf(raw, c.answer), text: c.answer };
    if (sec.type === "FAQSection" && Array.isArray(c.items)) {
      for (const it of c.items as Json[]) if (typeof it.q === "string" && typeof it.a === "string") faq.push({ n: lineOf(raw, it.q), q: it.q, a: it.a });
    }
  }
  // A link under a CTA or report key, or in a hero or closing band, is a button; every other link sits in the page's running copy.
  const buttonKey = /^(cta|ctaPrimary|ctaSecondary|primaryCta|secondaryCta|report|primary|secondary)$/;
  const buttonSection = /Hero$|^CTABand$|^ActionBand$/;
  const collect = (v: unknown, inButton: boolean): void => {
    if (Array.isArray(v)) v.forEach((x) => collect(x, inButton));
    else if (v && typeof v === "object") {
      const o = v as Json;
      if (typeof o.href === "string" && o.href.startsWith("/")) links.push({ n: lineOf(raw, o.href), text: String(o.label ?? o.cta ?? o.href), href: o.href, body: !inButton });
      if (typeof o.href === "string" && /^https?:\/\//i.test(o.href)) external.push({ n: lineOf(raw, o.href), text: String(o.label ?? o.href), href: o.href });
      if (typeof o.alt === "string") images.push({ n: lineOf(raw, o.alt), alt: o.alt });
      // A video counts only when it names one: a section that says "video" with nothing to play is not a video.
      const src = typeof o.youtubeId === "string" ? o.youtubeId : typeof o.videoUrl === "string" ? o.videoUrl : "";
      if (src) videos.push({ n: lineOf(raw, src), src });
      const sectionButton = typeof o.type === "string" && buttonSection.test(o.type);
      // The href itself was handled above; walking it again would count the same link twice.
      for (const [k, x] of Object.entries(o)) if (k !== "href") collect(x, inButton || sectionButton || buttonKey.test(k));
    } else if (typeof v === "string" && /^\/[a-z0-9-/]*$/.test(v) && v.length > 1) links.push({ n: lineOf(raw, v), text: v, href: v, body: !inButton });
    else if (typeof v === "string") for (const m of v.matchAll(LINK_RE)) {
      if (/^https?:\/\//i.test(m[2])) external.push({ n: lineOf(raw, m[0]), text: m[1], href: m[2] });
      else if (m[2].startsWith("/")) links.push({ n: lineOf(raw, m[0]), text: m[1], href: m[2], body: true });
    }
  };
  collect(spec.sections, false);
  const all = copyStrings(spec.sections, copy);
  const lines: Line[] = all.filter((s) => !s.label).map((s) => ({ n: lineOf(raw, s.text), text: s.text }));
  const labels: Line[] = all.filter((s) => s.label).map((s) => ({ n: lineOf(raw, s.text), text: s.text }));
  const seo = (spec.seo ?? {}) as Json;
  const rules = (spec.rules ?? {}) as Json;
  return {
    file, kind: "json", front: { primary_keyword: String(spec.primaryKeyword ?? ""), slug: String(spec.path ?? ""), reviewed_on: String(rules.reviewedOn ?? ""), ...(typeof spec.locale === "string" ? { locale: spec.locale } : {}), ...waiverFront(spec.waivers), ...(typeof spec.searchIntent === "string" ? { intent_primary: spec.searchIntent } : {}), ...(typeof spec.secondaryIntent === "string" ? { intent_secondary: spec.secondaryIntent } : {}) },
    lines, labels, raw, h1, headings, paragraphs: [], links, external, images, videos, faq, answer, title: seo.title as string | undefined,
    blueprint: typeof spec.blueprint === "string" ? spec.blueprint : undefined,
    description: seo.description as string | undefined, state: "",
    schemaTypes: Array.isArray(seo.schema) ? (seo.schema as unknown[]).map(String) : [], rulesBlock: rules,
    archetype: typeof spec.archetype === "string" ? spec.archetype : undefined,
  };
}

/** A Doc from text that is not a file yet (for example a WordPress post), labelled with a name for messages. */
export function docFromText(label: string, text: string, kind: "md" | "json", copy: CopyOptions): Doc {
  return kind === "json" ? parseJson(label, text, copy) : parseMarkdown(label, text);
}

export function loadDoc(file: string, copy: CopyOptions): Doc {
  const text = readFileSync(file, "utf8");
  return extname(file) === ".json" ? parseJson(file, text, copy) : parseMarkdown(file, text);
}
