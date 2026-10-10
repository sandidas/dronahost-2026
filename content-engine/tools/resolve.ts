/**
 * Resolve and classify (workflow Stage 0 and 1): turn a title into a keyword the owner must confirm, check the excluded list and
 * the register for ownership and cannibalization, route the keyword to a plan and an intent, and ask the governor. Pure code,
 * no web access. The eval harness and `/write-content` use the same functions.
 */
import type { Config } from "../schemas/config";
import type { RulesConfig } from "../schemas/rules-config";
import { type GovernorStatus } from "./governor";
import { type ParsedRegister, type Row, norm } from "./register";

/** needs-row: no register row owns the keyword yet; add one (one keyword, one URL) before a brief starts (workflow Stage 0). */
export type Decision = "accept" | "confirm" | "needs-row" | "reject" | "merge" | "refused";
export type Resolution = {
  input: string; kind: "keyword" | "title"; keyword: string; decision: Decision; plan: string; intent: string;
  row?: Row; reasons: string[];
};

const FILLER = new Set(["a", "an", "the", "my", "your", "our", "please"]);

/** A keyword is already plain lowercase, short, and has no punctuation. Anything else is treated as a title. */
export function isPlainKeyword(input: string): boolean {
  return input === norm(input) && /^[a-z0-9 .'-]+$/.test(input) && input.split(" ").length <= 8;
}

/** The phrase a searcher would type: lowercase, no punctuation, no filler words. The owner confirms it. */
export function deriveKeyword(title: string): string {
  return norm(title.replace(/[^\p{L}\p{N}\s.'-]/gu, " ")).split(" ").filter((w) => !FILLER.has(w)).join(" ");
}

export function classify(keyword: string, rules: RulesConfig, brandName: string): { plan: string; intent: string } {
  const kw = norm(keyword);
  const brand = norm(brandName);
  const vs = /\bvs\b|alternative|compare|comparison/.test(kw);
  if (brand && new RegExp(`^${brand.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}( |$)`).test(kw) && !vs) return { plan: "09", intent: rules.intentByPlan["09"] ?? "Find" };
  for (const route of rules.planRouting) {
    if (route.patterns.some((p) => new RegExp(p, "i").test(kw))) return { plan: route.plan, intent: rules.intentByPlan[route.plan] ?? "Learn" };
  }
  return { plan: "03", intent: rules.intentByPlan["03"] ?? "Learn" };
}

export function resolveInput(input: string, opts: { config: Config; rules: RulesConfig; register: ParsedRegister | null; governor: GovernorStatus | null }): Resolution {
  const { config, rules, register, governor } = opts;
  const kind = isPlainKeyword(input) ? "keyword" : "title";
  const keyword = kind === "keyword" ? input : deriveKeyword(input);
  const { plan, intent } = classify(keyword, rules, config.name);
  const res: Resolution = { input, kind, keyword, decision: "accept", plan, intent, reasons: [] };

  if (register) {
    const hit = register.excluded.find((e) => e.keywords.some((x) => x === keyword || new RegExp(`(^| )${x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}( |$)`).test(keyword)));
    if (hit) return { ...res, decision: "reject", reasons: [`excluded keyword (register line ${hit.line}): ${hit.reason}`] };
    const live = register.rows.filter((r) => r.status !== "dropped");
    const owner = live.find((r) => norm(r.keyword) === keyword);
    const secondaryOf = live.find((r) => r.secondary.some((s) => norm(s) === keyword));
    if (!owner && secondaryOf) return { ...res, decision: "merge", row: secondaryOf, reasons: [`"${keyword}" is a secondary phrase of "${secondaryOf.keyword}" (line ${secondaryOf.line}); extend that page instead`] };
    if (owner) { res.row = owner; res.reasons.push(`register row on line ${owner.line} owns it (${owner.url}, ${owner.status})`); }
    else { res.decision = "needs-row"; res.reasons.push("no register row owns this keyword: add one (status validated) to the register, then run resolve again"); }
    if (owner && owner.status === "published") return { ...res, decision: "merge", reasons: [...res.reasons, "already published: use a refresh, not a new brief"] };
  }
  if (kind === "title") { res.decision = "confirm"; res.reasons.unshift(`derived keyword "${keyword}" from the title; the owner must confirm it before the workflow continues`); }
  if (governor && !governor.allowed) return { ...res, decision: "refused", reasons: [...res.reasons, ...governor.reasons] };
  return res;
}

// ---- CLI: `resolve "<keyword or title>"` prints the Stage 0 and Stage 1 result and exits 1 unless the decision is accept or confirm.
import { isMain } from "./is-main";
const invoked = isMain(import.meta.url);
async function main(): Promise<void> {
  if (process.argv.includes("--help") || process.argv.length < 3) {
    console.log('resolve "<keyword or title>": Stage 0 and 1 of the workflow. Prints the keyword (derived from a title if needed), the register owner, the plan, the intent and the governor result. Exits 1 when the decision is needs-row, reject, merge or refused.');
    return;
  }
  const { loadContext } = await import("./content/context");
  const { governorStatus } = await import("./governor");
  const ctx = await loadContext();
  const gov = governorStatus({ config: ctx.config, registerFile: ctx.resolvePath(ctx.config.paths.register), briefsDir: ctx.briefsDir, today: new Date().toISOString().slice(0, 10) });
  const r = resolveInput(process.argv.slice(2).filter((a) => !a.startsWith("--")).join(" "), { config: ctx.config, rules: ctx.rules, register: ctx.register, governor: gov });
  console.log(`Input:     ${r.input} (${r.kind})\nKeyword:   ${r.keyword}\nPlan:      ${r.plan}\nIntent:    ${r.intent}\nDecision:  ${r.decision}`);
  for (const reason of r.reasons) console.log(`  - ${reason}`);
  console.log(`Governor:  ${gov.inFlight} of ${gov.maxInFlight} in flight, ${gov.monthCount} of ${gov.monthCap} new briefs this month, pause ${gov.paused ? "ON" : "off"}`);
  process.exitCode = r.decision === "accept" || r.decision === "confirm" ? 0 : 1;
}
if (invoked) void main();
