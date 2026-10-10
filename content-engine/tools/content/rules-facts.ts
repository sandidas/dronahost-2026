/** Rules on what a page claims and who stands behind it: Facts, People, Experience, Sources, Policy, Flags. */
import { relative, resolve, sep } from "node:path";
import { isIsoDate } from "../dates";
import { type Ctx, briefFor, claimRenders, hostCwd, ledgerFor, localeOf, rowBySlug, rowByKeyword } from "./context";
import { type Doc, FLAG, lineOf, sentencesOf, strip } from "./parse";
import { proseLines } from "./rules-text";
import { type Finding, type RuleResult, esc, normSlug, rule, skipped } from "./types";

/** Digits with a unit, a currency amount, "24/7", or a customer count: a number that must have provenance. */
const UNCLAIMED_NUMBER = /(\d[\d.,]*\s?(%|ms|gb|tb|mb|minutes?|mins?|hours?|days?|weeks?|months?|years?|seconds?|x\b|\/month|\/year))|([$£€₹]\s?\d)|\b24\/7\b|\b\d{2,}\+?\s+(sites|customers|clients|countries)\b/i;
const NUMBER_G = new RegExp(UNCLAIMED_NUMBER.source, "gi");
const CURRENCY_AMOUNT = /^[$£€₹]\s?\d[\d,]*(?:\.\d+)?/;
/** The figure appears in the text as a whole number: "9%" is not in "99%". Case and spaces are ignored. */
export const hasFigure = (hay: string, num: string): boolean => {
  const squash = (t: string): string => t.toLowerCase().replace(/\s+/g, "");
  return new RegExp(`(^|[^0-9.,])${esc(squash(num))}(?![0-9])`).test(squash(hay));
};
const FIRST_PERSON = /\b(in my experience|in our experience|i tested|we tested|we found that|our customers (say|said|told)|i have seen|we have seen)\b/i;
/** Plans whose pages meet the strict number rule (every figure from the project's own files) and guide plans: limits.strictPlans, limits.guidePlans. */
const isDraft = (doc: Doc): boolean => /^draft/i.test(doc.state);
const planOf = (ctx: Ctx, doc: Doc): string => (rowBySlug(ctx, doc.front.slug ?? "", localeOf(ctx, doc)) ?? rowByKeyword(ctx, doc.front.primary_keyword ?? "", localeOf(ctx, doc)))?.planNumber ?? "";

