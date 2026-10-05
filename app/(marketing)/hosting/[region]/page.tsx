import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CenteredHero from "@/components/sections/CenteredHero";
import CTABand from "@/components/sections/CTABand";
import FAQSection from "@/components/sections/FAQSection";
import FeatureGrid from "@/components/sections/FeatureGrid";
import JsonLd from "@/components/sections/JsonLd";
import { HOME_CTA } from "@/content/home";
import { REGION_FAQ } from "@/content/services";
import pricing from "@/data/pricing.json";
import { buildBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { SITE_URL } from "@/lib/seo/config";
import { breadcrumbSchema, faqPageSchema } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";

type RegionKey = "us" | "uk" | "eu" | "uae";
const REGIONS: RegionKey[] = ["us", "uk", "eu", "uae"];
const isRegion = (v: string): v is RegionKey => (REGIONS as string[]).includes(v);

export function generateStaticParams(): { region: string }[] {
  return REGIONS.map((region) => ({ region }));
}

/** Every regional page lists its siblings so search engines can pair language/region variants. */
const hreflang = Object.fromEntries(REGIONS.map((r) => [pricing.regions[r].hreflang, `${SITE_URL}/hosting/${r}`]));

export async function generateMetadata({ params }: { params: Promise<{ region: string }> }): Promise<Metadata> {
  const { region } = await params;
  if (!isRegion(region)) return buildMetadata({ title: "Hosting | DronaHost", description: "Managed hosting.", path: `/hosting/${region}`, noIndex: true });
  const label = pricing.regions[region].label;
  return buildMetadata({
    title: `Web Hosting for ${label} Businesses | DronaHost`,
    description: `Managed WordPress and cloud hosting for businesses serving ${label} visitors, with help choosing the right region from the DronaHost team.`,
    path: `/hosting/${region}`,
    hreflang,
  });
}

export default async function RegionPage({ params }: { params: Promise<{ region: string }> }) {
  const { region } = await params;
  if (!isRegion(region)) notFound();
  const meta = pricing.regions[region];
  const faq = REGION_FAQ(meta.label);
  const regimes = meta.compliance.join(", ").replace(/-/g, " ");

  return (
    <>
      <JsonLd schema={[breadcrumbSchema(buildBreadcrumbs(`/hosting/${region}`)), faqPageSchema(faq)]} />
      <CenteredHero
        eyebrow={`Hosting for ${meta.label}`}
        title="Managed hosting for"
        titleAccent={`${meta.label} audiences`}
        description={`Choose where your site is hosted so it suits your visitors and your obligations. The team will help you decide.`}
        primaryCta={{ label: "Talk to our team", href: "/contact" }}
        secondaryCta={{ label: "View plans", href: "/pricing" }}
      />
      <FeatureGrid
        eyebrow="Why location matters"
        title="Three things to decide before you launch"
        description={`Hosting for ${meta.label} visitors comes down to speed, data and support.`}
        columns={3}
        items={[
          { icon: "gauge", title: "Speed for your visitors", description: "Servers nearer your audience respond faster, which helps both people and search engines." },
          { icon: "shield-check", title: "Data and compliance", description: `Businesses serving ${meta.label} visitors often need to consider ${regimes}. Our privacy and data processing pages explain how we handle personal data.`, },
          { icon: "life-buoy", title: "Help choosing", description: "Tell us about your audience and site and we will recommend a region, or say so if it does not matter." },
        ]}
      />
      <FAQSection eyebrow="Regions" title={`Hosting for ${meta.label}: common questions`} items={faq} />
      <CTABand {...HOME_CTA} />
    </>
  );
}
