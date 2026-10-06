import CenteredHero from "@/components/sections/CenteredHero";
import CTABand from "@/components/sections/CTABand";
import FeatureGrid from "@/components/sections/FeatureGrid";
import JsonLd from "@/components/sections/JsonLd";
import ProcessTimeline from "@/components/sections/ProcessTimeline";
import TrustSignals from "@/components/sections/TrustSignals";
import { ABOUT_HERO } from "@/content/heroes";
import { HOME_CTA } from "@/content/home";
import { ABOUT_HOW_WE_WORK, ABOUT_WHAT_WE_DO } from "@/content/pages";
import { buildBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { breadcrumbSchema, organizationSchema } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return buildMetadata({ locale,
    title: "About DronaHost: Hosting and Web Team",
    description:
      "DronaHost is a hosting and web team based in India, working with businesses in the United States, United Kingdom, United Arab Emirates and Europe.",
    path: "/about",
  });
}

export default function AboutPage() {
  return (
    <>
      <JsonLd schema={[breadcrumbSchema(buildBreadcrumbs("/about")), organizationSchema()]} />
      <CenteredHero {...ABOUT_HERO} />
      <FeatureGrid {...ABOUT_WHAT_WE_DO} columns={4} />
      <ProcessTimeline {...ABOUT_HOW_WE_WORK} />
      <TrustSignals eyebrow="Transparency" title="What you can check for yourself" />
      <CTABand {...HOME_CTA} />
    </>
  );
}
