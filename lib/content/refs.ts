import { CLAIMS, claimRenders } from "@/content/claims";
import { FEATURES, showSamples } from "@/lib/flags";
import { leadFormReady } from "@/lib/leads/config";
import { startingPrice, formatPrice, DEFAULT_CURRENCY } from "@/lib/pricing";
import pricing from "@/data/pricing.json";
import { featureById, plansWithFeature } from "./features";
import { splitRequires, TOKEN_RE } from "./requires-grammar";

/**
 * Everything a page may depend on is looked up here, behind one interface, so tests can inject answers and a page can never
 * read a flag, a claim or pricing data on its own.
 */
export type ResolveContext = {
  /** Does this claim render (verified AND terms page published)? */
  claimRenders: (id: string) => boolean;
  /** A feature flag from lib/flags.ts. */
  flag: (name: string) => boolean;
  /** A named predicate, for example `verifiedReviews`. */
  predicate: (name: string) => boolean;
  /** Ids of the plans that include a feature (pricing.json). */
  plansWithFeature: (id: string) => string[];
};

export const defaultContext: ResolveContext = {
  claimRenders: (id) => {
    const claim = CLAIMS.find((c) => c.id === id);
    // Development preview: an owner-verified claim whose terms page is still a draft (for example a product page under
    // review) renders, so the owner can review the page before publishing it. Production and the content checks use the
    // single gate (verified AND terms page published).
    return claim ? claimRenders(claim) || (showSamples() && claim.status === "verified" && Boolean(claim.termsPage)) : false;
  },
  flag: (name) => (name in FEATURES ? Boolean((FEATURES as Record<string, boolean>)[name]) : false),
  // verifiedReviews stays false in production until data/reviews.json has a publishable entry. leadFormReady is true when a request has somewhere to go (and in development).
  // verifiedReviews is true in the development sample preview only (showSamples), so the sample reviews can render there.
  predicate: (name) => (name === "leadFormReady" ? leadFormReady() : name === "verifiedReviews" ? showSamples() : false),
  plansWithFeature,
};

/** `claim:money-back` renders only through the claim gate. An unknown claim never renders. */
export const resolveClaimRef = (ref: string, ctx: ResolveContext = defaultContext): boolean => ctx.claimRenders(ref.replace(/^claim:/, ""));

/** `feature:staging` renders when its claim renders AND (if plan-specific) at least one plan includes it. */
export function resolveFeatureRef(ref: string, ctx: ResolveContext = defaultContext): boolean {
  const feature = featureById(ref.replace(/^feature:/, ""));
  if (!feature) return false;
  if (!ctx.claimRenders(feature.claim)) return false;
  return feature.inPlan === null || ctx.plansWithFeature(feature.id).length > 0;
}

/** True when every `&&`-joined term holds. An empty or undefined expression is true. */
export function resolveRequires(expr: string | undefined, ctx: ResolveContext = defaultContext): boolean {
  if (!expr) return true;
  return splitRequires(expr).every((term) => {
    if (term.startsWith("FEATURES.")) return ctx.flag(term.slice("FEATURES.".length));
    if (term.startsWith("claim:")) return resolveClaimRef(term, ctx);
    if (term.startsWith("feature:")) return resolveFeatureRef(term, ctx);
    return ctx.predicate(term);
  });
}

/** Does a section or item with these two optional conditions render? */
export const passes = (item: { requires?: string; requiresClaim?: string }, ctx: ResolveContext = defaultContext): boolean =>
  resolveRequires(item.requires, ctx) && (!item.requiresClaim || resolveClaimRef(item.requiresClaim, ctx));

/** "Plans start at $9.99/month billed annually, renewing at $9.99/month." Built from pricing.json; empty when nothing is priced. */
export function pricingSummary(): string {
  const start = startingPrice("annual");
  if (start === null) return "";
  const plan = pricing.plans.find((p) => p.pricing.annual[DEFAULT_CURRENCY] === start);
  const renewal = plan?.pricing.renewal[DEFAULT_CURRENCY];
  const base = `Plans start at ${formatPrice(start)}/month billed annually`;
  return renewal == null ? `${base}.` : `${base}, renewing at ${formatPrice(renewal)}/month.`;
}

/** Fills `{{pricing.summary}}` style tokens. Unknown tokens are rejected by the schema before this runs. */
export function fillTemplate(text: string): string {
  return text.replace(TOKEN_RE, (_m, token: string) => (token === "pricing.summary" ? pricingSummary() : ""));
}
