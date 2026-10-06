import pricing from "@/data/pricing.json";
import { readConsent } from "@/lib/consent";
import { DEFAULT_CURRENCY, type CurrencyCode } from "@/lib/pricing";

export const CURRENCY_COOKIE = "dh_currency";
export const CURRENCY_EVENT = "dh-currency-change";

export const CURRENCY_OPTIONS = (Object.keys(pricing.currencies) as CurrencyCode[]).map((code) => ({
  code,
  symbol: pricing.currencies[code].symbol,
  name: pricing.currencies[code].name,
}));

export const isCurrency = (value: string | null | undefined): value is CurrencyCode =>
  !!value && value in pricing.currencies;

/** Reads the visitor's saved currency from the cookie (client only). */
export function readCurrencyCookie(): CurrencyCode {
  const match = document.cookie.match(new RegExp(`(?:^|; )${CURRENCY_COOKIE}=([A-Z]{3})`));
  return isCurrency(match?.[1]) ? match[1] : DEFAULT_CURRENCY;
}

export function writeCurrencyCookie(code: CurrencyCode) {
  // A preference cookie: set only when the visitor allowed preference cookies.
  if (!readConsent()?.preferences) {
    window.dispatchEvent(new Event(CURRENCY_EVENT));
    return;
  }
  document.cookie = `${CURRENCY_COOKIE}=${code}; path=/; max-age=31536000; samesite=lax`;
  window.dispatchEvent(new Event(CURRENCY_EVENT));
}
