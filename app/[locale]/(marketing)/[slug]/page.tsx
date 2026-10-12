import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import CenteredHero from "@/components/sections/CenteredHero";
import JsonLd from "@/components/sections/JsonLd";
import { getPublishedPage, listPublishedPageSlugs } from "@/lib/builder/pages";
import { renderBuilderDoc } from "@/lib/builder/render";
import { isSafeImageSrc } from "@/lib/editor/urls";
import { buildBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { breadcrumbSchema } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";

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
  return buildMetadata({ locale, title: page.title, description: page.excerpt || page.title, path: `/${slug}`, ogImage: isSafeImageSrc(page.coverImage) ? page.coverImage : undefined });
}

export default async function BuilderPage({ params }: Params) {
  const { slug, locale } = await params;
  setRequestLocale(locale);
  const page = await getPublishedPage(slug);
  if (!page) notFound();
  const { body, hasHero } = renderBuilderDoc(page.content, "page");
  return (
    <>
      <JsonLd schema={breadcrumbSchema(buildBreadcrumbs(`/${page.slug}`, { [page.slug]: page.title }))} />
      {/* The page keeps exactly one H1: the hero's when the page starts with one, otherwise the page title. */}
      {!hasHero && <CenteredHero title={page.title} description={page.excerpt} />}
      {body}
    </>
  );
}
