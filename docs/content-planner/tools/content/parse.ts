/** Reads a Markdown draft (front matter + body) or a page spec JSON into one Doc shape that the rules check. */
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
  links: { n: number; text: string; href: string }[];
  faq: { n: number; q: string; a: string }[];
  answer?: { n: number; text: string };
  title?: string;
  description?: string;
  state: string;
  schemaTypes: string[];
  rulesBlock: Record<string, unknown>;
};
export type CopyOptions = { nonCopyKeys: string[]; labelKeys: string[] };

export const FLAG = /\[HUMAN REVIEW[^\]]*\]/g;
export const wc = (t: string): number => t.split(/\s+/).filter((w) => /[A-Za-z0-9]/.test(w)).length;
export const strip = (t: string): string => t.replace(/`[^`]*`/g, "").replace(/\[HUMAN REVIEW[^\]]*\]/g, "").replace(/\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/[*_>#]/g, "");
export const sentencesOf = (t: string): string[] => strip(t).split(/(?<=[.?!])\s+/).map((s) => s.trim()).filter((s) => wc(s) > 0);

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

function parseMarkdown(file: string, text: string): Doc {
  const raw = text.split("\n");
  const { front } = parseFrontMatter(text);
  const bodyStart = raw[0]?.trim() === "---" ? raw.findIndex((l, i) => i > 0 && l.trim() === "---") + 1 : 0;
  const lines: Line[] = raw.map((t, i) => ({ n: i + 1, text: t })).slice(bodyStart);
  const headings: Doc["headings"] = [];
  const paragraphs: Doc["paragraphs"] = [];
  const links: Doc["links"] = [];
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
    for (const m of t.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)) links.push({ n, text: m[1], href: m[2] });
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
    file, kind: "md", front, lines, labels: [], raw, h1, headings, paragraphs, links, faq, answer,
    title: front.seo_title, description: front.meta_description, state: front.state ?? "",
    schemaTypes: (front.schema ?? "").split(";").map((s) => s.trim()).filter(Boolean), rulesBlock: {},
  };
}

type Json = Record<string, unknown>;
function parseJson(file: string, text: string, copy: CopyOptions): Doc {
  const raw = text.split("\n");
  const spec = JSON.parse(text) as Json;
  const sections = (Array.isArray(spec.sections) ? spec.sections : []) as Json[];
  const h1: Doc["h1"] = [];
  const headings: Doc["headings"] = [];
  const links: Doc["links"] = [];
  const faq: Doc["faq"] = [];
  let answer: Doc["answer"];
  const add = (s: string | undefined, push: (n: number) => void) => s && push(lineOf(raw, s));
  for (const sec of sections) {
    const c = (sec.content ?? {}) as Json;
    add(c.h1 as string, (n) => h1.push({ n, text: c.h1 as string }));
    add(c.h2 as string, (n) => headings.push({ n, level: 2, text: c.h2 as string }));
    if (sec.type === "AnswerBlock" && typeof c.answer === "string") answer = { n: lineOf(raw, c.answer), text: c.answer };
    if (sec.type === "FAQSection" && Array.isArray(c.items)) {
      for (const it of c.items as Json[]) if (typeof it.q === "string" && typeof it.a === "string") faq.push({ n: lineOf(raw, it.q), q: it.q, a: it.a });
    }
  }
  const collect = (v: unknown): void => {
    if (Array.isArray(v)) v.forEach(collect);
    else if (v && typeof v === "object") {
      const o = v as Json;
      if (typeof o.href === "string" && o.href.startsWith("/")) links.push({ n: lineOf(raw, o.href), text: String(o.label ?? o.cta ?? o.href), href: o.href });
      Object.values(o).forEach(collect);
    } else if (typeof v === "string" && /^\/[a-z0-9-/]*$/.test(v) && v.length > 1) links.push({ n: lineOf(raw, v), text: v, href: v });
  };
  collect(spec.sections);
  const all = copyStrings(spec.sections, copy);
  const lines: Line[] = all.filter((s) => !s.label).map((s) => ({ n: lineOf(raw, s.text), text: s.text }));
  const labels: Line[] = all.filter((s) => s.label).map((s) => ({ n: lineOf(raw, s.text), text: s.text }));
  const seo = (spec.seo ?? {}) as Json;
  const rules = (spec.rules ?? {}) as Json;
  return {
    file, kind: "json", front: { primary_keyword: String(spec.primaryKeyword ?? ""), slug: String(spec.path ?? ""), reviewed_on: String(rules.reviewedOn ?? "") },
    lines, labels, raw, h1, headings, paragraphs: [], links, faq, answer, title: seo.title as string | undefined,
    description: seo.description as string | undefined, state: "",
    schemaTypes: Array.isArray(seo.schema) ? (seo.schema as unknown[]).map(String) : [], rulesBlock: rules,
  };
}

export function loadDoc(file: string, copy: CopyOptions): Doc {
  const text = readFileSync(file, "utf8");
  return extname(file) === ".json" ? parseJson(file, text, copy) : parseMarkdown(file, text);
}
