/**
 * Checks data/vs/*.ts against the comparison rules (content-engine/plans/02-commercial-investigation.md).
 * Errors: a fact without an https source or a valid date, fewer than two strengths, a strength with no value, a token that
 * cannot be filled, an unknown DronaHost plan, and FEATURES.comparisonPages on while any competitor is not checked at source.
 * Warnings: facts not checked yet. Usage: npx tsx scripts/check-vs.ts
 */
import pricing from "../data/pricing.json";
import bluehost from "../data/vs/bluehost";
import cloudways from "../data/vs/cloudways";
import hostinger from "../data/vs/hostinger";
import kinsta from "../data/vs/kinsta";
import siteground from "../data/vs/siteground";
import type { CompetitorData, FactKey, Source } from "../data/vs/types";
import wpEngine from "../data/vs/wp-engine";
import { FEATURES } from "../lib/flags";
import { FACT_ORDER, comparisonFaq, comparisonRows, fill } from "../lib/vs/compare";

const ALL: CompetitorData[] = [siteground, kinsta, wpEngine, bluehost, hostinger, cloudways];
const DATE = /^\d{4}-\d{2}-\d{2}$/;
let errors = 0;
const err = (slug: string, msg: string) => {
  errors++;
  console.log(`  error ${slug}: ${msg}`);
};
const okSource = (s: Source) => /^https:\/\/[^\s]+$/.test(s.url) && DATE.test(s.retrieved);

for (const d of ALL) {
  if (!okSource(d.plan.source)) err(d.slug, "plan source needs an https URL and a YYYY-MM-DD date");
  if (!DATE.test(d.reviewedOn)) err(d.slug, "reviewedOn must be YYYY-MM-DD");
  if (!pricing.plans.some((p) => p.id === d.dronahostPlanId)) err(d.slug, `unknown DronaHost plan "${d.dronahostPlanId}"`);
  for (const [k, f] of Object.entries(d.facts)) if (!okSource(f.source)) err(d.slug, `fact "${k}" needs an https source URL and a retrieval date`);
  const withValue = d.strengths.filter((k) => d.facts[k]?.value);
  if (d.strengths.length < 2 || withValue.length < 2) err(d.slug, "needs at least two strengths that have a sourced value");
  for (const text of [d.chooseCompetitor]) {
    try {
      fill(text, d);
    } catch (e) {
      err(d.slug, (e as Error).message);
    }
  }
  const faqs = comparisonFaq(d);
  if (faqs.length < 5 || faqs.length > 6) err(d.slug, `FAQ needs 5 or 6 questions, has ${faqs.length}`);
  for (const f of faqs) {
    const words = f.answer.trim().split(/\s+/).length;
    if (words < 40 || words > 80) err(d.slug, `FAQ answer "${f.question}" has ${words} words, needs 40 to 80`);
    // Competitor channels may be named when they are the competitor's sourced facts. DronaHost never claims them.
    if (/\bVAT\b|whats\s?app/i.test(f.answer)) err(d.slug, `FAQ answer "${f.question}" mentions VAT or WhatsApp`)
  }
  const missing = FACT_ORDER.filter((k: FactKey) => !d.facts[k]);
  const rows = comparisonRows(d).length;
  console.log(`${d.slug}: ${Object.keys(d.facts).length} facts, ${rows} table rows today${missing.length ? `, not checked yet: ${missing.join(", ")}` : ""}${d.checkedAtSource ? "" : ", NOT checked at source"}`);
  if (FEATURES.comparisonPages && !d.checkedAtSource) err(d.slug, "FEATURES.comparisonPages is on but the facts are not checked at source");
}
console.log(errors ? `\n${errors} error(s).` : "\nComparison data check passed.");
process.exit(errors ? 1 : 0);
