/**
 * Shared text helpers for gen-schema, suggest-links and similarity. Reads a Markdown draft (front matter + body) or a page
 * spec JSON and returns headings, paragraphs, FAQ items, links and plain text. Page JSON copy is found generically with
 * config.adapters.pageSpec.nonCopyKeys and labelKeys. No project names live here.
 */
import { lf } from "./eol";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, extname, join, resolve } from "node:path";
import type { Config } from "../schemas/config";
import { CONFIG_FILE, readConfig } from "./load-config";
import { parseFrontMatter } from "./front-matter";
import { LINK_RE } from "./content/parse";
import { isIsoDate } from "./dates";

/** `site` is the public domain from settings (brand.domain), when the project has settings. */
export type Ctx = { config: Config; resolvePath: (p: string) => string; site?: string };
export type TextDoc = {
  file: string; kind: "md" | "json"; front: Record<string, string>; raw: string[];
  h1: string; headings: { n: number; level: number; text: string }[];
  paragraphs: { n: number; text: string }[];
  faq: { n: number; q: string; a: string }[]; hasFaq: boolean;
  links: { n: number; text: string; href: string }[];
  /** Visible copy as plain text, without button labels. */
  text: string;
};

/** Loads a config file (default: CONTENT_ENGINE_CONFIG or the engine's own), with settings and voice merged, without needing the rules file. */
export function loadCtx(file: string = CONFIG_FILE): Ctx {
  const { config, settings } = readConfig(file);
  return { config, resolvePath: (p: string) => resolve(dirname(file), p), site: settings?.brand.domain };
}

