import CenteredHero from "@/components/sections/CenteredHero";
import CTABand from "@/components/sections/CTABand";
import FAQSection from "@/components/sections/FAQSection";
import FeatureGrid from "@/components/sections/FeatureGrid";
import JsonLd from "@/components/sections/JsonLd";
import SplitHero from "@/components/sections/SplitHero";
import { HOME_CTA } from "@/content/home";
import type { ServiceContent } from "@/content/services";
import { SITE_URL } from "@/lib/seo/config";
import { buildBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { breadcrumbSchema, faqPageSchema, serviceSchema } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";

/** Metadata for a service page, built from its content entry. */
export const serviceMetadata = (c: ServiceContent) =>
  buildMetadata({ title: c.metaTitle, description: c.metaDescription, path: `/${c.slug}` });

type ServicePageProps = {
  content: ServiceContent;
  /** split = hero with product mockup · centered = text only. Default "centered". */
  heroVariant?: "split" | "centered";
};

/** Standard service page: hero, feature grid, FAQ and CTA, with Service + FAQPage + breadcrumb JSON-LD. */
export default function ServicePage({ content, heroVariant = "centered" }: ServicePageProps) {
  const Hero = heroVariant === "split" ? SplitHero : CenteredHero;
  return (
    <>
      <JsonLd
        schema={[
          breadcrumbSchema(buildBreadcrumbs(`/${content.slug}`)),
          serviceSchema({ name: content.schemaName, description: content.schemaDescription, url: `${SITE_URL}/${content.slug}` }),
          faqPageSchema(content.faq),
        ]}
      />
      <Hero {...content.hero} />
      <FeatureGrid {...content.features} columns={4} />
      <FAQSection eyebrow="FAQ" title={`Questions about ${content.schemaName.toLowerCase()}`} items={content.faq} />
      <CTABand {...HOME_CTA} />
    </>
  );
}
