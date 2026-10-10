import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CenteredHero from "@/components/sections/CenteredHero";
import CTABand from "@/components/sections/CTABand";
import FAQSection from "@/components/sections/FAQSection";
import FeatureGrid from "@/components/sections/FeatureGrid";
import JsonLd from "@/components/sections/JsonLd";
import { HOME_CTA } from "@/content/home";
import { REGION_FAQ } from "@/content/services";
import { REGION_KEYS as REGIONS, REGIONS_META, type RegionKey } from "@/content/regions";
import { buildBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { SITE_URL } from "@/lib/seo/config";
import { breadcrumbSchema, faqPageSchema } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";

const isRegion = (v: string): v is RegionKey => (REGIONS as readonly string[]).includes(v);

export function generateStaticParams(): { region: string }[] {
  return REGIONS.map((region) => ({ region }));
}

/** Every regional page lists its siblings so search engines can pair language/region variants. */
const hreflang = Object.fromEntries(REGIONS.map((r) => [REGIONS_META[r].hreflang, `${SITE_URL}/hosting/${r}`]));

export async function generateMetadata({ params }: { params: Promise<{ region: string; locale: string }> }): Promise<Metadata> {
  const { region, locale } = await params;
  if (!isRegion(region)) return buildMetadata({ locale, title: "Hosting", description: "Managed hosting.", path: `/hosting/${region}`, noIndex: true });
  const label = REGIONS_META[region].label;
  return buildMetadata({
    locale,
    title: `Web Hosting for ${label} Businesses`,
    description: `WordPress and business hosting for ${label} businesses, with help from the DronaHost team choosing the plan that fits your site and visitors.`,
    path: `/hosting/${region}`,
    hreflang,
    // Blocked in the page map: noindex until the owner (Tier A) or a qualified reviewer (Tier B) approves
    noIndex: true,
  });
}

export default async function RegionPage({ params }: { params: Promise<{ region: string }> }) {
  const { region } = await params;
  if (!isRegion(region)) notFound();
  const meta = REGIONS_META[region];
  const regimes = meta.complianceLabel;
  const faq = REGION_FAQ(meta.label, regimes);

  return (
    <>
      <JsonLd schema={[breadcrumbSchema(buildBreadcrumbs(`/hosting/${region}`)), faqPageSchema(faq)]} />
      <CenteredHero
        eyebrow={`Hosting for ${meta.label}`}
        title="Web hosting for"
        titleAccent={`${meta.label} businesses`}
        description={`Hosting and support for businesses serving ${meta.label} visitors. The team will help you choose a plan.`}
        primaryCta={{ label: "Talk to our team", href: "/contact" }}
        secondaryCta={{ label: "See hosting plans", href: "/pricing" }}
      />
      <FeatureGrid
        eyebrow="Before you launch"
        title="Three things to decide before you launch"
        description={`Hosting for ${meta.label} businesses comes down to the right plan, your data duties and support.`}
        columns={3}
        items={[
          { icon: "gauge", title: "A plan that fits your site", description: "Tell us about your site and your visitors and we will suggest a plan that fits." },
          { icon: "shield-check", title: "Data and compliance", description: `Businesses serving ${meta.label} visitors often need to consider ${regimes}. Our privacy and data processing pages explain how we handle personal data.`, },
          { icon: "life-buoy", title: "Help before you buy", description: "Ask the team a question by support ticket before you choose a plan." },
        ]}
      />
      <FAQSection eyebrow="Regions" title={`Hosting for ${meta.label}: common questions`} items={faq} />
      <CTABand {...HOME_CTA} />
    </>
  );
}
