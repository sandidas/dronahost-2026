import pricing from "@/data/pricing.json";
import type { ComparisonRow } from "@/components/sections/ComparisonTable";
import { CLAIMS, isVerified } from "@/content/claims";
import type { CompetitorData, FactKey } from "@/data/vs/types";
import { showPrices } from "@/lib/flags";
import { formatPrice } from "@/lib/pricing";

/** Row order and wording of the table. */
export const FACT_LABELS: Record<FactKey, string> = {
  price: "Starting price",
  renewal: "Price after the first term",
  sites: "Websites",
  storage: "Storage",
  backups: "Backups",
  support: "Support",
  moneyBack: "Money-back guarantee",
  uptime: "Uptime guarantee",
  migration: "Site migration",
};
export const FACT_ORDER = Object.keys(FACT_LABELS) as FactKey[];

export const NOT_STATED = "Not stated on the page we checked";
export const NOT_CHECKED = "Not checked yet";

const claimText = (id: string): string | null => CLAIMS.find((c) => c.id === id && c.verified)?.text ?? null;

type PlanRaw = (typeof pricing.plans)[number];
const planById = (id: string): PlanRaw | undefined => pricing.plans.find((p) => p.id === id);

/**
 * DronaHost's side of the table. Never typed by hand: prices and limits come from data/pricing.json (prices only when
 * they may be shown), and guarantees come only from claims that render. A fact that cannot be shown returns undefined and
 * its row is left out of the table.
 */
