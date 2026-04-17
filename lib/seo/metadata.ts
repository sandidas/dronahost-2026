import type { Metadata } from "next";
import { SITE_URL, SITE_NAME } from "./config";

type BuildMetadataInput = {
  title: string;         // 50-60 chars, already formatted
  description: string;   // 140-160 chars
  path: string;          // e.g. "/wordpress-hosting"
  ogImage?: string;      // absolute URL, defaults to /images/og/default.jpg
  noIndex?: boolean;
  noFollow?: boolean;
  type?: "website" | "article";
  hreflang?: Record<string, string>;
};

export function buildMetadata(input: BuildMetadataInput): Metadata {
  const normalizedPath = input.path.endsWith("/") && input.path !== "/"
    ? input.path.slice(0, -1)
    : input.path;
  const canonicalUrl = `${SITE_URL}${normalizedPath}`;
  const ogImage = input.ogImage ?? `${SITE_URL}/images/og/default.jpg`;
  const noIndex = input.noIndex ?? false;
  const noFollow = input.noFollow ?? noIndex;

  return {
    title: input.title,
    description: input.description,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: canonicalUrl,
      ...(input.hreflang ? { languages: input.hreflang } : {}),
    },
    openGraph: {
      title: input.title,
      description: input.description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: "en_US",
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
