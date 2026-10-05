import pricing from "@/data/pricing.json";
import { FEATURES } from "@/lib/flags";

export type CurrencyCode = keyof typeof pricing.currencies;
export type BillingCycle = "monthly" | "annual";

/** USD only until FEATURES.currencySelector is enabled. */
export const DEFAULT_CURRENCY: CurrencyCode = "USD";

export const activeCurrency = (requested?: CurrencyCode): CurrencyCode =>
  FEATURES.currencySelector && requested ? requested : DEFAULT_CURRENCY;

/** Formats an amount with symbol and locale rules via Intl. Never hand-build price strings. */
export function formatPrice(amount: number, currency: CurrencyCode = DEFAULT_CURRENCY): string {
  const { locale } = pricing.currencies[currency];
  const whole = Number.isInteger(amount);
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function getPlan(id: string) {
  return pricing.plans.find((p) => p.id === id);
}

/** Lowest published price across plans, for meta descriptions. Null when nothing is priced. */
export function startingPrice(cycle: BillingCycle = "annual", currency: CurrencyCode = DEFAULT_CURRENCY) {
  const amounts = pricing.plans
    .map((p) => p.pricing[cycle][currency])
    .filter((v): v is number => typeof v === "number");
  return amounts.length ? Math.min(...amounts) : null;
}

/** "$9.99/mo" built from data/pricing.json; empty string when no price is published. */
export function startingPriceLabel(cycle: BillingCycle = "annual"): string {
  const amount = startingPrice(cycle);
  return amount === null ? "" : `${formatPrice(amount)}/mo`;
}