export function dronahostFacts(planId: string): Partial<Record<FactKey, string>> {
  const plan = planById(planId);
  if (!plan) return {};
  const out: Partial<Record<FactKey, string>> = {};
  const annual = plan.pricing.annual.USD;
  const renewal = plan.pricing.renewal.USD;
  if (showPrices() && annual != null) out.price = `${formatPrice(annual)}/mo, billed annually`;
  if (showPrices() && renewal != null) out.renewal = `${formatPrice(renewal)}/mo`;
  const { sites, diskSpaceGB, backupRetentionDays } = plan.limits;
  if (sites != null) out.sites = sites === 1 ? "1 website" : `${sites} websites`;
  if (diskSpaceGB != null) out.storage = `${diskSpaceGB} GB`;
  if (isVerified("backup-retention") && backupRetentionDays != null) out.backups = `Daily backups, kept for ${backupRetentionDays} days`;
  else if (isVerified("backups")) out.backups = claimText("backups") ?? undefined;
  const channels = plan.support.channels;
  if (channels.length > 0) {
    const names = channels.map((c) => (c === "ticket" ? "support ticket" : c));
    const joined = names.length === 1 ? names[0] : `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
    out.support = `${joined.charAt(0).toUpperCase()}${joined.slice(1)}${isVerified("support-24-7") ? ", 24/7" : ""}`;
  }
  if (isVerified("money-back")) out.moneyBack = claimText("money-back") ?? undefined;
  if (isVerified("uptime-sla")) out.uptime = claimText("uptime-sla") ?? undefined;
  if (isVerified("free-migration")) out.migration = claimText("free-migration") ?? undefined;
  return out;
}

/** Fill `{name}`, `{plan}` and `{price}`-style fact tokens from the competitor data. Unknown tokens throw, so a typo cannot ship. */
export function fill(text: string, d: CompetitorData): string {
  return text.replace(/\{(\w+)\}/g, (_, key: string) => {
    if (key === "name") return d.name;
    if (key === "plan") return d.plan.name;
    const fact = d.facts[key as FactKey];
    if (!fact || fact.value === null) throw new Error(`vs/${d.slug}: token {${key}} has no value`);
    return fact.value;
  });
}

const competitorCell = (d: CompetitorData, key: FactKey): string => {
  const fact = d.facts[key];
  if (!fact) return NOT_CHECKED;
  return fact.value ?? NOT_STATED;
};

/** Table rows: only facts DronaHost can show. Every row has a competitor cell, even if it is "not stated". */
export function comparisonRows(d: CompetitorData): ComparisonRow[] {
  const mine = dronahostFacts(d.dronahostPlanId);
  return FACT_ORDER.filter((k) => mine[k] !== undefined).map((k) => ({ label: FACT_LABELS[k], values: { dronahost: mine[k] as string, competitor: competitorCell(d, k) } }));
}

/** Points in the competitor's favour: sourced facts with a value. */
export function competitorStrengths(d: CompetitorData): { label: string; value: string }[] {
  return d.strengths.flatMap((k) => {
    const v = d.facts[k]?.value;
    return v ? [{ label: FACT_LABELS[k], value: v }] : [];
  });
}

/** Points in DronaHost's favour. Each needs a claim that renders, so none show until claims are verified. */
export function dronahostStrengths(d: CompetitorData): string[] {
  const out: string[] = [];
  const renewal = d.facts.renewal?.value;
  if (isVerified("renewal-price-same") && renewal) out.push(`Your renewal price is the same as your signup price. ${d.name}: ${renewal}.`);
  const moneyBack = claimText("money-back");
  if (moneyBack && d.facts.moneyBack && d.facts.moneyBack.value === null) out.push(`${moneyBack}. The ${d.name} page we checked does not state a money-back guarantee.`);
  return out;
}

export const formatReviewDate = (iso: string): string =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

const list = (items: string[]): string => (items.length <= 1 ? (items[0] ?? "") : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`);

/** Sentences for "Price, in plain terms". Built only from sourced competitor values and prices that may be shown. Empty when there is nothing to say. */
export function priceInPlainTerms(d: CompetitorData): string[] {
  const mine = dronahostFacts(d.dronahostPlanId);
  const price = d.facts.price?.value;
  const renewal = d.facts.renewal?.value;
  const out: string[] = [];
  if (price && renewal) out.push(`${d.name} ${d.plan.name}: ${price}. After the first term it renews at ${renewal}.`);
  else if (price) out.push(`${d.name} ${d.plan.name}: ${price}. The page we checked does not state the renewal price.`);
  if (mine.price && mine.renewal) out.push(`DronaHost ${planLabel(d.dronahostPlanId)}: ${mine.price}. It renews at ${mine.renewal}.`);
  if (out.length > 0) out.push("Prices exclude tax. Customers in India pay GST at checkout. Check each source for the current price before you decide.");
  return out;
}

const planLabel = (id: string): string => planById(id)?.name ?? id;

export type VsFaq = { question: string; answer: string };

/** Five or six buyer-language questions, each answered in 40 to 80 words from data on this page only. */
export function comparisonFaq(d: CompetitorData): VsFaq[] {
  const mine = dronahostFacts(d.dronahostPlanId);
  const faqs: VsFaq[] = [];
  const price = d.facts.price?.value;
  const renewal = d.facts.renewal?.value;

  faqs.push({
    question: `Is it hard to move from ${d.name} to DronaHost?`,
    answer: `${isVerified("migration-process") ? `${claimText("migration-process")}. ` : ""}To start, send your current host details on the migration page and the team replies by email. Your ${d.name} site stays where it is until you decide to switch, so you can compare before you commit. We do not promise a time or a price for the move on this page.`,
  });
  if (price && renewal) {
    faqs.push({
      question: `Is ${d.name} cheaper at renewal?`,
      answer: `${d.name} lists ${price} for ${d.plan.name} and ${renewal} after the first term, as read on ${formatReviewDate(d.reviewedOn)}. ${mine.renewal ? `DronaHost ${planLabel(d.dronahostPlanId)} renews at ${mine.renewal}.` : "DronaHost shows the renewal price on each plan card once prices are confirmed."} Compare the renewal figures, not only the first-term price, because that is what you pay for most of the years you stay.`,
    });
  }
  faqs.push({
    question: `When is ${d.name} the better choice?`,
    answer: `${competitorStrengths(d).length > 0 ? list(competitorStrengths(d).map((s) => `${s.label.toLowerCase()}: ${s.value}`)) + ". " : ""}If those points matter most to you, ${d.name} may suit you better. ${fill(d.chooseCompetitor, d)}`,
  });
  faqs.push({
    question: `Which DronaHost plan is closest to ${d.name} ${d.plan.name}?`,
    answer: `We compare it with ${planLabel(d.dronahostPlanId)}, our entry plan in that group.${d.productNote ? ` ${d.productNote}` : ""} See the plan page for its current limits before you decide. The table above uses only what each company states publicly, so a row is left out when we cannot show a verified DronaHost figure for it.`,
  });
  faqs.push({
    question: "How was this comparison made?",
    answer: `Every ${d.name} fact comes from the pages listed under Sources, read on ${formatReviewDate(d.reviewedOn)} as shown to a visitor in the United States, in US dollars. A fact the page does not state is shown as not stated. DronaHost figures come from our own plan data. Prices and terms change, so check the source yourself before you buy.`,
  });
  faqs.push({
    question: "How do I reach DronaHost before I decide?",
    answer: "Open a support ticket from the contact page, or write to the team by email. We reply by email with next steps. We do not offer phone or chat support, so there is no waiting on a line, and you keep a written record of every answer we give you.",
  });
  return faqs;
}