export function factRules(ctx: Ctx, doc: Doc): RuleResult[] {
  const out: RuleResult[] = [];
  const prose = proseLines(doc);
  const ledger = ledgerFor(ctx, doc);
  const L = ctx.config.limits;
  const strict = doc.kind === "json" || L.strictPlans.includes(planOf(ctx, doc));
  const draft = isDraft(doc);
  const nf: Finding[] = [];
  for (const l of prose) {
    const text = strip(l.text);
    for (const m of text.matchAll(NUMBER_G)) {
      // A currency match is only "$2"; take the whole amount so "$24.99" is looked up, not "$2".
      const num = (/^[$£€₹]/.test(m[0]) ? text.slice(m.index).match(CURRENCY_AMOUNT)?.[0] ?? m[0] : m[0]).trim();
      if (Object.entries(L.claimedFigures).some(([fig, claim]) => num === fig && claimRenders(ctx, claim))) continue;
      const amount = Number(num.match(CURRENCY_AMOUNT)?.[0].replace(/^[$£€₹]\s?/, "").replace(/,/g, ""));
      if (amount && ctx.priceNumbers.has(amount)) { nf.push({ line: l.n, message: `"${num}" is a price from the pricing file typed into the copy; render it from the pricing file, never type a price` }); continue; }
      if (!ledger.found) { nf.push({ line: l.n, message: `"${num}" is not in the fact ledger (no ledger file found)` }); continue; }
      if (!hasFigure(ledger.text, num)) { nf.push({ line: l.n, message: `"${num}" is not in the fact ledger` }); continue; }
      const fact = ledger.facts.find((f) => hasFigure(f.fact, num));
      if (fact) {
        if (strict && fact.source.type !== "project-file") nf.push({ line: l.n, message: `"${num}" must come from a project file (claims, pricing, company), not ${fact.source.type} ${fact.id}` });
        else if (fact.status !== "verified" && !draft) nf.push({ line: l.n, message: `"${num}" is ledger fact ${fact.id}, which is ${fact.status}` });
      }
    }
  }
  out.push(rule("F1", "Facts", `Every number, price or time maps to the fact ledger or a rendering claim (${strict ? "strict" : "guide"} mode)`, nf));

  const ff: Finding[] = [];
  const feature = ctx.rules.featureWords.map((f) => ({ re: new RegExp(f.pattern, f.caseSensitive ? "" : "i"), claim: f.claim }));
  const about = new RegExp(`\\b(we|our|${esc(ctx.config.name)})\\b`, "i");
  for (const l of prose) {
    for (const s of sentencesOf(l.text)) {
      if (!about.test(s)) continue;
      for (const f of feature) if (f.re.test(s) && !claimRenders(ctx, f.claim)) ff.push({ line: l.n, message: `feature word "${s.match(f.re)?.[0]}" about ${ctx.config.name}, but claim "${f.claim}" does not render` });
    }
  }
  for (const [what, text] of [["title", doc.title], ["description", doc.description], ["H1", doc.h1[0]?.text]] as const) {
    for (const f of feature) if (text && f.re.test(text) && !claimRenders(ctx, f.claim)) ff.push({ line: lineOf(doc.raw, text), message: `feature word "${text.match(f.re)?.[0]}" in the ${what}, but claim "${f.claim}" does not render` });
  }
  out.push(rule("F2", "Facts", "Feature words only when the claim renders", ff));

  const refs = [...new Set((doc.raw.join("\n").match(/claim:[a-z0-9-]+/g) ?? []))];
  const known = new Set(ctx.claims.map((c) => c.id));
  out.push(rule("F3", "Facts", "Every claim: reference exists in the claims registry", ctx.claims.length ? refs.filter((r) => !known.has(r.slice(6))).map((r) => ({ line: lineOf(doc.raw, r), message: `${r} is not in the claims registry` })) : []));
  const hidden = refs.map((r) => ctx.claims.find((c) => c.id === r.slice(6))).filter((c) => c && !c.verified);
  out.push(rule("F4", "Facts", "Claims referenced but not rendering today (information)", [], { note: hidden.length ? hidden.map((c) => `${c!.id} (${c!.status})`).join(", ") : "none" }));
  return out;
}

/** Where the business is based may be said only on the pages the project lists (`locationClaims.allowedPages`). */
function locationRule(ctx: Ctx, doc: Doc, prose: { n: number; text: string }[]): RuleResult {
  const lc = ctx.rules.locationClaims;
  const name = "Only the allowed pages say where the business is based";
  if (!lc || !lc.patterns.length) return skipped("PO4", "Policy", name, "no locationClaims in project/rules.config.json");
  const slug = normSlug(doc.front.slug) || "/";
  if (lc.allowedPages.some((p) => normSlug(p) === slug)) return rule("PO4", "Policy", name, [], { note: `${slug} may say where we are based` });
  const re = new RegExp(lc.patterns.join("|"), "i");
  const fails: Finding[] = [];
  for (const l of prose) {
    const m = strip(l.text).match(re);
    if (m) fails.push({ line: l.n, message: `says where we are based ("${m[0]}"). Only ${lc.allowedPages.join(", ")} may` });
  }
  return rule("PO4", "Policy", name, fails);
}

