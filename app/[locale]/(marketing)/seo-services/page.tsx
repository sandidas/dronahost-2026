import CenteredHero from "@/components/sections/CenteredHero";
import CTABand from "@/components/sections/CTABand";
import FAQSection from "@/components/sections/FAQSection";
import FeatureGrid from "@/components/sections/FeatureGrid";
import JsonLd from "@/components/sections/JsonLd";
import ProcessTimeline from "@/components/sections/ProcessTimeline";
import { SEO_HERO } from "@/content/heroes";
import { HOME_CTA } from "@/content/home";
import { SEO_CAPABILITIES, SEO_FAQ, SEO_PROCESS } from "@/content/pages";
import { buildBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { breadcrumbSchema, faqPageSchema, serviceSchema } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return buildMetadata({ locale,
    title: "SEO Services on a Monthly Retainer",
    description:
      "Technical SEO, content strategy and link building on a monthly retainer, with plain-language reporting for businesses in the US, UK, UAE and Europe.",
    path: "/seo-services",
  });
}

export default function SeoServicesPage() {
  return (
    <>
      <JsonLd
        schema={[
          breadcrumbSchema(buildBreadcrumbs("/seo-services")),
          serviceSchema({
            name: "SEO services",
            description: "Technical SEO, content strategy and link building on a monthly retainer.",
            url: "https://dronahost.com/seo-services",
          }),
          faqPageSchema(SEO_FAQ),
        ]}
      />
      <CenteredHero {...SEO_HERO} />
      <FeatureGrid {...SEO_CAPABILITIES} columns={3} />
      <ProcessTimeline {...SEO_PROCESS} />
      <FAQSection eyebrow="SEO" title="Questions about SEO services" items={SEO_FAQ} />
      <CTABand {...HOME_CTA} secondaryCta={{ label: "See web design", href: "/wordpress-website-design" }} />
    </>
  );
}
