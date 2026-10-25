import pricing from "@/data/pricing.json";
import { isVerified } from "@/content/claims";
import { FEATURES } from "@/lib/flags";
import { DEFAULT_CURRENCY, formatMoney, formatPrice, isFairUse, type CurrencyCode, type Money } from "@/lib/pricing";

type RawPlan = (typeof pricing.plans)[number];

/** Serializable plan view model for the pricing UI. Built from data/pricing.json only. */
export type PlanCardData = {
  id: string;
  name: string;
  /** Plan family id from pricing.families (one lineup, "hosting", since pricing 4.0.0). */
  family: string;
  badge: string | null;
  highlight: boolean;
  description: string;
  custom: boolean;
  /** Formatted monthly price (billed monthly), e.g. "$24.99". Null for custom plans. */
  monthly: string | null;
  /** Formatted per-month price when billed annually. Null for custom plans. */
  annual: string | null;
  /** Formatted total billed once a year (12 x the annual per-month price). Null for custom plans. */
  annualTotal: string | null;
  /** Formatted renewal price per month on the annual plan. */
  renewal: string | null;
  /** The same four prices in every enabled currency (stored in pricing.json, never converted). The card shows the visitor's. */
  money: { monthly: Money | null; annual: Money | null; annualTotal: Money | null; renewal: Money | null };
  /** True when the renewal price equals the signup price (data-driven, never assumed). */
  renewalSame: boolean;
  /** The plan's headline features from pricing.json. */
  highlights: string[];
  ctaHref: string;
  ctaLabel: string;
};

/**
 * The feature list on a plan card: the plan's `headlineFeatures` in data/pricing.json, in order. They name only limits and
 * capabilities that are true in the same file (tests/e2e/pricing-v3.spec.ts checks it) and never say "unlimited".
 */
export function planHighlights(plan: RawPlan): string[] {
  return [...plan.headlineFeatures];
}

export function buildPlanCards(currency: CurrencyCode = DEFAULT_CURRENCY): PlanCardData[] {
  return pricing.plans.map((p) => {
    const monthly = p.pricing.monthly[currency];
    const annual = p.pricing.annual[currency];
    const renewal = p.pricing.renewal[currency];
    const custom = annual == null;
    return {
      id: p.id,
      name: p.name,
      family: p.family,
      badge: p.badge ?? null,
      highlight: Boolean(p.highlight),
      description: p.description,
      custom,
      monthly: monthly == null ? null : formatPrice(monthly, currency),
      annual: annual == null ? null : formatPrice(annual, currency),
      annualTotal: annual == null ? null : formatPrice(Math.round(annual * 12 * 100) / 100, currency),
      renewal: renewal == null ? null : formatPrice(renewal, currency),
      money: {
        monthly: formatMoney(p.pricing.monthly),
        annual: formatMoney(p.pricing.annual),
        annualTotal: formatMoney(p.pricing.annualBilledTotal),
        renewal: formatMoney(p.pricing.renewal),
      },
      renewalSame: renewal != null && renewal === annual,
      highlights: planHighlights(p),
      // Checkout is not built yet, so CTAs go to contact until FEATURES.checkout is on.
      ctaHref: FEATURES.checkout ? p.cta.href : `/contact?plan=${p.id}`,
      ctaLabel: p.cta.label,
    };
  });
}

export const VAT_DISPLAY = pricing.currencies[DEFAULT_CURRENCY].vatDisplay;

/** Plan families (WordPress hosting, Web hosting) in display order, each with its plan ids. */
export const PLAN_FAMILIES = pricing.families.map((f) => ({ id: f.id, label: f.label, description: f.description, planIds: f.planIds as readonly string[] }));

/** Cards for one family, in the order pricing.json lists them. */
export const buildFamilyCards = (familyId: string, currency: CurrencyCode = DEFAULT_CURRENCY): PlanCardData[] =>
  buildPlanCards(currency).filter((c) => c.family === familyId);

/** The contact-only tier (Scale, Dedicated Core and Enterprise folded in). No price, resource numbers or "unlimited" are published. */
export const HIGH_TRAFFIC = {
  name: pricing.highTraffic.name,
  description: pricing.highTraffic.description,
  ctaLabel: pricing.highTraffic.cta.label,
  ctaHref: pricing.highTraffic.cta.href,
};

const monthlyOf = (pricingBlock: { monthly: Partial<Record<CurrencyCode, number>> }) => formatPrice(pricingBlock.monthly[DEFAULT_CURRENCY] ?? 0);

const planName = (id: string) => pricing.plans.find((p) => p.id === id)?.name ?? id;
const joinNames = (ids: readonly string[]) => {
  const names = ids.map(planName);
  return names.length > 1 ? `${names.slice(0, -1).join(", ")} and ${names.at(-1)}` : (names[0] ?? "");
};

