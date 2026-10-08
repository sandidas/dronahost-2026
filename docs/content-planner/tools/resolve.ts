/**
 * Resolve and classify (workflow Stage 0 and 1): turn a title into a keyword the owner must confirm, check the excluded list and
 * the register for ownership and cannibalization, route the keyword to a plan and an intent, and ask the governor. Pure code,
 * no web access. The eval harness and `/write-content` use the same functions.
 */
import type { Config } from "../schemas/config";
import type { RulesConfig } from "../schemas/rules-config";
import { type GovernorStatus } from "./governor";
import { type ParsedRegister, type Row, norm } from "./register";

export type Decision = "accept" | "confirm" | "reject" | "merge" | "refused";
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
    else res.reasons.push("no register row yet: add one before briefing");
    if (owner && owner.status === "published") return { ...res, decision: "merge", reasons: [...res.reasons, "already published: use a refresh, not a new brief"] };
  }
  if (kind === "title") { res.decision = "confirm"; res.reasons.unshift(`derived keyword "${keyword}" from the title; the owner must confirm it before the workflow continues`); }
  if (governor && !governor.allowed) return { ...res, decision: "refused", reasons: [...res.reasons, ...governor.reasons] };
  return res;
}