const NEGATION = /\b(do not|does not|did not|don['’]t|doesn['’]t|didn['’]t|never|not|no|without)\b/i;
/** channelAllowlistFiles: paths relative to the config folder or the host root; a folder covers the files under it. */
function allowlisted(ctx: Ctx, file: string): boolean {
  const abs = resolve(file);
  const rels = [relative(ctx.resolvePath("."), abs), relative(hostCwd(ctx), abs)].map((r) => r.split(sep).join("/"));
  return ctx.rules.channelAllowlistFiles.some((a) => {
    const want = a.replace(/^\.\//, "").replace(/\/+$/, "");
    return !!want && rels.some((r) => r === want || r.startsWith(`${want}/`));
  });
}

export function policyRules(ctx: Ctx, doc: Doc): RuleResult[] {
  const prose = [...proseLines(doc), ...doc.labels];
  // An empty list must match nothing (an empty pattern would match every line).
  const channel = ctx.rules.forbiddenChannels.length ? new RegExp(ctx.rules.forbiddenChannels.map(esc).join("|"), "i") : null;
  const allow = allowlisted(ctx, doc.file);
  const p1: Finding[] = [];
  const p2: Finding[] = [];
  const p3: Finding[] = [];
  for (const l of prose) {
    const t = strip(l.text);
    // A sentence may name the channel when a negation comes before it in the same sentence ("We do not offer phone support").
    if (channel && !allow) {
      for (const s of sentencesOf(l.text)) {
        const m = s.match(channel);
        if (m && !NEGATION.test(s.slice(0, m.index))) p1.push({ line: l.n, message: `mentions a channel the project does not offer (${m[0]}) as if offered` });
      }
    }
    const claim = ctx.rules.forbiddenClaims.find((c) => t.toLowerCase().includes(c.toLowerCase()));
    if (claim) p2.push({ line: l.n, message: `forbidden wording "${claim}" (project/rules.config.json)` });
    if (/\b(guarantee|guaranteed)\b[^.]*\b(rank|ranking|top|first page)/i.test(t)) p3.push({ line: l.n, message: "ranking guarantee" });
  }
  return [
    rule("PO1", "Policy", "No channel the project does not offer", p1),
    rule("PO2", "Policy", "No forbidden claim, location or tax wording", p2),
    rule("PO3", "Policy", "No ranking guarantee", p3),
    locationRule(ctx, doc, prose),
  ];
}

export function peopleRules(ctx: Ctx, doc: Doc): RuleResult[] {
  const draft = isDraft(doc);
  const out: RuleResult[] = [];
  if (doc.kind === "md") {
    const f = doc.front;
    const missing = ["author", "reviewer", "reviewed_on", "next_review_on"].filter((k) => !f[k] || /HUMAN REVIEW/.test(f[k]));
    const absent = missing.filter((k) => !f[k]);
    const placeholders = missing.filter((k) => f[k]);
    const fails = (draft ? absent : missing).map((k) => ({ line: lineOf(doc.raw, `${k}:`), message: `front matter "${k}" is missing${f[k] ? " or still a placeholder" : ""}` }));
    out.push(rule("P1", "People", "Author, reviewer, review date and next review date are real", fails, { note: draft && placeholders.length ? `${placeholders.length} placeholder(s) allowed in a draft: ${placeholders.join(", ")}` : undefined }));
    const ai = /^yes/i.test(f.ai_assisted ?? "");
    const body = doc.lines.map((l) => l.text).join("\n").toLowerCase();
    out.push(rule("P2", "People", "AI-assisted pages carry the disclosure line", ai && !body.includes(ctx.rules.disclosureLine.toLowerCase()) ? [{ line: lineOf(doc.raw, "ai_assisted"), message: "ai_assisted is yes but the disclosure line is missing" }] : []));
    out.push(rule("P3", "People", "An author page is named", [], { warnings: f.author_page ? [] : [{ line: lineOf(doc.raw, "author"), message: "no author_page in the front matter; readers should be able to see who the author is" }] }));
  } else {
    const rv = doc.front.reviewed_on;
    out.push(rule("P1", "People", "Review date set", isIsoDate(rv) ? [] : [{ line: lineOf(doc.raw, "reviewedOn"), message: "rules.reviewedOn missing or not a real YYYY-MM-DD date" }]));
  }
  return out;
}

export function experienceRules(ctx: Ctx, doc: Doc): RuleResult[] {
  if (doc.kind !== "md") return [skipped("E1", "Experience", "Interview answers are on file", "page spec: not an article")];
  const draft = isDraft(doc);
  const brief = briefFor(ctx, doc);
  const out: RuleResult[] = [];
  const e1: Finding[] = [];
  if (!brief) { if (!draft) e1.push({ line: 1, message: "no brief with interview answers found for this page" }); }
  else if (brief.front.interview_status !== "complete" && !draft) e1.push({ line: 1, message: `brief interview_status is "${brief.front.interview_status ?? "unset"}", not complete` });
  out.push(rule("E1", "Experience", "Interview answers are on file", e1, { note: !brief ? "no brief front matter found" : undefined }));
  const e2: Finding[] = [];
  for (const l of proseLines(doc)) if (FIRST_PERSON.test(l.text) && !/\(Q\d+\)/.test(l.text)) e2.push({ line: l.n, message: `"${l.text.match(FIRST_PERSON)?.[0]}" needs a named interview answer; add the question number, for example (Q3)` });
  out.push(rule("E2", "Experience", "First-person experience claims cite an interview answer", e2));
  const flag = /\[HUMAN REVIEW:[^\]]*original element/i;
  const hasArtifact = brief?.front.original_element === "artifact";
  const hasFlag = flag.test(doc.raw.join("\n")) || flag.test(brief?.text ?? "");
  const e3: Finding[] = [];
  if (draft ? !(hasArtifact || hasFlag) : !hasArtifact) e3.push({ line: 1, message: draft ? "no original element: add an artifact in the brief or the flag [HUMAN REVIEW: original element]" : "no original element (artifact) in the brief" });
  out.push(rule("E3", "Experience", "The page has an original element or an open flag for it", e3));
  return out;
}

export function sourceRules(ctx: Ctx, doc: Doc): RuleResult[] {
  if (doc.kind !== "md") return [skipped("SO1", "Sources", "Two or more primary sources with retrieval dates", "page spec: not an article")];
  const plan = planOf(ctx, doc);
  const ledger = ledgerFor(ctx, doc);
  const out: RuleResult[] = [];
  if (plan && !ctx.config.limits.guidePlans.includes(plan)) out.push(skipped("SO1", "Sources", "Two or more primary sources with retrieval dates", `plan ${plan} is not a guide plan`));
  else {
    const urls = new Set(ledger.facts.filter((f) => f.source.type === "url" && f.retrievedOn && f.status === "verified").map((f) => f.source.ref));
    out.push(rule("SO1", "Sources", "Two or more primary sources with retrieval dates", urls.size >= 2 ? [] : [{ line: 1, message: `${urls.size} verified URL source(s) with a retrieval date in the ledger; guides need 2 or more` }]));
  }
  const known = new Set<string>([...(ctx.register?.rows.map((r) => normSlug(r.url)) ?? [])]);
  const unknown = doc.links.filter((l) => l.href.startsWith("/") && !known.has(normSlug(l.href.split("#")[0])));
  out.push(rule("SO2", "Sources", "Internal links point at known pages (information)", [], { warnings: unknown.map((l) => ({ line: l.n, message: `link ${l.href} is not a register URL; confirm the page exists` })) }));
  return out;
}

export function flagRules(doc: Doc): RuleResult[] {
  const flags: Finding[] = [];
  doc.raw.forEach((t, i) => { for (const m of t.matchAll(FLAG)) flags.push({ line: i + 1, message: m[0].slice(0, 70) }); });
  return isDraft(doc)
    ? [rule("G1", "Flags", "No open [HUMAN REVIEW] flag unless the state is Draft", [], { note: `${flags.length} open flag(s), allowed because state is "${doc.state}"` })]
    : [rule("G1", "Flags", "No open [HUMAN REVIEW] flag unless the state is Draft", flags)];
}