/** "Included on Pro and Scale. Add it to Starter and Growth." from the add-on's includedOn and availableOn in pricing.json. */
function addonAvailability(a: { availableOn: readonly string[]; includedOn: readonly string[] }): string {
  const allIds = pricing.plans.map((p) => p.id);
  const parts: string[] = [];
  if (a.includedOn.length) parts.push(`Included on ${joinNames(a.includedOn)}.`);
  if (a.availableOn.length) parts.push(a.availableOn.length === allIds.length ? "Available on every plan." : `Add it to ${joinNames(a.availableOn)}.`);
  return parts.join(" ");
}

/** Single-price add-ons. Add-ons with size options (offsite backup) are one card with a selector, below. */
export const ADDONS = pricing.addons.flatMap((a) =>
  "pricing" in a && a.pricing ? [{ id: a.id, name: a.name, description: a.description, monthly: monthlyOf(a.pricing), monthlyAll: formatMoney(a.pricing.monthly), availability: addonAvailability(a) }] : [],
);

/** Offsite backup sizes, from the add-on's `options` in pricing.json. */
export const BACKUP_ADDON = (() => {
  const addon = pricing.addons.find((a) => "options" in a && Array.isArray(a.options) && a.options.length > 0);
  if (!addon || !("options" in addon) || !addon.options) return null;
  const tiers = addon.options.map((o) => ({ id: o.id, name: `${addon.name} — ${o.label}`, description: addon.description, monthly: monthlyOf(o.pricing), monthlyAll: formatMoney(o.pricing.monthly), size: o.label }));
  return { name: addon.name, description: addon.description, tiers, availability: addonAvailability(addon) };
})();

/** Each item is gated by its claim in content/claims.ts when it names one, so nothing unverified is listed. */
export const INCLUDED_WITH_EVERY_PLAN: string[] = pricing.includedWithEveryPlan.filter((i) => i.claimId != null && isVerified(i.claimId)).map((i) => i.label);

export type RenewalCostRow = { id: string; name: string; highlight: boolean; perMonth: Money | null; years: (Money | null)[] };

/**
 * What each plan costs over one, two and three years on annual billing: the stored annual total (pricing.annualBilledTotal)
 * times the number of years, per currency. Valid only because the renewal price equals the signup price (the section is
 * gated by the renewal-price-same claim, and the rows are left out for any plan whose renewal differs).
 */
export function buildRenewalCost(years = 3): RenewalCostRow[] {
  return pricing.plans.flatMap((p) => {
    const { annual, renewal, annualBilledTotal } = p.pricing;
    if (annual[DEFAULT_CURRENCY] == null || renewal[DEFAULT_CURRENCY] !== annual[DEFAULT_CURRENCY]) return [];
    const totals = Array.from({ length: years }, (_, i) => {
      const n = i + 1;
      const amounts = Object.fromEntries(
        Object.entries(annualBilledTotal).map(([c, v]) => [c, typeof v === "number" ? Math.round(v * n * 100) / 100 : null]),
      ) as Partial<Record<CurrencyCode, number | null>>;
      return formatMoney(amounts);
    });
    return [{ id: p.id, name: p.name, highlight: Boolean(p.highlight), perMonth: formatMoney(annual), years: totals }];
  });
}

export type ResourceTier = { id: string; name: string; type: string; cpuCores: number; ramGB: number; highlight: boolean };

/** CPU, memory and resource type per plan, for the business hosting hero graphic. Read from data/pricing.json only. */
export function buildResourceTiers(): ResourceTier[] {
  const label: Record<string, string> = { shared: "Shared", "semi-dedicated": "Semi-dedicated", dedicated: "Dedicated" };
  return pricing.plans.map((p) => ({
    id: p.id,
    name: p.name,
    type: label[p.limits.resourceType] ?? p.limits.resourceType,
    cpuCores: p.limits.cpuCores,
    ramGB: p.limits.ramGB,
    highlight: p.limits.resourceType !== "shared",
  }));
}


export type PlanGuideRow = {
  id: string;
  name: string;
  highlight: boolean;
  /** "25" or "Fair use" (limits.fairUse), never "Unlimited". */
  sites: string;
  storageGB: number;
  cpuCores: number;
  ramGB: number;
  /** "Shared", "Semi-dedicated" or "Dedicated". */
  type: string;
  /** The next plan up, or null for the last plan (above it, high-traffic plans are scoped with the team). */
  next: string | null;
};

/** One row per plan for the plan guide: sites, storage, CPU, memory and resource type, read from data/pricing.json only. */
export function buildPlanGuide(): PlanGuideRow[] {
  const tiers = buildResourceTiers();
  return pricing.plans.map((p, i) => ({
    id: p.id,
    name: p.name,
    highlight: Boolean(p.highlight),
    sites: isFairUse(p, "sites") || p.limits.sites == null ? "Fair use" : String(p.limits.sites),
    storageGB: p.limits.diskSpaceGB,
    cpuCores: p.limits.cpuCores,
    ramGB: p.limits.ramGB,
    type: tiers[i]?.type ?? p.limits.resourceType,
    next: pricing.plans[i + 1]?.name ?? null,
  }));
}
