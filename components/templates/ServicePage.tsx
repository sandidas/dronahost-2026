import CenteredHero from "@/components/sections/CenteredHero";
import CTABand from "@/components/sections/CTABand";
import FAQSection from "@/components/sections/FAQSection";
import FeatureGrid from "@/components/sections/FeatureGrid";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import JsonLd from "@/components/sections/JsonLd";
import SplitHero from "@/components/sections/SplitHero";
import { HOME_CTA } from "@/content/home";
import type { ServiceContent } from "@/content/services";
import { SITE_URL } from "@/lib/seo/config";
import { buildBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { breadcrumbSchema, faqPageSchema, serviceSchema } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";

/** Lowercases the first letter for mid-sentence use, but keeps acronyms such as "VPS" intact. */
const sentenceCase = (s: string): string => (/^[A-Z][a-z]/.test(s) ? s.charAt(0).toLowerCase() + s.slice(1) : s);

/** Metadata for a service page, built from its content entry. */
export const serviceMetadata = (c: ServiceContent, locale?: string) =>
  buildMetadata({ title: c.metaTitle, description: c.metaDescription, path: `/${c.slug}`, locale });

type ServicePageProps = {
  content: ServiceContent;
  /** split = hero with product mockup · centered = text only. Default "centered". */
  heroVariant?: "split" | "centered";
  /** Extra content between the hero and the features, e.g. the domain search. */
  afterHero?: React.ReactNode;
};

/** Standard service page: hero, feature grid, FAQ and CTA, with Service + FAQPage + breadcrumb JSON-LD. */
export default function ServicePage({ content, heroVariant = "centered", afterHero }: ServicePageProps) {
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
      <div className="container-site pt-6">
        <Breadcrumbs path={`/${content.slug}`} />
      </div>
      <Hero {...content.hero} />
      {afterHero}
      <FeatureGrid {...content.features} columns={4} />
      <FAQSection eyebrow="FAQ" title={`Questions about ${sentenceCase(content.schemaName)}`} items={content.faq} />
      <CTABand {...HOME_CTA} />
    </>
  );
}
