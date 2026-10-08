/**
 * Pricing adapter for this project: reads prices through the app's own typed loader (lib/pricing), never from the JSON file, and
 * never copies the pricing schema. The engine calls `prices()` and only needs the formatted amounts the site would show.
 * Registered in content-planner.config.json: adapters.pricing = "module", paths.pricingModule.
 */
import { CURRENCY_OPTIONS } from "../../../../lib/pricing/currency";
import { buildPlanCards } from "../../../../lib/pricing/plans";

/** Every price string the site can show: signup, annual, annual total and renewal, for every plan in every currency. */
export function prices(): string[] {
  const out: string[] = [];
  for (const currency of CURRENCY_OPTIONS) {
    for (const card of buildPlanCards(currency.code as Parameters<typeof buildPlanCards>[0])) {
      for (const value of [card.monthly, card.annual, card.annualTotal, card.renewal]) if (value) out.push(value);
    }
  }
  return out;
}
