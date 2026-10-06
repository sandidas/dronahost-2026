import pricing from "@/data/pricing.json";

type RawPlan = (typeof pricing.plans)[number];

/**
 * Platform features that page JSON can reference as `feature:<id>`. A feature shows only when BOTH hold:
 *  1. its claim renders (verified by the owner AND its terms page published), and
 *  2. at least one plan in data/pricing.json actually includes it (when the feature is plan-specific).
 * Which plan includes which feature is read from pricing.json here, never typed by hand in a page.
 */
export type FeatureDef = {
  id: string;
  /** The capability claim that must render, from content/claims.ts. */
  claim: string;
  /** Reads the plan data. Null means the feature is not plan-specific (the claim alone decides). */
  inPlan: ((plan: RawPlan) => boolean) | null;
  /** Draft tile copy (docs/reference/pages/HOME_PAGE_DESIGN.md). It stays hidden until the claim renders. */
  tile: { title: string; description: string; visual?: "cache" | "restore" | "growth" | "channels"; span?: "third" | "half" | "twoThirds" | "full"; href?: string; linkLabel?: string };
};

export const FEATURE_LIBRARY: readonly FeatureDef[] = [
  {
    id: "staging",
    claim: "staging-plans",
    inPlan: (p) => p.capabilities.stagingEnvironment,
    tile: { title: "Staging", description: "Test changes on a copy of your site first, then publish when you are happy.", visual: "restore", span: "twoThirds", href: "/wordpress-hosting", linkLabel: "See WordPress hosting" },
  },
  {
    id: "backups",
    claim: "backups",
    inPlan: (p) => p.limits.backupRetentionDays > 0,
    tile: { title: "Backups", description: "Your site is backed up, so a bad update or a mistake can be undone.", visual: "restore", span: "third", href: "/security", linkLabel: "How we protect sites" },
  },
  {
    id: "security",
    claim: "malware-scanning",
    inPlan: (p) => p.capabilities.freeSSL || p.capabilities.ddosProtection,
    tile: { title: "Security", description: "Malware scanning and protection run in the background, so you do not have to think about them.", span: "third", href: "/security", linkLabel: "Read about security" },
  },
  {
    id: "performance",
    claim: "litespeed",
    inPlan: null,
    tile: { title: "Performance", description: "LiteSpeed servers with built-in caching, set up for WordPress.", visual: "cache", span: "twoThirds", href: "/wordpress-hosting", linkLabel: "Explore WordPress hosting" },
  },
  {
    id: "developer-tools",
    claim: "ssh-wp-cli",
    inPlan: null,
    tile: { title: "Developer tools", description: "SSH and WP-CLI access for people who want to work on the server directly.", span: "half", href: "/wordpress-hosting", linkLabel: "See what is included" },
  },
];

export const featureById = (id: string): FeatureDef | undefined => FEATURE_LIBRARY.find((f) => f.id === id);

/** Ids of the plans in pricing.json that include a feature. Empty for an unknown feature. */
export function plansWithFeature(id: string): string[] {
  const feature = featureById(id);
  if (!feature) return [];
  if (!feature.inPlan) return pricing.plans.map((p) => p.id);
  return pricing.plans.filter(feature.inPlan).map((p) => p.id);
}
