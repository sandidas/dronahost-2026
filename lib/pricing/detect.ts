import type { CurrencyCode } from "@/lib/pricing";

/*
 * Picks the currency a visitor most likely pays in, from signals that need no cookie and no personal data stored: the
 * country Cloudflare sees (CF-IPCountry), the page locale, the browser's time zone and its language list. Pure functions:
 * used by /api/geo on the server and by lib/pricing/currency.ts in the browser. An explicit choice in the selector always
 * wins over anything detected here.
 *
 * Only currencies with stored prices in data/pricing.json can be returned (USD, GBP, EUR, AED, INR). A country whose own
 * currency is not offered gets the nearest one we price in: European countries outside the euro get EUR (the EU market
 * this site serves), everyone else gets USD.
 */

/** Euro area members, plus euro-using microstates and territories. */
const EUROZONE = new Set(["AT", "BE", "HR", "CY", "EE", "FI", "FR", "DE", "GR", "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PT", "SK", "SI", "ES", "AD", "MC", "SM", "VA", "ME", "XK", "GP", "MQ", "GF", "RE", "YT", "PM", "BL", "MF", "AX"]);
/** Other European countries whose currency we do not price in: EUR is the nearest offered. */
const EUROPE_OTHER = new Set(["BG", "CZ", "DK", "HU", "PL", "RO", "SE", "NO", "IS", "LI", "CH", "AL", "BA", "MK", "RS", "MD", "UA"]);
/** Pound sterling: the UK and the Crown Dependencies. */
const STERLING = new Set(["GB", "UK", "IM", "JE", "GG"]);

/** ISO 3166 country code to the offered currency, or null when the code is missing or unknown (XX, T1 = Tor). */
export function currencyForCountry(country: string | null | undefined): CurrencyCode | null {
  const cc = country?.trim().toUpperCase();
  if (!cc || cc.length !== 2 || cc === "XX" || cc === "T1") return null;
  if (STERLING.has(cc)) return "GBP";
  if (cc === "AE") return "AED";
  if (cc === "IN") return "INR";
  if (EUROZONE.has(cc) || EUROPE_OTHER.has(cc)) return "EUR";
  return "USD";
}

/** Time zones that place a browser in a priced country. Anything else gives no answer (the next signal decides). */
const ZONE_COUNTRY: Record<string, string> = {
  "Europe/London": "GB", "Europe/Belfast": "GB", "Europe/Isle_of_Man": "IM", "Europe/Jersey": "JE", "Europe/Guernsey": "GG",
  "Asia/Dubai": "AE",
  "Asia/Kolkata": "IN", "Asia/Calcutta": "IN",
  "Europe/Dublin": "IE", "Europe/Amsterdam": "NL", "Europe/Berlin": "DE", "Europe/Busingen": "DE", "Europe/Paris": "FR", "Europe/Brussels": "BE",
  "Europe/Luxembourg": "LU", "Europe/Vienna": "AT", "Europe/Madrid": "ES", "Atlantic/Canary": "ES", "Africa/Ceuta": "ES", "Europe/Lisbon": "PT",
  "Atlantic/Madeira": "PT", "Atlantic/Azores": "PT", "Europe/Rome": "IT", "Europe/Helsinki": "FI", "Europe/Athens": "GR", "Europe/Tallinn": "EE",
  "Europe/Riga": "LV", "Europe/Vilnius": "LT", "Europe/Bratislava": "SK", "Europe/Ljubljana": "SI", "Europe/Zagreb": "HR", "Europe/Malta": "MT",
  "Asia/Nicosia": "CY", "Europe/Nicosia": "CY", "Europe/Monaco": "MC", "Europe/Andorra": "AD", "Europe/San_Marino": "SM", "Europe/Vatican": "VA",
  "Europe/Podgorica": "ME", "Europe/Mariehamn": "AX",
  "Europe/Warsaw": "PL", "Europe/Prague": "CZ", "Europe/Copenhagen": "DK", "Europe/Budapest": "HU", "Europe/Bucharest": "RO", "Europe/Sofia": "BG",
  "Europe/Stockholm": "SE", "Europe/Oslo": "NO", "Atlantic/Reykjavik": "IS", "Europe/Zurich": "CH", "Europe/Vaduz": "LI",
};

/** The browser's IANA time zone (Intl) to a currency; null when the zone does not point to a priced country. */
export function currencyForTimeZone(zone: string | null | undefined): CurrencyCode | null {
  if (!zone) return null;
  const cc = ZONE_COUNTRY[zone];
  if (cc) return currencyForCountry(cc);
  // Any other zone in the Americas or Asia-Pacific: USD is right for most visitors there.
  return /^(America|Pacific|Australia|Asia)\//.test(zone) ? "USD" : null;
}

/** A language tag's region ("en-GB", "hi-IN", "de-AT") to a currency. Bare languages say little, so only a few are used. */
export function currencyForLanguage(tag: string | null | undefined): CurrencyCode | null {
  if (!tag) return null;
  const [lang, ...rest] = tag.replace("_", "-").split("-");
  const region = rest.find((p) => /^[A-Za-z]{2}$/.test(p));
  if (region) return currencyForCountry(region);
  // A bare tag: only languages spoken almost entirely in one priced area.
  const bare: Record<string, CurrencyCode> = { de: "EUR", fr: "EUR", nl: "EUR", it: "EUR", es: "EUR", pt: "EUR", fi: "EUR", el: "EUR", hi: "INR", bn: "INR", ta: "INR", te: "INR", mr: "INR", gu: "INR", kn: "INR", ml: "INR" };
  return bare[lang?.toLowerCase() ?? ""] ?? null;
}

/** The page locale (`<html lang>`, e.g. "en-GB" on /en-gb). The default English locale says nothing about the visitor. */
export function currencyForPageLocale(lang: string | null | undefined): CurrencyCode | null {
  if (!lang || /^en(-US)?$/i.test(lang)) return null;
  return currencyForLanguage(lang);
}

export type DetectSignals = {
  pageLocale?: string | null;
  /** Country from the visitor's IP (CF-IPCountry via /api/geo). */
  ipCountry?: string | null;
  timeZone?: string | null;
  languages?: readonly string[];
};

export type Detected = { currency: CurrencyCode; source: "page" | "ip" | "timezone" | "language" | "default" };

/**
 * The best guess, strongest signal first: a regional page (/en-gb) the visitor chose to open, the IP country, the time
 * zone, then the first browser language that names a priced region. USD when nothing decides.
 */
export function detectCurrency(s: DetectSignals): Detected {
  const page = currencyForPageLocale(s.pageLocale);
  if (page) return { currency: page, source: "page" };
  const ip = currencyForCountry(s.ipCountry);
  if (ip) return { currency: ip, source: "ip" };
  const zone = currencyForTimeZone(s.timeZone);
  if (zone) return { currency: zone, source: "timezone" };
  for (const tag of s.languages ?? []) {
    const lang = currencyForLanguage(tag);
    if (lang) return { currency: lang, source: "language" };
  }
  return { currency: "USD", source: "default" };
}
