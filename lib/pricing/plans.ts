import pricing from "@/data/pricing.json";
import { isVerified } from "@/content/claims";
import { FEATURES } from "@/lib/flags";
import { DEFAULT_CURRENCY, formatPrice, type CurrencyCode } from "@/lib/pricing";

type RawPlan = (typeof pricing.plans)[number];

/** Serializable plan view model for the pricing UI. Built from data/pricing.json only. */
export type PlanCardData = {
  id: string;
  name: string;
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

/** Headline features: resources first, then the first included capabilities. Null limit means unlimited. */
export function planHighlights(plan: RawPlan): string[] {
  const { limits, capabilities } = plan;
  const items: string[] = [
    limits.wordPressSites == null ? "Unlimited WordPress sites" : plural(limits.wordPressSites, "WordPress site", "WordPress sites"),
    limits.diskSpaceGB == null ? "Unlimited storage" : `${limits.diskSpaceGB.toLocaleString("en-US")} GB storage`,
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

const toAddon = (a: (typeof pricing.addons)[number]) => ({
  id: a.id,
  name: a.name,
  description: a.description,
  monthly: formatPrice(a.pricing.monthly[DEFAULT_CURRENCY]),
});

const isBackup = (a: { id: string }) => a.id.startsWith("backup-");

/** Add-ons other than offsite backup (those are one card with a size selector). */
export const ADDONS = pricing.addons.filter((a) => !isBackup(a)).map(toAddon);

/** Offsite backup sizes, from pricing.json. The size comes from the add-on name, e.g. "Offsite Backup — 5 GB". */
export const BACKUP_ADDON = (() => {
  const tiers = pricing.addons.filter(isBackup).map((a) => ({ ...toAddon(a), size: a.name.split("—").pop()?.trim() ?? a.name }));
  return tiers.length > 0
    ? { name: "Offsite Backup", description: pricing.addons.find(isBackup)?.description ?? "", tiers }
    : null;
})();

/** The guarantee is listed in pricing.json but only shown once it is verified in content/claims.ts. */
export const INCLUDED_WITH_EVERY_PLAN: string[] = pricing.includedWithEveryPlan
  .filter((i) => i.id !== "money-back" || isVerified("money-back"))
  .map((i) => i.label);
