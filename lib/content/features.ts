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
  tile: { title: string; description: string; visual?: "cache" | "restore" | "growth" | "channels" | "shield" | "backups" | "builder" | "panel" | "uptime" | "move"; span?: "third" | "half" | "twoThirds" | "full"; href?: string; linkLabel?: string };
};

export const FEATURE_LIBRARY: readonly FeatureDef[] = [
  {
    id: "staging",
    claim: "staging-plans",
    inPlan: (p) => p.capabilities.stagingEnvironment,
    tile: { title: "Staging with clone and sync", description: "Clone your site to a staging copy, test a change there, then sync it back to the live site.", visual: "restore", span: "twoThirds" },
  },
  {
    id: "performance",
    claim: "nginx-caching",
    inPlan: (p) => p.capabilities.builtInCaching,
    tile: { title: "NGINX caching on NVMe", description: "Caching runs on the server, and your files sit on NVMe storage. Switch caching on from your control panel.", visual: "cache", span: "third" },
  },
  {
    id: "security",
    claim: "malware-scanning",
    inPlan: (p) => p.capabilities.malwareScanning,
    tile: { title: "Three security layers", description: "A firewall, brute-force login protection and malware scanning on every plan.", visual: "shield", span: "third" },
  },
  {
    id: "backups",
    claim: "backup-layers",
    inPlan: (p) => p.capabilities.dailyBackups,
    tile: { title: "Two daily backups", description: "One backup on the server and one offsite, every day. Each new copy replaces the one before.", visual: "backups", span: "third", href: "/backup-policy", linkLabel: "How backups work" },
  },
  {
    id: "premium-themes",
    claim: "premium-themes",
    inPlan: null,
    tile: { title: "Divi, Elementor Pro and Astra", description: "We install them on request and keep them up to date. They come with every plan.", visual: "builder", span: "third" },
  },
  {
    id: "control-panel",
    claim: "wp-control-panel",
    inPlan: null,
    tile: { title: "Everything in one control panel", description: "Manage files, databases, plugins, themes, staging and backups from one place. No command line needed.", visual: "panel", span: "third" },
  },
  {
    id: "uptime",
    claim: "uptime-sla",
    inPlan: null,
    tile: { title: "Uptime SLA with service credits", description: "Every plan is covered by our uptime SLA. If we miss it in a month, you can claim a service credit.", visual: "uptime", span: "third", href: "/sla", linkLabel: "Read the SLA" },
  },
  {
    id: "migration",
    claim: "free-migration",
    inPlan: (p) => p.capabilities.freeMigration,
    tile: { title: "Free move of one site", description: "We move one existing site to DronaHost for you. Your old site stays online until you approve the switch.", visual: "move", span: "third", href: "/migration-terms", linkLabel: "Read the migration terms" },
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