export const fail = (rule: string, file: string, line: number, what: string, fix: string): string => `  FAIL ${rule} ${file}:${line} ${what}. Fix: ${fix}`;
export const isPlaceholder = (v: string | undefined): boolean => !v || /\[HUMAN REVIEW/i.test(v);
export const isRealDate = (v: string | undefined): boolean => isIsoDate(v);
export const normSpace = (t: string): string => t.replace(/\s+/g, " ").trim();
export const words = (t: string): string[] => t.toLowerCase().match(/[a-z0-9]+(?:'[a-z]+)?/g) ?? [];

const cleanLine = (t: string): string =>
  t.replace(/\[HUMAN REVIEW[^\]]*\]/g, "").replace(/^\s*([-*]|\d+\.)\s+/, "").replace(/`[^`]*`/g, "").replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/[*_>#|]/g, " ").replace(/\s+/g, " ").trim();

/** Line (1-based) of the first raw line that contains the first words of `needle`, else 1. */
export function lineOfText(raw: string[], needle: string, probeWords = 3): number {
  const probe = words(needle).slice(0, probeWords);
  if (probe.length === 0) return 1;
  const i = raw.findIndex((l) => { const lw = words(l).join(" "); return lw.includes(probe.join(" ")); });
  return i >= 0 ? i + 1 : 1;
}

function parseMarkdown(file: string, text: string): TextDoc {
  const raw = lf(text).split("\n");
  const { front, body } = parseFrontMatter(text);
  const offset = raw.length - body.split("\n").length;
  const headings: TextDoc["headings"] = [];
  const paragraphs: TextDoc["paragraphs"] = [];
  const faq: TextDoc["faq"] = [];
  const links: TextDoc["links"] = [];
  const out: string[] = [];
  let inFaq = false, hasFaq = false, fence = false;
  let para: { n: number; text: string } | null = null;
  let q: { n: number; q: string; a: string[] } | null = null;
  const flushPara = (): void => { if (para) paragraphs.push(para); para = null; };
  const flushQ = (): void => { if (q) faq.push({ n: q.n, q: q.q, a: normSpace(q.a.join(" ")) }); q = null; };
  body.split("\n").forEach((t, i) => {
    const n = offset + i + 1;
    if (t.trim().startsWith("```")) { fence = !fence; flushPara(); return; }
    if (fence) return;
    const h = t.match(/^(#{1,6})\s+(.*)$/);
    if (h) {
      flushPara();
      const level = h[1].length;
      const title = cleanLine(h[2]);
      if (inFaq && level === 3) { flushQ(); q = { n, q: title, a: [] }; out.push(title); return; }
      if (level <= 2) { flushQ(); inFaq = level === 2 && /^faq\b/i.test(title); if (inFaq) hasFaq = true; }
      headings.push({ n, level, text: title });
      out.push(title);
      return;
    }
    for (const m of t.matchAll(LINK_RE)) links.push({ n, text: m[1], href: m[2] });
    if (t.trim() === "") { flushPara(); return; }
    if (/^\*(Drafted|Written)/.test(t.trim())) { flushPara(); return; }
    const c = cleanLine(t);
    if (c) out.push(c);
    if (q) { if (!t.trim().startsWith("`") && c) q.a.push(c); return; }
    if (/^(\s*[-*]\s|\s*\d+\.\s|\s*>|\|)/.test(t)) { flushPara(); return; }
    if (!para) para = { n, text: c }; else para.text += ` ${c}`;
  });
  flushPara(); flushQ();
  return { file, kind: "md", front, raw, h1: headings.find((h) => h.level === 1)?.text ?? "", headings, paragraphs, faq, hasFaq, links, text: out.join("\n") };
}

type Json = Record<string, unknown>;

function parseJson(file: string, text: string, ctx: Ctx): TextDoc {
  const raw = lf(text).split("\n");
  const spec = JSON.parse(text) as Json;
  const ps = ctx.config.adapters.pageSpec;
  const skip = new Set(ps?.nonCopyKeys ?? []);
  const labels = new Set(ps?.labelKeys ?? []);
  const copy: string[] = [];
  const links: TextDoc["links"] = [];
  const walk = (v: unknown, key: string, isLabel: boolean): void => {
    if (typeof v === "string") {
      const lab = isLabel || labels.has(key);
      if (/^[a-z]+:[\w-]+$/.test(v) || !/[A-Za-z]/.test(v) || /^\/[\w\-/#.]*$/.test(v)) return;
      if (!lab) copy.push(normSpace(v.replace(/\{\{[^}]*\}\}/g, "")));
    } else if (Array.isArray(v)) v.forEach((x) => walk(x, key, isLabel));
    else if (v && typeof v === "object") {
      const o = v as Json;
      if (typeof o.href === "string" && o.href.startsWith("/")) links.push({ n: lineOfText(raw, o.href, 1), text: String(o.label ?? o.cta ?? o.href), href: o.href });
      for (const [k, x] of Object.entries(o)) if (!skip.has(k)) walk(x, k, labels.has(k));
      for (const k of ["href", "links"]) collectLinks(o[k]);
    }
  };
  const collectLinks = (v: unknown): void => {
    if (typeof v === "string" && /^\/[\w\-/]*$/.test(v) && !links.some((l) => l.href === v)) links.push({ n: lineOfText(raw, v, 1), text: v, href: v });
    else if (Array.isArray(v)) v.forEach(collectLinks);
    else if (v && typeof v === "object") Object.values(v as Json).forEach(collectLinks);
  };
  const sections = Array.isArray(spec.sections) ? (spec.sections as Json[]) : [];
  walk(sections, "", false);
  collectLinks((spec.rules as Json | undefined)?.mustLinkTo);
  const headings: TextDoc["headings"] = [];
  const faq: TextDoc["faq"] = [];
  let h1 = "", hasFaq = false;
  for (const sec of sections) {
    const c = (sec.content ?? {}) as Json;
    if (typeof c.h1 === "string") { if (!h1) h1 = c.h1; headings.push({ n: lineOfText(raw, c.h1), level: 1, text: c.h1 }); }
    if (typeof c.h2 === "string") headings.push({ n: lineOfText(raw, c.h2), level: 2, text: c.h2 });
    if (sec.type === "FAQSection") {
      hasFaq = true;
      for (const it of Array.isArray(c.items) ? (c.items as Json[]) : []) {
        if (typeof it.q === "string" && typeof it.a === "string") faq.push({ n: lineOfText(raw, it.q), q: normSpace(it.q), a: normSpace(it.a) });
      }
    }
  }
  const seo = (spec.seo ?? {}) as Json;
  const rules = (spec.rules ?? {}) as Json;
  const front: Record<string, string> = { slug: String(spec.path ?? ""), primary_keyword: String(spec.primaryKeyword ?? ""), reviewed_on: String(rules.reviewedOn ?? ""), seo_title: String(seo.title ?? ""), meta_description: String(seo.description ?? "") };
  return { file, kind: "json", front, raw, h1, headings, paragraphs: [], faq, hasFaq, links, text: copy.join("\n") };
}

export function loadText(file: string, ctx: Ctx): TextDoc {
  const text = readFileSync(file, "utf8");
  return extname(file) === ".json" ? parseJson(file, text, ctx) : parseMarkdown(file, text);
}

/** Lists .md, .mdx and .json files under a path (a file returns itself). Missing paths return nothing. */
export function listDocs(path: string | null): string[] {
  if (!path || !existsSync(path)) return [];
  if (statSync(path).isFile()) return [path];
  return readdirSync(path).sort().flatMap((name) => {
    const p = join(path, name);
    if (statSync(p).isDirectory()) return listDocs(p);
    return /\.(md|mdx|json)$/.test(name) ? [p] : [];
  });
}

/** Parses the shared command line: positional files, flags with values, and --help. */
export function parseArgs(argv: string[], valueFlags: string[]): { files: string[]; flags: Record<string, string[]>; help: boolean } {
  const files: string[] = [];
  const flags: Record<string, string[]> = {};
  let help = false;
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--help" || a === "-h") help = true;
    else if (valueFlags.includes(a)) { (flags[a] ??= []).push(argv[++i] ?? ""); }
    else files.push(a);
  }
  return { files, flags, help };
}
