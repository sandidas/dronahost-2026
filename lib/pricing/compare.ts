import pricing from "@/data/pricing.json";
import type { ComparisonColumn, ComparisonGroup, ComparisonValue } from "@/components/sections/ComparisonTable";
import { DEFAULT_CURRENCY, formatPrice } from "@/lib/pricing";

type Plan = (typeof pricing.plans)[number];

const fmt = (n: number | null | undefined, unit = ""): ComparisonValue => (n == null ? false : `${n.toLocaleString("en-US")}${unit}`);

/** Metered plans show a cap. Fair-use plans show "Fair use", never "Unlimited". */
const traffic = (p: Plan): ComparisonValue => (p.limits.trafficGB == null ? "Fair use" : `${p.limits.trafficGB.toLocaleString("en-US")} GB`);

const LIMIT_ROWS: { label: string; get: (p: Plan) => ComparisonValue }[] = [
  { label: "Hosting type", get: (p) => (p.family === "wordpress" ? "Managed WordPress" : "Web hosting") },
  { label: "Websites", get: (p) => fmt(p.limits.sites) },
  { label: "Storage", get: (p) => fmt(p.limits.diskSpaceGB, " GB") },
  { label: "Traffic", get: traffic },
  { label: "Memory", get: (p) => fmt(p.limits.ramGB, " GB") },
  { label: "Domains", get: (p) => fmt(p.limits.domains) },
  { label: "Databases", get: (p) => fmt(p.limits.databases) },
  { label: "Backup retention", get: (p) => (p.limits.backupRetentionDays ? `${p.limits.backupRetentionDays} ${p.limits.backupRetentionDays === 1 ? "day" : "days"}` : false) },
  { label: "Dedicated resources", get: (p) => Boolean(p.limits.dedicatedResources) },
];

const CAPABILITY_ROWS: { label: string; key: keyof Plan["capabilities"] }[] = [
  { label: "Free SSL certificate", key: "freeSSL" },
  { label: "DDoS protection", key: "ddosProtection" },
  { label: "Free migration", key: "freeMigration" },
  { label: "Automatic WordPress updates", key: "automaticWordPressUpdates" },
  { label: "Malware scanning", key: "malwareScanning" },
  { label: "Object cache (Redis)", key: "objectCache" },
  { label: "Staging environment", key: "stagingEnvironment" },
  { label: "Server monitoring", key: "serverMonitoring" },
  { label: "Priority support queue", key: "prioritySupportQueue" },
  { label: "Advanced caching", key: "advancedCaching" },
  { label: "Performance tuning", key: "performanceTuning" },
];

/**
 * Builds ComparisonTable props from data/pricing.json, the single source of truth.
 * The contact-only high-traffic tier is not a column: it has no published price or limits.
 */
export function buildPlanComparison() {
  const plans = pricing.plans.filter((p) => p.pricing.annual[DEFAULT_CURRENCY] != null);
  const columns: ComparisonColumn[] = plans.map((p) => {
    const annual = p.pricing.annual[DEFAULT_CURRENCY];
    return {
      key: p.id,
      label: p.name,
      sublabel: annual == null ? "Custom pricing" : `${formatPrice(annual)}/month, billed annually`,
      highlight: Boolean(p.highlight),
    };
  });
  const groups: ComparisonGroup[] = [
    {
      title: "Resources",
      rows: LIMIT_ROWS.map((r) => ({ label: r.label, values: Object.fromEntries(plans.map((p) => [p.id, r.get(p)])) })),
    },
    {
      title: "Included",
      rows: CAPABILITY_ROWS.map((r) => ({
        label: r.label,
        values: Object.fromEntries(plans.map((p) => [p.id, Boolean(p.capabilities[r.key])])),
      })),
    },
  ];
  return { columns, groups };
}
