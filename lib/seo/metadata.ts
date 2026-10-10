import type { Metadata } from "next";
import { DEFAULT_LOCALE, LIVE_LOCALES, LOCALES, isLocale, localePath, type Locale } from "@/lib/i18n/config";
import { SITE_URL, SITE_NAME } from "./config";
import { isBlocked } from "./indexing";

type BuildMetadataInput = {
  title: string;         // 50-60 chars, already formatted
  description: string;   // 140-160 chars
  path: string;          // e.g. "/wordpress-hosting"
  ogImage?: string;      // absolute URL, defaults to /images/og/default.jpg
  noIndex?: boolean;
  noFollow?: boolean;
  type?: "website" | "article";
  hreflang?: Record<string, string>;
  /** Route locale (from the [locale] param). Sets the canonical, hreflang and og:locale. Default: en-us. */
  locale?: string;
};

/** Prefixes a path (optionally with ?query) for a locale and makes it absolute. */
function localizedUrl(path: string, locale: Locale): string {
  const [pathname = "/", query] = path.split("?");
  return `${SITE_URL}${localePath(pathname, locale)}${query ? `?${query}` : ""}`;
}

export function buildMetadata(input: BuildMetadataInput): Metadata {
  const normalizedPath = input.path.endsWith("/") && input.path !== "/"
    ? input.path.slice(0, -1)
    : input.path;
  const locale: Locale = input.locale && isLocale(input.locale) ? input.locale : DEFAULT_LOCALE;
  const canonicalUrl = localizedUrl(normalizedPath, locale);
  // hreflang only when more than one locale is live; each page links to every live version and x-default.
  const alternates =
    input.hreflang ??
    (LIVE_LOCALES.length > 1
      ? { ...Object.fromEntries(LIVE_LOCALES.map((l) => [LOCALES[l].tag, localizedUrl(normalizedPath, l)])), "x-default": localizedUrl(normalizedPath, DEFAULT_LOCALE) }
      : undefined);
  const ogImage = input.ogImage ?? `${SITE_URL}/images/og/default.jpg`;
  // A page the content engine's page map marks Blocked is noindex (links still followed) until it is Ready.
  const noIndex = input.noIndex ?? isBlocked(normalizedPath);
  const noFollow = input.noFollow ?? input.noIndex ?? false;

  return {
    title: input.title,
    description: input.description,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: canonicalUrl,
      ...(alternates ? { languages: alternates } : {}),
    },
    openGraph: {
      title: input.title,
      description: input.description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: LOCALES[locale].ogLocale,
      type: input.type ?? "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: input.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
      images: [ogImage],
    },
    robots: noIndex
      ? { index: false, follow: noFollow ? false : true }
      : { index: true, follow: true, googleBot: { index: true, follow: true } },
  };
}
