import pricing from "@/data/pricing.json";
import { FEATURES, showPrices } from "@/lib/flags";

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

/** A limit with no fixed number under the fair-use policy. Only the plan's `limits.fairUse` list says so; null alone means "not set". */
export type FairUseKey = "sites" | "domains" | "databases" | "bandwidth";

/**
 * True when `key` is listed in the plan's `limits.fairUse`. That list is the only way a limit becomes "Fair use": a null
 * limit that is not listed means the value is not set yet and renders nothing. Never "Unlimited".
 */
export function isFairUse(plan: { limits: { fairUse: readonly string[] } }, key: FairUseKey): boolean {
  return plan.limits.fairUse.includes(key);
}

/** One amount already formatted in every enabled currency, e.g. { USD: "$14.99", GBP: "£11.99" }. Rendered by CurrencyAmount. */
export type Money = Partial<Record<CurrencyCode, string>>;

/** Currencies a visitor can pick: all in pricing.json once FEATURES.currencySelector is on, else USD only. */
export const ENABLED_CURRENCIES: CurrencyCode[] = FEATURES.currencySelector ? (Object.keys(pricing.currencies) as CurrencyCode[]) : [DEFAULT_CURRENCY];

/** Formats a stored per-currency amount block for every enabled currency. `wrap` adds text around each price ("+$10/month"). */
export function formatMoney(amounts: Partial<Record<CurrencyCode, number | null>>, wrap: (price: string) => string = (s) => s): Money | null {
  const out: Money = {};
  for (const c of ENABLED_CURRENCIES) {
    const n = amounts[c];
    if (typeof n === "number") out[c] = wrap(formatPrice(n, c));
  }
  return Object.keys(out).length ? out : null;
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
  if (!showPrices()) return "";
  const amount = startingPrice(cycle);
  return amount === null ? "" : `${formatPrice(amount)}/mo`;
}
