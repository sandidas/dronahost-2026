/** Rules on what a page claims and who stands behind it: Facts, People, Experience, Sources, Policy, Flags. */
import { type Ctx, briefFor, claimRenders, ledgerFor, rowBySlug, rowByKeyword } from "./context";
import { type Doc, FLAG, lineOf, sentencesOf, strip } from "./parse";
import { proseLines } from "./rules-text";
import { type Finding, type RuleResult, esc, rule, skipped } from "./types";

/** Digits with a unit, a currency amount, "24/7", or a customer count: a number that must have provenance. */
const UNCLAIMED_NUMBER = /(\d[\d.,]*\s?(%|ms|gb|tb|mb|minutes?|mins?|hours?|days?|weeks?|months?|years?|seconds?|x\b|\/month|\/year))|([$£€₹]\s?\d)|\b24\/7\b|\b\d{2,}\+?\s+(sites|customers|clients|countries)\b/i;
const FIRST_PERSON = /\b(in my experience|in our experience|i tested|we tested|we found that|our customers (say|said|told)|i have seen|we have seen)\b/i;
/** Plans whose pages must meet the strict number rule: every figure comes from the project's own files. */
const STRICT_PLANS = new Set(["01", "05", "06", "08", "09", "14"]);
const GUIDE_PLANS = new Set(["02", "03", "04", "07", "14"]);

const isDraft = (doc: Doc): boolean => /^draft/i.test(doc.state);
const planOf = (ctx: Ctx, doc: Doc): string => (rowBySlug(ctx, doc.front.slug ?? "") ?? rowByKeyword(ctx, doc.front.primary_keyword ?? ""))?.planNumber ?? "";

export function factRules(ctx: Ctx, doc: Doc): RuleResult[] {
  const out: RuleResult[] = [];
  const prose = proseLines(doc);
  const ledger = ledgerFor(ctx, doc);
  const strict = doc.kind === "json" || STRICT_PLANS.has(planOf(ctx, doc));
  const draft = isDraft(doc);
  const nf: Finding[] = [];
  for (const l of prose) {
    const text = strip(l.text);
    const m = text.match(UNCLAIMED_NUMBER);
    if (!m) continue;
    const num = m[0].trim();
    if (num === "24/7" && claimRenders(ctx, "support-24-7")) continue;
    const squash = (s: string) => s.replace(/\s+/g, "");
    const inText = ledger.text.includes(num) || squash(ledger.text).includes(squash(num));
    const amount = Number(text.match(/[$£€₹]\s?(\d[\d,]*(?:\.\d+)?)/)?.[1]?.replace(/,/g, ""));
    if (amount && ctx.priceNumbers.has(amount)) { nf.push({ line: l.n, message: `"${num}" is a price from the pricing file typed into the copy; render it from the pricing file, never type a price` }); continue; }
    if (!ledger.found) { nf.push({ line: l.n, message: `"${num}" is not in the fact ledger (no ledger file found)` }); continue; }
    if (!inText) { nf.push({ line: l.n, message: `"${num}" is not in the fact ledger` }); continue; }
    const fact = ledger.facts.find((f) => f.fact.includes(num) || squash(f.fact).includes(squash(num)));
    if (fact) {
      if (strict && fact.source.type !== "project-file") nf.push({ line: l.n, message: `"${num}" must come from a project file (claims, pricing, company), not ${fact.source.type} ${fact.id}` });
      else if (fact.status !== "verified" && !draft) nf.push({ line: l.n, message: `"${num}" is ledger fact ${fact.id}, which is ${fact.status}` });
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
  const slug = (doc.front.slug ?? "").replace(/\/+$/, "") || "/";
  if (lc.allowedPages.includes(slug)) return rule("PO4", "Policy", name, [], { note: `${slug} may say where we are based` });
  const re = new RegExp(lc.patterns.join("|"), "i");
  const fails: Finding[] = [];
  for (const l of prose) {
    const m = strip(l.text).match(re);
    if (m) fails.push({ line: l.n, message: `says where we are based ("${m[0]}"). Only ${lc.allowedPages.join(", ")} may` });
  }
  return rule("PO4", "Policy", name, fails);
}

export function policyRules(ctx: Ctx, doc: Doc): RuleResult[] {
  const prose = [...proseLines(doc), ...doc.labels];
  // An empty list must match nothing (an empty pattern would match every line).
  const channel = ctx.rules.forbiddenChannels.length ? new RegExp(ctx.rules.forbiddenChannels.map(esc).join("|"), "i") : null;
  const allow = ctx.rules.channelAllowlistFiles.some((a) => doc.file.includes(a));
  const p1: Finding[] = [];
  const p2: Finding[] = [];
  const p3: Finding[] = [];
  for (const l of prose) {
    const t = strip(l.text);
    if (channel && channel.test(t) && !/\b(do not|does not|not offer|no )\b/i.test(t) && !allow) p1.push({ line: l.n, message: `mentions a channel the project does not offer (${channel ? t.match(channel)?.[0] : ""}) as if offered` });
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
    out.push(rule("P1", "People", "Review date set", rv && /^\d{4}-\d{2}-\d{2}$/.test(rv) ? [] : [{ line: lineOf(doc.raw, "reviewedOn"), message: "rules.reviewedOn missing or not YYYY-MM-DD" }]));
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
  if (plan && !GUIDE_PLANS.has(plan)) out.push(skipped("SO1", "Sources", "Two or more primary sources with retrieval dates", `plan ${plan} is not a guide plan`));
  else {
    const urls = new Set(ledger.facts.filter((f) => f.source.type === "url" && f.retrievedOn && f.status === "verified").map((f) => f.source.ref));
    out.push(rule("SO1", "Sources", "Two or more primary sources with retrieval dates", urls.size >= 2 ? [] : [{ line: 1, message: `${urls.size} verified URL source(s) with a retrieval date in the ledger; guides need 2 or more` }]));
  }
  const known = new Set<string>([...(ctx.register?.rows.map((r) => r.url) ?? [])]);
  const unknown = doc.links.filter((l) => l.href.startsWith("/") && !known.has(l.href.split("#")[0]));
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
