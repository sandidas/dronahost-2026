import pricing from "@/data/pricing.json";
import { readConsent } from "@/lib/consent";
import { DEFAULT_CURRENCY, ENABLED_CURRENCIES, type CurrencyCode } from "@/lib/pricing";
import { detectCurrency } from "@/lib/pricing/detect";

export const CURRENCY_COOKIE = "dh_currency";
export const CURRENCY_EVENT = "dh-currency-change";

export const CURRENCY_OPTIONS = (Object.keys(pricing.currencies) as CurrencyCode[]).map((code) => ({
  code,
  symbol: pricing.currencies[code].symbol,
  name: pricing.currencies[code].name,
}));

export const isCurrency = (value: string | null | undefined): value is CurrencyCode =>
  !!value && value in pricing.currencies;

/** The choice made on this page view; used when preference cookies are not allowed, so the switch still works until reload. */
let sessionCurrency: CurrencyCode | null = null;
/** The best guess from the visitor's location and browser (lib/pricing/detect.ts). Never stored. */
let detected: CurrencyCode | null = null;
let detecting = false;

const announce = () => window.dispatchEvent(new Event(CURRENCY_EVENT));

/** The visitor's own pick: this page view's choice, else the saved cookie. Null when they have not chosen. */
function explicitCurrency(): CurrencyCode | null {
  if (sessionCurrency) return sessionCurrency;
  const match = document.cookie.match(new RegExp(`(?:^|; )${CURRENCY_COOKIE}=([A-Z]{3})`));
  return isCurrency(match?.[1]) ? match[1] : null;
}

/**
 * Works out the likely currency once per page load, in the browser: first from the page locale, time zone and languages
 * (instant), then from the IP country that /api/geo reads from Cloudflare's CF-IPCountry header. Skipped when the visitor
 * has already chosen. Nothing is stored.
 */
function ensureDetected() {
  if (detecting || explicitCurrency()) return;
  detecting = true;
  const signals = {
    pageLocale: document.documentElement.lang,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    languages: navigator.languages?.length ? navigator.languages : [navigator.language],
  };
  const first = detectCurrency(signals).currency;
  if (isCurrency(first) && first !== detected) {
    detected = first;
    announce();
  }
  fetch("/api/geo", { cache: "no-store" })
    .then((r) => (r.ok ? r.json() : null))
    .then((geo: { country?: string | null } | null) => {
      if (!geo?.country) return;
      const next = detectCurrency({ ...signals, ipCountry: geo.country }).currency;
      if (isCurrency(next) && next !== detected) {
        detected = next;
        announce();
      }
    })
    .catch(() => {});
}

/** Subscribes a component to currency changes and starts detection (client only, after hydration, so the HTML matches). */
export function subscribeCurrency(notify: () => void) {
  window.addEventListener(CURRENCY_EVENT, notify);
  queueMicrotask(ensureDetected);
  return () => window.removeEventListener(CURRENCY_EVENT, notify);
}

/** The visitor's currency (client only): their own choice, else the detected one, else USD. Only currencies offered on the site. */
export function readCurrencyCookie(): CurrencyCode {
  const chosen = explicitCurrency() ?? detected ?? DEFAULT_CURRENCY;
  return ENABLED_CURRENCIES.includes(chosen) ? chosen : DEFAULT_CURRENCY;
}

export function writeCurrencyCookie(code: CurrencyCode) {
  sessionCurrency = code;
  // A preference cookie: set only when the visitor allowed preference cookies.
  if (!readConsent()?.preferences) {
    announce();
    return;
  }
  document.cookie = `${CURRENCY_COOKIE}=${code}; path=/; max-age=31536000; samesite=lax`;
  announce();
}
