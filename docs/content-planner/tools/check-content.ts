/**
 * check-content v1: pass or fail per rule, with the line. Reads page JSON (content/pages/*.json) and drafts with front matter
 * (.md, .mdx). Groups: Structure, Voice, Facts, People, Metadata, Flags (spec section 7). It gives no score.
 * A rule marked "(project rule)" is ours, not Google's (see rules/sources.md).
 *
 * Usage: npx tsx docs/content-planner/tools/check-content.ts [file or folder ...]
 * Default: the drafts and pages folders named in content-planner.config.json. Exits 1 if any rule fails.
 * Open [HUMAN REVIEW] flags are allowed only when the front matter `state` starts with "Draft".
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { basename, extname, join, resolve } from "node:path";
import { CLAIMS } from "../../../content/claims";
import { copyStrings } from "../../../lib/content/lint";
import { loadConfig } from "./load-config";

export type Group = "Structure" | "Voice" | "Facts" | "People" | "Metadata" | "Flags";
export type RuleResult = { id: string; group: Group; name: string; ok: boolean; skipped?: boolean; failures: { line: number; message: string }[]; note?: string };

type Line = { n: number; text: string };
type Doc = {
  file: string;
  kind: "md" | "json";
  front: Record<string, string>;
  lines: Line[]; // body lines (md) or copy lines (json)
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
};

// Lists and paths come from content-planner.config.json and project/rules.config.json. The tests point the register and ledger
// folder at fixtures with CHECK_CONTENT_REGISTER and CHECK_CONTENT_FACTS.
const { config, rules, resolvePath } = loadConfig();
const registerPath = (): string => process.env.CHECK_CONTENT_REGISTER ?? resolvePath(config.paths.register);
const ledgerDir = (): string => process.env.CHECK_CONTENT_FACTS ?? resolvePath(config.paths.facts);
const FLAG = /\[HUMAN REVIEW[^\]]*\]/g;
const wc = (t: string): number => t.split(/\s+/).filter((w) => /[A-Za-z0-9]/.test(w)).length;
const strip = (t: string): string => t.replace(/`[^`]*`/g, "").replace(/\[HUMAN REVIEW[^\]]*\]/g, "").replace(/\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/[*_>#]/g, "");
const sentencesOf = (t: string): string[] => strip(t).split(/(?<=[.?!])\s+/).map((s) => s.trim()).filter((s) => wc(s) > 0);

// ---------- parse ----------

function parseFront(text: string): { front: Record<string, string>; bodyStart: number } {
  const lines = text.split("\n");
  if (lines[0]?.trim() !== "---") return { front: {}, bodyStart: 0 };
  const front: Record<string, string> = {};
  let i = 1;
  for (; i < lines.length && lines[i].trim() !== "---"; i++) {
    const m = lines[i].match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (m) front[m[1]] = m[2].trim().replace(/^"(.*)"$/, "$1");
  }
  return { front, bodyStart: i + 1 };
}

function parseMarkdown(file: string, text: string): Doc {
  const raw = text.split("\n");
  const { front, bodyStart } = parseFront(text);
  const lines: Line[] = raw.map((t, i) => ({ n: i + 1, text: t })).slice(bodyStart);
  const headings: Doc["headings"] = [];
  const paragraphs: Doc["paragraphs"] = [];
  const links: Doc["links"] = [];
  const faq: Doc["faq"] = [];
  let inFaq = false;
  let fence = false;
  let para: { n: number; text: string } | null = null;
  let faqQ: { n: number; q: string; a: string[] } | null = null;
  const flushPara = () => {
    if (para) paragraphs.push(para);
    para = null;
  };
  const flushFaq = () => {
    if (faqQ) faq.push({ n: faqQ.n, q: faqQ.q, a: faqQ.a.join(" ").trim() });
    faqQ = null;
  };
  for (const { n, text: t } of lines) {
    if (t.trim().startsWith("```")) {
      fence = !fence;
      flushPara();
      continue;
    }
    if (fence) continue;
    const h = t.match(/^(#{1,6})\s+(.*)$/);
    if (h) {
      flushPara();
      const level = h[1].length;
      if (inFaq && level === 3) {
        flushFaq();
        faqQ = { n, q: h[2].trim(), a: [] };
      } else {
        if (level <= 2) {
          flushFaq();
          inFaq = level === 2 && /^faq\b/i.test(h[2].trim());
        }
        headings.push({ n, level, text: h[2].trim() });
      }
      continue;
    }
    for (const m of t.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)) links.push({ n, text: m[1], href: m[2] });
    if (t.trim() === "") {
      flushPara();
      continue;
    }
    if (faqQ) {
      if (!t.trim().startsWith("`")) faqQ.a.push(t.trim());
      continue;
    }
    if (/^(\s*[-*]\s|\s*\d+\.\s|\s*>|\|)/.test(t) || /^\*Drafted with AI|^\*Written by/.test(t.trim())) {
      flushPara();
      continue;
    }
    if (!para) para = { n, text: t.trim() };
    else para.text += " " + t.trim();
  }
  flushPara();
  flushFaq();
  const h1 = headings.filter((h) => h.level === 1).map(({ n, text: tx }) => ({ n, text: tx }));
  const answerPara = paragraphs.find((p) => h1.length > 0 && p.n > h1[0].n);
  return {
    file, kind: "md", front, lines, raw, h1, headings, paragraphs, links, faq,
    answer: answerPara, title: front.seo_title, description: front.meta_description, state: front.state ?? "",
  };
}

function lineOf(raw: string[], needle: string): number {
  const probe = needle.slice(0, 40);
  const i = raw.findIndex((l) => l.includes(probe.replace(/"/g, '\\"')) || l.includes(probe));
  return i >= 0 ? i + 1 : 1;
}

type Json = Record<string, unknown>;
function parseJson(file: string, text: string): Doc {
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
    } else if (typeof v === "string" && v.startsWith("/") && /^\/[a-z0-9-/]*$/.test(v)) links.push({ n: lineOf(raw, v), text: v, href: v });
  };
  collect(spec.sections);
  const lines: Line[] = copyStrings(spec.sections).filter((s) => !s.label).map((s) => ({ n: lineOf(raw, s.text), text: s.text }));
  const seo = (spec.seo ?? {}) as Json;
  const rules = (spec.rules ?? {}) as Json;
  return {
    file, kind: "json", front: { primary_keyword: String(spec.primaryKeyword ?? ""), slug: String(spec.path ?? ""), reviewed_on: String(rules.reviewedOn ?? "") },
    lines, raw, h1, headings, paragraphs: [], links, faq, answer, title: seo.title as string | undefined,
    description: seo.description as string | undefined, state: "",
  };
}

export function loadDoc(file: string): Doc {
  const text = readFileSync(file, "utf8");
  return extname(file) === ".json" ? parseJson(file, text) : parseMarkdown(file, text);
}

// ---------- rules ----------

const rule = (id: string, group: Group, name: string, failures: RuleResult["failures"], extra: Partial<RuleResult> = {}): RuleResult => ({ id, group, name, ok: failures.length === 0, failures, ...extra });
const skipped = (id: string, group: Group, name: string, note: string): RuleResult => ({ id, group, name, ok: true, skipped: true, failures: [], note });

const GENERIC_ANCHOR = /^(click here|here|read more|learn more|this page|link|more)$/i;
const BANNED_VOICE = rules.bannedPhrases;
const UNCLAIMED_NUMBER = /(\d[\d.,]*\s?(%|ms|gb|tb|mb|minutes?|mins?|hours?|days?|weeks?|months?|years?|seconds?|x\b|\/month|\/year))|([$£€]\s?\d)|\b24\/7\b/i;
const FEATURE_WORDS: { re: RegExp; claim: string }[] = rules.featureWords.map((f) => ({ re: new RegExp(f.pattern, f.caseSensitive ? "" : "i"), claim: f.claim }));
const escapeRe = (t: string): string => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const CHANNEL_RE = new RegExp(rules.forbiddenChannels.map(escapeRe).join("|"), "i");
const BRAND_RE = new RegExp(`\\b(we|our|${escapeRe(config.name)})\\b`, "i");
const claimRenders = (id: string): boolean => CLAIMS.some((c) => c.id === id && c.verified);

const ledgerFor = (doc: Doc): string => {
  const slug = (doc.front.slug ?? "").replace(/^\/|\/$/g, "").replace(/\//g, "-") || basename(doc.file, extname(doc.file));
  const candidates = [join(ledgerDir(), `${slug}.md`), join(ledgerDir(), `${basename(doc.file, extname(doc.file))}.md`)];
  const hit = candidates.find((p) => existsSync(p));
  return hit ? readFileSync(hit, "utf8") : "";
};

function registerRow(slug: string): { keyword: string; url: string } | undefined {
  if (!existsSync(registerPath())) return undefined;
  for (const line of readFileSync(registerPath(), "utf8").split("\n")) {
    if (!line.startsWith("|")) continue;
    const cells = line.split("|").slice(1, -1).map((c) => c.trim().replace(/^`|`$/g, ""));
    if (cells.length >= 6 && cells[5] === slug) return { keyword: cells[0], url: cells[5] };
  }
  return undefined;
}

export function checkDoc(doc: Doc): RuleResult[] {
  const out: RuleResult[] = [];
  const md = doc.kind === "md";
  const isDraft = /^draft/i.test(doc.state);
  const copy = doc.lines.filter((l) => l.text.trim() !== "");
  const bodyText = copy.map((l) => l.text).join("\n");

  // ---- Structure
  out.push(rule("S1", "Structure", "Exactly one H1", doc.h1.length === 1 ? [] : [{ line: doc.h1[1]?.n ?? 1, message: doc.h1.length === 0 ? "no H1" : `${doc.h1.length} H1 headings` }]));
  const skips: RuleResult["failures"] = [];
  let prev = 0;
  for (const h of doc.headings) {
    if (prev && h.level > prev + 1) skips.push({ line: h.n, message: `heading level jumps from h${prev} to h${h.level}: "${h.text.slice(0, 50)}"` });
    prev = h.level;
  }
  out.push(rule("S2", "Structure", "No skipped heading levels", skips));
  if (doc.answer) {
    const n = wc(strip(doc.answer.text));
    out.push(rule("S3", "Structure", "Answer block of 40 to 80 words under the H1", n >= 40 && n <= 80 ? [] : [{ line: doc.answer.n, message: `answer block has ${n} words` }]));
  } else out.push(rule("S3", "Structure", "Answer block of 40 to 80 words under the H1", [{ line: doc.h1[0]?.n ?? 1, message: "no answer block found under the H1" }]));
  if (doc.faq.length === 0) out.push(skipped("S4", "Structure", "FAQ of 4 to 6 items, answers 40 to 80 words, one link at most", "no FAQ on this page"));
  else {
    const f: RuleResult["failures"] = [];
    if (doc.faq.length < 4 || doc.faq.length > 6) f.push({ line: doc.faq[0].n, message: `FAQ has ${doc.faq.length} items, needs 4 to 6` });
    for (const q of doc.faq) {
      if (/^\{\{[^}]*\}\}$/.test(q.a.trim())) continue; // a filled-in token such as {{pricing.summary}}
      const n = wc(strip(q.a));
      if (n < 40 || n > 80) f.push({ line: q.n, message: `FAQ answer "${q.q.slice(0, 40)}" has ${n} words, needs 40 to 80` });
      if ((q.a.match(/\[[^\]]+\]\([^)]+\)/g) ?? []).length > 1) f.push({ line: q.n, message: `FAQ answer "${q.q.slice(0, 40)}" has more than one link` });
    }
    out.push(rule("S4", "Structure", "FAQ of 4 to 6 items, answers 40 to 80 words, one link at most", f));
  }
  const internal = [...new Map(doc.links.filter((l) => l.href.startsWith("/")).map((l) => [l.href, l])).values()];
  const generic = doc.links.filter((l) => GENERIC_ANCHOR.test(l.text.trim()));
  const linkFails: RuleResult["failures"] = [];
  if (internal.length < 3) linkFails.push({ line: internal[0]?.n ?? 1, message: `${internal.length} internal links, needs 3 or more` });
  for (const g of generic) linkFails.push({ line: g.n, message: `anchor text "${g.text}" is not descriptive` });
  out.push(rule("S5", "Structure", "3 or more internal links with descriptive anchors", linkFails));

  // ---- Voice
  const banned: RuleResult["failures"] = [];
  for (const l of copy) {
    const low = strip(l.text).toLowerCase();
    for (const p of BANNED_VOICE) if (new RegExp(`(^|[^a-z])${p.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}([^a-z]|$)`).test(low)) banned.push({ line: l.n, message: `banned phrase "${p}"` });
  }
  out.push(rule("V1", "Voice", "No banned phrases", banned));
  out.push(rule("V2", "Voice", "No exclamation marks", copy.filter((l) => /!/.test(strip(l.text)) && !/https?:/.test(l.text)).map((l) => ({ line: l.n, message: "exclamation mark" }))));
  const long: RuleResult["failures"] = [];
  let totalWords = 0;
  let totalSentences = 0;
  for (const p of md ? doc.paragraphs.concat(doc.faq.map((q) => ({ n: q.n, text: q.a }))) : copy) {
    for (const s of sentencesOf(p.text)) {
      const n = wc(s);
      totalWords += n;
      totalSentences++;
      if (n > 28) long.push({ line: p.n, message: `sentence of ${n} words: "${s.slice(0, 60)}..."` });
    }
  }
  out.push(rule("V3", "Voice", "No sentence over 28 words", long));
  const avg = totalSentences ? totalWords / totalSentences : 0;
  out.push(rule("V4", "Voice", "Average sentence 20 words or fewer (reading level proxy)", avg > 20 ? [{ line: 1, message: `average sentence is ${avg.toFixed(1)} words` }] : [], { note: `average ${avg.toFixed(1)} words` }));

  // ---- Facts
  const ledger = ledgerFor(doc);
  const numFails: RuleResult["failures"] = [];
  for (const l of copy) {
    const text = strip(l.text);
    const m = text.match(UNCLAIMED_NUMBER);
    if (!m) continue;
    const num = m[0].trim();
    const inLedger = ledger.includes(num) || ledger.replace(/\s+/g, "").includes(num.replace(/\s+/g, ""));
    if (!inLedger && !(num === "24/7" && claimRenders("support-24-7"))) numFails.push({ line: l.n, message: `"${num}" is not in the fact ledger${ledger ? "" : " (no ledger file found)"}` });
  }
  out.push(rule("F1", "Facts", "Every number, price or time maps to the fact ledger or a rendering claim", numFails));
  const featFails: RuleResult["failures"] = [];
  for (const l of copy) {
    for (const s of sentencesOf(l.text)) {
      if (!BRAND_RE.test(s)) continue;
      for (const f of FEATURE_WORDS) if (f.re.test(s) && !claimRenders(f.claim)) featFails.push({ line: l.n, message: `feature word "${s.match(f.re)?.[0]}" about ${config.name}, but claim "${f.claim}" does not render` });
    }
  }
  out.push(rule("F2", "Facts", "Feature words about the business only when the claim renders", featFails));
  const pol: RuleResult["failures"] = [];
  for (const l of copy) {
    const t = strip(l.text);
    if (CHANNEL_RE.test(t)) {
      if (!/\b(do not|does not|not offer|no )\b/i.test(t) && !rules.channelAllowlistFiles.some((a) => doc.file.includes(a))) pol.push({ line: l.n, message: `mentions a channel the project does not offer (${t.match(CHANNEL_RE)?.[0]}) as if offered` });
    }
    const claim = rules.forbiddenClaims.find((c) => t.toLowerCase().includes(c.toLowerCase()));
    if (claim) pol.push({ line: l.n, message: `forbidden claim wording "${claim}" (project/rules.config.json)` });
    if (/\b(guarantee|guaranteed)\b[^.]*\b(rank|ranking|top|first page)/i.test(t) || /\bvat (included|incl)|\+ vat\b/i.test(t)) pol.push({ line: l.n, message: "ranking guarantee or VAT wording" });
  }
  out.push(rule("F3", "Facts", "No unsupported channel, email, location, ranking or VAT wording", pol));

  // ---- People (drafts and articles). Page JSON carries its review date in rules.reviewedOn.
  if (md) {
    const f = doc.front;
    const missing = ["author", "reviewer", "reviewed_on", "next_review_on"].filter((k) => !f[k] || /HUMAN REVIEW/.test(f[k]));
    const absent = missing.filter((k) => !f[k]);
    const placeholders = missing.filter((k) => f[k]);
    // A placeholder in a Draft is an open flag (rule G1). A missing field always fails.
    const fails = (isDraft ? absent : missing).map((k) => ({ line: lineOf(doc.raw, `${k}:`), message: `front matter "${k}" is missing${f[k] ? " or still a placeholder" : ""}` }));
    out.push(rule("P1", "People", "Author, reviewer, review date and next review date are real", fails, { note: isDraft && placeholders.length ? `${placeholders.length} placeholder(s) allowed in a draft: ${placeholders.join(", ")}` : undefined }));
    const ai = /^yes/i.test(f.ai_assisted ?? "");
    out.push(rule("P2", "People", "AI-assisted pages carry the disclosure line", ai && !bodyText.toLowerCase().includes(rules.disclosureLine.toLowerCase()) ? [{ line: lineOf(doc.raw, "ai_assisted"), message: "ai_assisted is yes but the disclosure line is missing" }] : []));
  } else {
    const rv = doc.front.reviewed_on;
    out.push(rule("P1", "People", "Review date set", rv && /^\d{4}-\d{2}-\d{2}$/.test(rv) ? [] : [{ line: lineOf(doc.raw, "reviewedOn"), message: "rules.reviewedOn missing or not YYYY-MM-DD" }]));
  }

  // ---- Metadata
  const title = doc.title ?? "";
  const desc = doc.description ?? "";
  out.push(rule("M1", "Metadata", "Title 60 characters or fewer, no brand suffix (project rule)", !title ? [{ line: 1, message: "no title" }] : [
    ...(title.length > 60 ? [{ line: lineOf(doc.raw, title), message: `title is ${title.length} characters` }] : []),
    ...(new RegExp(rules.brandSuffixPattern, "i").test(title) ? [{ line: lineOf(doc.raw, title), message: "title carries a brand suffix" }] : []),
  ]));
  out.push(rule("M2", "Metadata", "Description 160 characters or fewer and not a copy of the title (project rule)", !desc ? [{ line: 1, message: "no description" }] : [
    ...(desc.length > 160 ? [{ line: lineOf(doc.raw, desc), message: `description is ${desc.length} characters` }] : []),
    ...(desc.trim().toLowerCase() === title.trim().toLowerCase() ? [{ line: lineOf(doc.raw, desc), message: "description repeats the title" }] : []),
  ]));
  const kw = (doc.front.primary_keyword ?? "").toLowerCase();
  const slug = doc.front.slug ?? "";
  const reg = slug ? registerRow(slug) : undefined;
  const mf: RuleResult["failures"] = [];
  if (!slug) mf.push({ line: 1, message: "no slug in front matter" });
  else if (!reg) mf.push({ line: lineOf(doc.raw, "slug"), message: `slug ${slug} is not the target URL of any register row` });
  else if (kw && reg.keyword.toLowerCase() !== kw) mf.push({ line: lineOf(doc.raw, "primary_keyword"), message: `register keyword for ${slug} is "${reg.keyword}"` });
  out.push(rule("M3", "Metadata", "Slug and primary keyword match the register", mf));
  if (doc.kind === "md" && kw) {
    const first100 = bodyText.split(/\s+/).slice(0, 100).join(" ").toLowerCase();
    const bits = kw.replace(/^how to /, "").split(/\s+/);
    const near = (t: string) => t.toLowerCase().includes(kw) || bits.every((b) => t.toLowerCase().includes(b));
    const kf: RuleResult["failures"] = [];
    if (!near(title)) kf.push({ line: lineOf(doc.raw, "seo_title"), message: "primary keyword not in the title" });
    if (!doc.h1[0] || !near(doc.h1[0].text)) kf.push({ line: doc.h1[0]?.n ?? 1, message: "primary keyword not in the H1" });
    if (!near(first100)) kf.push({ line: doc.h1[0]?.n ?? 1, message: "primary keyword not in the first 100 words" });
    out.push(rule("M4", "Metadata", "Primary keyword in title, H1 and first 100 words", kf));
  }

  // ---- Flags
  const flags: { line: number; message: string }[] = [];
  doc.raw.forEach((t, i) => {
    for (const m of t.matchAll(FLAG)) flags.push({ line: i + 1, message: m[0].slice(0, 70) });
  });
  if (isDraft) out.push(rule("G1", "Flags", "No open [HUMAN REVIEW] flag unless the state is Draft", [], { note: `${flags.length} open flag(s), allowed because state is "${doc.state}"` }));
  else out.push(rule("G1", "Flags", "No open [HUMAN REVIEW] flag unless the state is Draft", flags));
  return out;
}

// ---------- run ----------

function collect(paths: string[]): string[] {
  const files: string[] = [];
  for (const p of paths) {
    if (!existsSync(p)) continue;
    if (statSync(p).isDirectory()) {
      for (const f of readdirSync(p).sort()) if (/\.(md|mdx|json)$/.test(f) && !/^(README|\.)/.test(f)) files.push(join(p, f));
    } else files.push(p);
  }
  return files;
}

export function report(file: string, results: RuleResult[]): boolean {
  console.log(`\n${file}`);
  let group = "";
  for (const r of results) {
    if (r.group !== group) {
      group = r.group;
      console.log(`  ${group}`);
    }
    const tag = r.skipped ? "SKIP" : r.ok ? "PASS" : "FAIL";
    console.log(`    ${tag} ${r.id} ${r.name}${r.note ? ` (${r.note})` : ""}`);
    for (const f of r.failures) console.log(`         line ${f.line}: ${f.message}`);
  }
  return results.every((r) => r.ok);
}

const invoked = process.argv[1] ? resolve(process.argv[1]).endsWith("check-content.ts") : false;
if (invoked) {
  const args = process.argv.slice(2);
  const files = collect(args.length ? args : [resolvePath(config.paths.drafts), resolvePath(config.paths.pages)]);
  let failed = 0;
  for (const f of files) {
    try {
      if (!report(f, checkDoc(loadDoc(f)))) failed++;
    } catch (e) {
      failed++;
      console.log(`\n${f}\n    FAIL could not read: ${(e as Error).message}`);
    }
  }
  console.log(`\n${files.length} file(s) checked, ${failed} with failures.`);
  process.exit(failed ? 1 : 0);
}
