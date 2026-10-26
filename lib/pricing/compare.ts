import pricing from "@/data/pricing.json";
import type { ComparisonColumn, ComparisonGroup, ComparisonValue } from "@/components/sections/ComparisonTable";
import { DEFAULT_CURRENCY, ENABLED_CURRENCIES, formatMoney, isFairUse, type CurrencyCode, type FairUseKey, type Money } from "@/lib/pricing";
import { showPrices } from "@/lib/flags";

type Plan = (typeof pricing.plans)[number];
type Row = { label: string; hint?: string; get: (p: Plan) => ComparisonValue };

const fmt = (n: number | null | undefined, unit = ""): ComparisonValue => (n == null ? false : `${n.toLocaleString("en-US")}${unit}`);

/** A limit listed in the plan's limits.fairUse shows "Fair use", never "Unlimited"; any other null is not set and shows as not included. */
const fairCount = (p: Plan, key: FairUseKey & keyof Plan["limits"]): ComparisonValue => (isFairUse(p, key) ? "Fair use" : fmt(p.limits[key] as number | null));

/** 1 means only the latest daily copy is kept (owner, 2026-10-11). */
const backupKept = (days: number | null | undefined): ComparisonValue => (!days ? false : days === 1 ? "Latest copy kept" : `${days} days kept`);

/** A stored per-currency price as a cell that shows the visitor's currency ("£11.99/month"). */
const money = (amounts: Partial<Record<CurrencyCode, number | null>>, wrap = (s: string) => `${s}/month`): ComparisonValue => {
  const m = formatMoney(amounts, wrap);
  return m ? { amounts: m } : false;
};

/** The annual saving worked out from each currency's own stored prices, so rounding never shows a wrong percentage. */
function saving(p: Plan): ComparisonValue {
  const out: Money = {};
  for (const c of ENABLED_CURRENCIES) {
    const monthly = p.pricing.monthly[c];
    const annual = p.pricing.annual[c];
    if (typeof monthly === "number" && typeof annual === "number" && monthly > 0) out[c] = `${Math.round(((monthly - annual) / monthly) * 100)}%`;
  }
  return Object.keys(out).length ? { amounts: out } : false;
}
const cap = (key: keyof Plan["capabilities"]) => (p: Plan): ComparisonValue => Boolean(p.capabilities[key]);

const RESOURCE_LABEL: Record<string, string> = { shared: "Shared", "semi-dedicated": "Semi-dedicated", dedicated: "Dedicated" };

/** Prices render only while showPrices() is on, the same gate as the plan cards. */
const PRICE_ROWS: Row[] = [
  { label: "Billed annually", hint: "Price per month", get: (p) => money(p.pricing.annual) },
  { label: "Billed monthly", get: (p) => money(p.pricing.monthly) },
  { label: "Renews at", hint: "On the annual plan", get: (p) => money(p.pricing.renewal) },
  { label: "Saving with annual billing", get: saving },
];

const RESOURCE_ROWS: Row[] = [
  { label: "Resources", get: (p) => RESOURCE_LABEL[p.limits.resourceType] ?? false },
  { label: "Websites", get: (p) => fairCount(p, "sites") },
  { label: "NVMe storage", get: (p) => fmt(p.limits.diskSpaceGB, " GB") },
  { label: "CPU cores", get: (p) => fmt(p.limits.cpuCores) },
  { label: "Memory", get: (p) => fmt(p.limits.ramGB, " GB") },
  { label: "Databases", get: (p) => fairCount(p, "databases") },
  // Bandwidth is internal (pricing 4.0.1); visits per month join this group once load-tested.
];

const PROTECTION_ROWS: Row[] = [
  { label: "Daily backup", get: (p) => backupKept(p.limits.backupRetentionDays) },
  { label: "Free SSL certificate", get: cap("freeSSL") },
  { label: "DDoS protection", get: cap("ddosProtection") },
  { label: "Malware scanning", get: cap("malwareScanning") },
  { label: "Server monitoring", get: cap("serverMonitoring") },
];

