import { FEATURES } from "@/lib/flags";

/**
 * Locale registry. URL segments are lowercase (/en-gb/pricing); `tag` is the BCP 47 tag used for
 * <html lang>, hreflang, Intl formatting and Open Graph. English is the default and has no prefix,
 * so every existing URL (/pricing) is unchanged.
 *
 * Phase 1 (this file): English variants. Arabic (ar-ae, rtl) and EU languages come in phase 2:
 * add the entry, a messages file and translated content, then list it in LIVE_LOCALES.
 */
export const LOCALES = {
  "en-us": { tag: "en-US", ogLocale: "en_US", label: "English (United States)", short: "US", dir: "ltr" },
  "en-gb": { tag: "en-GB", ogLocale: "en_GB", label: "English (United Kingdom)", short: "UK", dir: "ltr" },
  "en-ae": { tag: "en-AE", ogLocale: "en_AE", label: "English (United Arab Emirates)", short: "UAE", dir: "ltr" },
} as const;

export type Locale = keyof typeof LOCALES;
export const ALL_LOCALES = Object.keys(LOCALES) as Locale[];
export const DEFAULT_LOCALE: Locale = "en-us";

/**
 * Locales that are publicly reachable, listed in the sitemap and linked with hreflang.
 * The variants stay off (404) until FEATURES.localeVariants is true, because en-GB and en-AE pages
 * would otherwise duplicate en-US word for word. Turn them on once their content, currency and
 * regional claims are confirmed.
 */
export const LIVE_LOCALES: readonly Locale[] = FEATURES.localeVariants ? ALL_LOCALES : [DEFAULT_LOCALE];

export const isLocale = (v: string): v is Locale => v in LOCALES;
export const isLive = (v: string): v is Locale => isLocale(v) && LIVE_LOCALES.includes(v);

/** Path with the locale prefix applied: "/pricing" -> "/pricing" (default) or "/en-gb/pricing". */
export function localePath(path: string, locale: Locale = DEFAULT_LOCALE): string {
  const clean = path === "/" ? "" : path.replace(/\/$/, "");
  return locale === DEFAULT_LOCALE ? clean || "/" : `/${locale}${clean}`;
}
