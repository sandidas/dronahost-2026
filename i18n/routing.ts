import { defineRouting } from "next-intl/routing";
import { ALL_LOCALES, DEFAULT_LOCALE } from "@/lib/i18n/config";

/**
 * No Accept-Language redirect and no locale cookie: visitors stay on the URL they asked for
 * (better for SEO, and no extra cookie to disclose). Switching language is an explicit link.
 */
export const routing = defineRouting({
  locales: ALL_LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: "as-needed",
  localeDetection: false,
  localeCookie: false,
  alternateLinks: false,
});
