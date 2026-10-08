import pricing from "@/data/pricing.json";
import { isVerified } from "@/content/claims";
import { FEATURES } from "@/lib/flags";
import { DEFAULT_CURRENCY, formatPrice, type CurrencyCode } from "@/lib/pricing";

type RawPlan = (typeof pricing.plans)[number];

/** Serializable plan view model for the pricing UI. Built from data/pricing.json only. */
export type PlanCardData = {
  id: string;
  name: string;
  /** Plan family id from pricing.families ("wordpress" or "web"). */
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
  /** True when the renewal price equals the signup price (data-driven, never assumed). */
  renewalSame: boolean;
  /** Up to six headline features. */
  highlights: string[];
  ctaHref: string;
  ctaLabel: string;
};

const CAPABILITY_LABELS: [keyof RawPlan["capabilities"], string][] = [
  ["stagingEnvironment", "Staging environment"],
  ["freeMigration", "Free migration"],
  ["prioritySupportQueue", "Priority support queue"],
  ["advancedCaching", "Advanced caching"],
  ["performanceTuning", "Performance tuning"],
  ["dedicatedAccount", "Dedicated account manager"],
];

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

/** Headline features: resources first, then the first included capabilities. Site counts are capped, so no "unlimited" wording. */
export function planHighlights(plan: RawPlan): string[] {
  const { limits, capabilities } = plan;
  const items: string[] = [
    plan.family === "wordpress"
      ? plural(limits.wordPressSites ?? limits.sites, "managed WordPress site", "managed WordPress sites")
      : plural(limits.sites, "website", "websites"),
    `${limits.diskSpaceGB.toLocaleString("en-US")} GB storage`,
    `${limits.ramGB} GB memory`,
    `${limits.backupRetentionDays}-day backup retention`,
  ];
  for (const [key, label] of CAPABILITY_LABELS) {
    if (items.length >= 6) break;
    if (capabilities[key]) items.push(label);
  }
  return items;
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

/** Single-price add-ons. Add-ons with size options (offsite backup) are one card with a selector, below. */
export const ADDONS = pricing.addons.flatMap((a) =>
  "pricing" in a && a.pricing ? [{ id: a.id, name: a.name, description: a.description, monthly: monthlyOf(a.pricing) }] : [],
);

/** Offsite backup sizes, from the add-on's `options` in pricing.json. */
export const BACKUP_ADDON = (() => {
  const addon = pricing.addons.find((a) => "options" in a && Array.isArray(a.options) && a.options.length > 0);
  if (!addon || !("options" in addon) || !addon.options) return null;
  const tiers = addon.options.map((o) => ({ id: o.id, name: `${addon.name} — ${o.label}`, description: addon.description, monthly: monthlyOf(o.pricing), size: o.label }));
  return { name: addon.name, description: addon.description, tiers };
})();

/** Each item is gated by its claim in content/claims.ts when it names one, so nothing unverified is listed. */
export const INCLUDED_WITH_EVERY_PLAN: string[] = pricing.includedWithEveryPlan.filter((i) => i.claimId != null && isVerified(i.claimId)).map((i) => i.label);
