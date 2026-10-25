/**
 * Quality and content-page rules (rules section 7, "Writing quality" and "Required elements on content pages").
 * Voice V12 (passive voice) and V13 (grammar and punctuation mechanics), Structure S6 (skimmable), and the Elements group:
 * CP1 keyword in an H2, CP2 keyword in an image alt, CP3 a video, CP4 an external link, CP5 internal links in body copy,
 * CP6 one anchor, one URL and keyword-led anchors, CP7 inbound links (cross-page). CP rules warn until contentPages.enforce.
 */
import type { Ctx } from "./context";
import { type Doc, FLAG, sentencesOf, strip, wc } from "./parse";
import { proseLines } from "./rules-text";
import { type Finding, type RuleResult, normSlug, phraseRe, rule, skipped } from "./types";

const IRREGULAR = "built|done|made|run|kept|sent|shown|given|taken|written|held|known|paid|set|put|found|left|told|seen|chosen|hidden|driven|brought|bought|caught|taught|sold|won|lost|met|read|led|cut|hit|let|shut|spent|lent|meant|begun|broken|frozen|spoken|stolen|forgotten|gotten";
const PASSIVE = new RegExp(`\\b(am|is|are|was|were|be|been|being)\\s+(\\w+ly\\s+)?(\\w+ed|${IRREGULAR})\\b(?!\\s+(to|that)\\b)`, "i");
/** Adjectives that look like participles ("is based", "are interested"); they are not passive voice. */
const ADJECTIVAL = /\b(is|are|was|were|be|been)\s+(based|interested|located|concerned|involved|used to|supposed|excited|tired|pleased|related|limited|included|required|allowed|expected|designed|dedicated|committed|qualified|experienced|advanced|automated|managed|unmanaged|shared|dedicated|detailed|complicated|connected|scheduled|encrypted|verified|confirmed|published)\b/i;
/** Words that legitimately repeat ("that that", "had had"). */
const OK_REPEAT = new Set(["that", "had", "is", "very"]);

export const isPassive = (s: string): boolean => PASSIVE.test(s) && !ADJECTIVAL.test(s);

