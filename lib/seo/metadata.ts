import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://dronahost.com";
const SITE_NAME = "DronaHost";

type BuildMetadataInput = {
  title: string;         // 50-60 chars, already formatted
  description: string;   // 140-160 chars
  path: string;          // e.g. "/wordpress-hosting"
  ogImage?: string;      // absolute URL, defaults to /images/og/default.jpg
  noIndex?: boolean;
  type?: "website" | "article";
};

export function buildMetadata(input: BuildMetadataInput): Metadata {
  const canonicalUrl = `${SITE_URL}${input.path}`;
  const ogImage = input.ogImage ?? `${SITE_URL}/images/og/default.jpg`;

  return {
    title: input.title,
    description: input.description,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: canonicalUrl,
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
    robots: input.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true } },
  };
}