const TOOL_ROWS: Row[] = [
  { label: "Free migration", get: cap("freeMigration") },
  { label: "Automatic WordPress updates", get: cap("automaticWordPressUpdates") },
  { label: "Staging environment", get: cap("stagingEnvironment") },
  { label: "Built-in caching", get: cap("builtInCaching") },
  { label: "Performance tuning", get: cap("performanceTuning") },
];

/** ["live chat", "ticket", "email"] reads "Live chat, ticket and email". */
const channels = (list: readonly string[]): ComparisonValue => {
  if (!list.length) return false;
  const text = list.length > 1 ? `${list.slice(0, -1).join(", ")} and ${list.at(-1)}` : list[0];
  return `${text.charAt(0).toUpperCase()}${text.slice(1)}`;
};

const SUPPORT_ROWS: Row[] = [
  { label: "Support level", get: (p) => p.support.tier || false },
  { label: "Channels", get: (p) => channels(p.support.channels) },
  { label: "Priority support queue", get: cap("prioritySupportQueue") },
];

/** One add-on per row: "Included", its monthly price where it can be bought, or not available. Sized add-ons show their lowest price. */
function addonRows(): Row[] {
  return pricing.addons.map((a) => {
    const blocks = "options" in a && a.options ? a.options.map((o) => o.pricing.monthly) : "pricing" in a && a.pricing ? [a.pricing.monthly] : [];
    const sized = blocks.length > 1;
    // The lowest price per currency, each from the stored prices.
    const lowest: Partial<Record<CurrencyCode, number>> = {};
    for (const b of blocks) {
      for (const [c, n] of Object.entries(b) as [CurrencyCode, number | null][]) if (typeof n === "number" && (lowest[c] == null || n < (lowest[c] ?? n))) lowest[c] = n;
    }
    const price = money(lowest, (s) => `${sized ? "From " : "+"}${s}/month`);
    return {
      label: a.name,
      hint: sized ? "Price depends on the size you choose" : undefined,
      get: (p: Plan): ComparisonValue => ((a.includedOn as string[]).includes(p.id) ? "Included" : (a.availableOn as string[]).includes(p.id) ? (showPrices() && price ? price : "Available") : false),
    };
  });
}

/**
 * Builds ComparisonTable props from data/pricing.json, the single source of truth: prices (only while prices show), resources,
 * protection, site tools, support and add-ons. The contact-only high-traffic tier is not a column: it has no published price
 * or limits. Columns link to each plan's card (#plan-id) on the same page.
 */
export function buildPlanComparison({ linkToCards = false }: { linkToCards?: boolean } = {}) {
  const plans = pricing.plans.filter((p) => p.pricing.annual[DEFAULT_CURRENCY] != null);
  const prices = showPrices();
  const columns: ComparisonColumn[] = plans.map((p) => {
    const annual = p.pricing.annual[DEFAULT_CURRENCY];
    return {
      key: p.id,
      label: p.name,
      sublabel: p.badge ?? undefined,
      highlight: Boolean(p.highlight),
      href: linkToCards && annual != null ? `#${p.id}` : undefined,
    };
  });
  const group = (title: string, rows: Row[]): ComparisonGroup => ({
    title,
    rows: rows.map((r) => ({ label: r.label, hint: r.hint, values: Object.fromEntries(plans.map((p) => [p.id, r.get(p)])) })),
  });
  const groups: ComparisonGroup[] = [
    ...(prices ? [group("Price", PRICE_ROWS)] : []),
    group("Resources", RESOURCE_ROWS),
    group("Backups and security", PROTECTION_ROWS),
    group("Site tools", TOOL_ROWS),
    group("Support", SUPPORT_ROWS),
    group("Add-ons", addonRows()),
  ];
  return { columns, groups };
}
