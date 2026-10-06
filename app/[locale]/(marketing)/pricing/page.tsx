import CTABand from "@/components/sections/CTABand";
import FAQSection from "@/components/sections/FAQSection";
import CenteredHero from "@/components/sections/CenteredHero";
import JsonLd from "@/components/sections/JsonLd";
import PricingExtras from "@/components/sections/PricingExtras";
import PricingPlans from "@/components/sections/PricingPlans";
import { isVerified } from "@/content/claims";
import { PRICING_FAQ } from "@/content/faqs";
import { PRICING_HERO } from "@/content/heroes";
import { HOME_CTA } from "@/content/home";
import { showPrices } from "@/lib/flags";
import { startingPriceLabel } from "@/lib/pricing";
import { buildPlanCards, VAT_DISPLAY } from "@/lib/pricing/plans";
import { breadcrumbSchema, faqPageSchema, hostingPlansSchema } from "@/lib/seo/jsonld";
import { buildBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { buildMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return buildMetadata({ locale,
    title: "Pricing: Managed WordPress and Cloud Hosting Plans | DronaHost",
    description: `Compare DronaHost managed hosting plans, with the renewal price shown beside the signup price${startingPriceLabel() ? `. Plans from ${startingPriceLabel()}` : ""}.`,
    path: "/pricing",
  });
}

export default function PricingPage() {
  const plans = buildPlanCards();
  const prices = showPrices();
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
      <PricingPlans
        title="Choose your plan"
        description="Every plan is managed. Compare resources below, or open the full feature table."
        plans={plans}
        showPrices={prices}
        vatDisplay={VAT_DISPLAY}
        guaranteeNote={isVerified("money-back") ? "30-day money-back guarantee." : null}
        renewalPromise={isVerified("renewal-price-same")}
      >
        <PricingExtras showPrices={prices} />
      </PricingPlans>
      <FAQSection eyebrow="Billing" title="Pricing questions" items={PRICING_FAQ} />
      <CTABand {...HOME_CTA} title="Not sure which plan fits?" />
    </>
  );
}