/** Mechanical grammar and punctuation slips one line of copy can show without a grammar engine. */
export function mechanics(text: string): string[] {
  // Review flags, code and URLs become one placeholder word, so removing them leaves no false double space or stray comma.
  const t = strip(text.replace(FLAG, "flag").replace(/`[^`]*`/g, "code").replace(/https?:\/\/\S+/g, "url"));
  const out: string[] = [];
  for (const m of t.matchAll(/\b([A-Za-z]+)\s+\1\b/gi)) if (!OK_REPEAT.has(m[1].toLowerCase())) out.push(`repeated word "${m[1]} ${m[1]}"`);
  if (/\S {2,}\S/.test(t)) out.push("two spaces in a row");
  if (/\s[,;:?.](\s|$)/.test(t)) out.push("space before punctuation");
  if (/[,;:][A-Za-z]/.test(t.replace(/\d[,:]\d/g, ""))) out.push("no space after a comma, semicolon or colon");
  if ((t.match(/\(/g) ?? []).length !== (t.match(/\)/g) ?? []).length) out.push("unbalanced parentheses");
  if (/\.\.(?!\.)|,,|;;/.test(t)) out.push("doubled punctuation");
  return out;
}

export function qualityRules(ctx: Ctx, doc: Doc): RuleResult[] {
  const L = ctx.config.limits;
  const md = doc.kind === "md";
  const prose = proseLines(doc).filter((l) => !/^\s*(#|\||<!--)/.test(l.text) && !/^\s*\[HUMAN REVIEW/.test(l.text));
  const units = md ? [...doc.paragraphs, ...doc.faq.map((q) => ({ n: q.n, text: q.a }))] : prose;
  const out: RuleResult[] = [];

  const sentences = units.flatMap((u) => sentencesOf(u.text).map((s) => ({ n: u.n, s })));
  const passive = sentences.filter((x) => isPassive(x.s));
  const share = sentences.length ? (passive.length / sentences.length) * 100 : 0;
  const pw: Finding[] = share > L.passiveWarnAbovePercent ? passive.map((x) => ({ line: x.n, message: `passive voice: "${x.s.slice(0, 70)}". Fix: name who does it ("We back up your site", not "Your site is backed up")` })) : [];
  out.push(rule("V12", "Voice", `Active voice: passive sentences ${L.passiveWarnAbovePercent}% or fewer`, [], { warnings: pw, note: `${passive.length} of ${sentences.length} sentences passive (${share.toFixed(0)}%)` }));

  const mech: Finding[] = [];
  for (const l of [...prose, ...doc.labels]) for (const m of mechanics(l.text)) mech.push({ line: l.n, message: m });
  if (md) for (const p of doc.paragraphs) if (wc(strip(p.text)) >= 8 && !/[.?!:)"”’]$/.test(strip(p.text).trim())) mech.push({ line: p.n, message: "paragraph does not end with punctuation" });
  out.push(rule("V13", "Voice", "No grammar or punctuation slips the checker can see (a person still proofreads)", mech));

  const skim: Finding[] = [];
  for (const u of units) { const n = wc(strip(u.text)); if (n > L.paragraphWordsMax) skim.push({ line: u.n, message: `block of ${n} words (maximum ${L.paragraphWordsMax}). Fix: split it, or turn a series into a list` }); }
  if (md) {
    let run = 0;
    let from = doc.h1[0]?.n ?? 1;
    for (const l of doc.lines) {
      if (/^#{1,6}\s/.test(l.text)) { run = 0; from = l.n; continue; }
      run += wc(strip(l.text));
      if (run > L.wordsPerHeadingMax) { skim.push({ line: from, message: `more than ${L.wordsPerHeadingMax} words with no heading. Fix: add an H2 or H3 that answers a question` }); run = -Infinity; }
    }
  }
  out.push(rule("S6", "Structure", "Skimmable: short blocks and a heading at least every few hundred words", [], { warnings: skim }));
  return out;
}

/** True when the page must carry the content-page elements (config contentPages). Markdown articles always count. */
export function isContentPage(ctx: Ctx, doc: Doc): boolean {
  const cp = ctx.config.contentPages;
  const slug = normSlug(doc.front.slug);
  if (slug && cp.exemptPaths.some((p) => normSlug(p) === slug)) return false;
  if (doc.kind === "md") return !doc.blueprint || cp.blueprints.includes(doc.blueprint);
  return !!doc.blueprint && cp.blueprints.includes(doc.blueprint);
}

const STOP = new Set("the a an and or of to for in on with your you how what is are do does can my our from by at as it be this that no".split(" "));
const sig = (t: string): string[] => [...new Set(t.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length > 2 && !STOP.has(w)).map((w) => w.replace(/(ies|es|s)$/, "")))];
const hostOf = (href: string): string => { try { return new URL(href).hostname.replace(/^www\./, ""); } catch { return ""; } };

/** The keyword, or every significant word of it, in the text (the same test K2 uses). */
function hasKeyword(kw: string, text: string): boolean {
  if (!kw) return false;
  const bits = kw.replace(/^how to /, "").split(/\s+/).filter(Boolean);
  return phraseRe(kw).test(text) || bits.every((b) => phraseRe(b).test(text));
}

export function elementRules(ctx: Ctx, doc: Doc): RuleResult[] {
  const cp = ctx.config.contentPages;
  const names: [string, string][] = [
    ["CP1", "Primary keyword in at least one H2"], ["CP2", "Primary keyword in at least one image alt"], ["CP3", "At least one video"],
    [`CP4`, `${cp.externalLinksMin} or more links to other sites`], ["CP5", `${cp.bodyLinksMin} or more internal links in body copy`],
    ["CP6", "One anchor, one URL; anchors name the target page"],
  ];
  if (!isContentPage(ctx, doc)) return names.map(([id, name]) => skipped(id, "Elements", name, "not a content page (contentPages in the config)"));
  const kw = (doc.front.primary_keyword ?? "").toLowerCase();
  const slug = normSlug(doc.front.slug);
  const first = doc.h1[0]?.n ?? 1;
  const res: [string, string, Finding[]][] = [];

  const h2 = doc.headings.filter((h) => h.level === 2);
  res.push(["CP1", names[0][1], h2.some((h) => hasKeyword(kw, h.text)) ? [] : [{ line: h2[0]?.n ?? first, message: `no H2 holds "${kw}" or all its words. Fix: one H2 that answers a question with the keyword in it` }]]);

  const alts = doc.images.filter((i) => i.alt.trim());
  const c2: Finding[] = [];
  if (!doc.images.length) c2.push({ line: first, message: "no image with alt text in the page copy. Fix: add one real image whose alt describes it and naturally includes the keyword" });
  else if (!alts.some((i) => hasKeyword(kw, i.alt))) c2.push({ line: doc.images[0].n, message: `no image alt holds "${kw}". Fix: describe one image in words that include the keyword; keep every other alt purely descriptive` });
  for (const i of alts) if ((i.alt.toLowerCase().split(kw).length - 1) > 1 || i.alt.length > 150) c2.push({ line: i.n, message: `alt text reads as stuffed or too long: "${i.alt.slice(0, 60)}"` });
  res.push(["CP2", names[1][1], c2]);

  res.push(["CP3", names[2][1], doc.videos.length ? [] : [{ line: first, message: "no video. Fix: embed one real video that answers the reader's question (click-to-load, privacy-enhanced embed); never stock or AI footage presented as ours" }]]);

  const own = new Set(cp.ownHosts.map((h) => h.replace(/^www\./, "")));
  const ext = doc.external.filter((l) => !own.has(hostOf(l.href)));
  const c4: Finding[] = ext.length >= cp.externalLinksMin ? [] : [{ line: first, message: `${ext.length} links to other sites, needs ${cp.externalLinksMin}. Fix: cite an authoritative source (official docs, a standard, a regulator); never a competitor's sales page or an affiliate link` }];
  for (const l of ext) if (!/^https:/i.test(l.href)) c4.push({ line: l.n, message: `external link is not https: ${l.href}` });
  res.push(["CP4", names[3][1], c4]);

  const body = [...new Set(doc.links.filter((l) => l.body !== false && normSlug(l.href.split("#")[0]) !== slug).map((l) => normSlug(l.href.split("#")[0])))];
  res.push(["CP5", names[4][1], body.length >= cp.bodyLinksMin ? [] : [{ line: first, message: `${body.length} internal links in running copy (buttons and CTA bands do not count), needs ${cp.bodyLinksMin}. Fix: link from a sentence to the hub, a sibling page or a guide` }]]);

  const c6: Finding[] = [];
  const byAnchor = new Map<string, string>();
  for (const l of doc.links) {
    const a = l.text.trim().toLowerCase();
    const to = normSlug(l.href.split("#")[0]);
    if (!a || a.startsWith("/") || to === slug) continue;
    const prev = byAnchor.get(a);
    if (prev && prev !== to) c6.push({ line: l.n, message: `anchor "${l.text}" points to ${prev} and ${to}. Fix: one anchor text, one URL` });
    else byAnchor.set(a, to);
  }
  const warn6: Finding[] = [];
  for (const l of doc.links.filter((x) => x.body !== false && normSlug(x.href.split("#")[0]) !== slug)) {
    const row = ctx.register?.rows.find((r) => normSlug(r.url) === normSlug(l.href.split("#")[0]));
    const want = row ? sig([row.keyword, ...row.secondary].join(" ")) : [];
    if (want.length && !sig(l.text).some((w) => want.includes(w))) warn6.push({ line: l.n, message: `anchor "${l.text}" shares no word with ${row!.url}'s keyword "${row!.keyword}"` });
  }
  res.push(["CP6", names[5][1], c6]);

  return res.map(([id, name, f]) => {
    const gated = id === "CP3" ? !cp.videoRequired : !cp.enforce;
    const extra = id === "CP6" ? warn6 : [];
    return gated && f.length
      ? rule(id, "Elements", name, [], { warnings: [...f, ...extra], note: id === "CP3" ? "warns until contentPages.videoRequired" : "warns until contentPages.enforce" })
      : rule(id, "Elements", name, f, { warnings: extra });
  });
}

/** CP7 (cross-page): every content page has inbound links from other pages in the run. Navigation and footer links are invisible here, so it warns. */
export function inboundRules(ctx: Ctx, docs: Doc[]): Map<string, RuleResult[]> {
  const out = new Map<string, RuleResult[]>();
  const min = ctx.config.contentPages.inboundLinksMin;
  const name = `${min} or more inbound links from other pages`;
  for (const d of docs) {
    const slug = normSlug(d.front.slug);
    if (!isContentPage(ctx, d) || !slug) { out.set(d.file, [skipped("CP7", "Elements", name, "not a content page or no URL")]); continue; }
    const from = new Set(docs.filter((o) => normSlug(o.front.slug) !== slug && o.links.some((l) => normSlug(l.href.split("#")[0]) === slug)).map((o) => normSlug(o.front.slug) || o.file));
    const w = from.size >= min ? [] : [{ line: 1, message: `${from.size} other page(s) link here (${[...from].join(", ") || "none"}), needs ${min}. Fix: link to it from its hub and a sibling page` }];
    out.set(d.file, [rule("CP7", "Elements", name, [], { warnings: w, note: "navigation and footer links are not counted" })]);
  }
  return out;
}
