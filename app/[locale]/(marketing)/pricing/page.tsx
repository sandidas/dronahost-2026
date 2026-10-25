import CTABand from "@/components/sections/CTABand";
import FAQSection from "@/components/sections/FAQSection";
import CenteredHero from "@/components/sections/CenteredHero";
import JsonLd from "@/components/sections/JsonLd";
import ComparisonTable from "@/components/sections/ComparisonTable";
import HostingPricing from "@/components/sections/HostingPricing";
import { PRICING_FAQ } from "@/content/faqs";
import { PRICING_HERO } from "@/content/heroes";
import { PRICING_CTA } from "@/content/home";
import { UI } from "@/content/strings";
import { startingPriceLabel } from "@/lib/pricing";
import { buildPlanComparison } from "@/lib/pricing/compare";
import { buildPlanCards } from "@/lib/pricing/plans";
import { breadcrumbSchema, faqPageSchema, hostingPlansSchema } from "@/lib/seo/jsonld";
import { buildBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { buildMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return buildMetadata({ locale,
    title: "Hosting Plans and Pricing",
    description: `Compare DronaHost hosting plans, with the renewal price shown beside the signup price${startingPriceLabel() ? `. Plans from ${startingPriceLabel()}` : ""}.`,
    path: "/pricing",
  });
}

export default function PricingPage() {
  const plans = buildPlanCards();
  const schema = hostingPlansSchema(
    plans.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      custom: p.custom,
      annualAmount: p.annual ? Number(p.annual.replace(/[^0-9.]/g, "")) : null,
    })),
  );

  return (
    <>
      <JsonLd schema={[breadcrumbSchema(buildBreadcrumbs("/pricing")), faqPageSchema(PRICING_FAQ), ...(schema ? [schema] : [])]} />
      <CenteredHero {...PRICING_HERO} />
      <HostingPricing compare={false} />
      <ComparisonTable
        eyebrow={UI.pricing.compareEyebrow}
        title={UI.pricing.compareTitle}
        description={UI.pricing.compareLine}
        caption={UI.pricing.compareCaption}
        rowHeader={UI.pricing.compareRowHeader}
        {...buildPlanComparison({ linkToCards: true })}
      />
      <FAQSection eyebrow="Billing" title="Pricing questions" items={PRICING_FAQ} />
      <CTABand {...PRICING_CTA} title="Not sure which plan fits?" />
    </>
  );
}
