import type { Metadata } from "next";
import { isSafeImageSrc } from "@/lib/editor/urls";
import { fillTemplate } from "@/lib/content/refs";
import { faqPageSchema } from "@/lib/seo/jsonld";
import { SITE_URL } from "@/lib/seo/config";
import { buildMetadata } from "@/lib/seo/metadata";
import type { BuilderDoc } from "./model";
import { faqEntries, type PostSeo } from "./seo";

type Input = {
  seo: PostSeo;
  /** The post or page title and summary: the defaults for every empty SEO field. */
  title: string;
  excerpt: string;
  coverImage: string;
  path: string;
  locale: string;
  type: "website" | "article";
};

/** Page metadata with the SEO tab's settings applied: search title and description, canonical, robots and share card. */
export function builderMetadata({ seo, title, excerpt, coverImage, path, locale, type }: Input): Metadata {
  const searchTitle = seo.title || title;
  const description = seo.description || excerpt || title;
  const image = isSafeImageSrc(seo.ogImage) ? seo.ogImage : isSafeImageSrc(coverImage) ? coverImage : undefined;
  const absoluteImage = image?.startsWith("/") ? `${SITE_URL}${image}` : image;
  // noindex keeps "follow": a hidden page still lets search engines follow its links to the rest of the site.
  const base = buildMetadata({ locale, title: searchTitle, description, path, ogImage: absoluteImage, noIndex: seo.noindex, noFollow: false, type });
  const canonical = seo.canonical ? (seo.canonical.startsWith("/") ? `${SITE_URL}${seo.canonical}` : seo.canonical) : undefined;
  const shareTitle = seo.ogTitle || searchTitle;
  const shareDescription = seo.ogDescription || description;
  return {
    ...base,
    alternates: canonical ? { ...base.alternates, canonical } : base.alternates,
    openGraph: { ...base.openGraph, title: shareTitle, description: shareDescription },
    twitter: { ...base.twitter, title: shareTitle, description: shareDescription },
  };
}

/** FAQPage structured data from the FAQ blocks, when the SEO tab leaves it on and the page has questions. */
export function builderFaqSchema(doc: BuilderDoc, seo: PostSeo) {
  // Answers can hold {{pricing.summary}}; the page shows them filled in, so the structured data does too.
  const faqs = seo.faqSchema ? faqEntries(doc).map((f) => ({ ...f, answer: fillTemplate(f.answer).trim() })) : [];
  return faqs.length ? faqPageSchema(faqs) : null;
}
