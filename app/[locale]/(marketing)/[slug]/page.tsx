import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import CenteredHero from "@/components/sections/CenteredHero";
import JsonLd from "@/components/sections/JsonLd";
import { getPublishedPage, listPublishedPageSlugs } from "@/lib/builder/pages";
import { renderBuilderDoc } from "@/lib/builder/render";
import { builderFaqSchema, builderMetadata } from "@/lib/builder/seo-metadata";
import { buildBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { breadcrumbSchema } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";
// Article typography for text blocks and the builder bands (the editor canvas loads the same file).
import "@/app/styles/rich-content.css";

/**
 * Pages made in the page builder (/dashboard/posts, kind "page"). Every hand-built route wins over this one, and the
 * editor refuses slugs those routes use (lib/builder/reserved.ts). Publishing refreshes this route straight away.
 */
export const revalidate = 3600;

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  try {
    return (await listPublishedPageSlugs()).map(({ slug }) => ({ slug }));
  } catch {
    // Database unreachable at build time: pages are generated on the first visit.
    return [];
  }
}

type Params = { params: Promise<{ slug: string; locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug, locale } = await params;
  const page = await getPublishedPage(slug).catch(() => null);
  if (!page) return buildMetadata({ locale, title: "Page not found", description: "The page you are looking for could not be found.", path: `/${slug}`, noIndex: true });
  return builderMetadata({ seo: page.seo, title: page.title, excerpt: page.excerpt, coverImage: page.coverImage, path: `/${slug}`, locale, type: "website" });
}

export default async function BuilderPage({ params }: Params) {
  const { slug, locale } = await params;
  setRequestLocale(locale);
  const page = await getPublishedPage(slug);
  if (!page) notFound();
  const { body, hasHero } = renderBuilderDoc(page.content, "page");
  const faq = builderFaqSchema(page.content, page.seo);
  return (
    <>
      <JsonLd schema={[breadcrumbSchema(buildBreadcrumbs(`/${page.slug}`, { [page.slug]: page.title })), ...(faq ? [faq] : [])]} />
      {/* The page keeps exactly one H1: the hero's when the page starts with one, otherwise the page title. */}
      {!hasHero && <CenteredHero title={page.title} description={page.excerpt} />}
      {body}
    </>
  );
}
