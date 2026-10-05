import CenteredHero from "@/components/sections/CenteredHero";
import JsonLd from "@/components/sections/JsonLd";
import PricingExtras from "@/components/sections/PricingExtras";
import PricingPlans from "@/components/sections/PricingPlans";
import { isVerified } from "@/content/claims";
import { PRICING_HERO } from "@/content/heroes";
import { showPrices } from "@/lib/flags";
import { startingPriceLabel } from "@/lib/pricing";
import { buildPlanCards, VAT_DISPLAY } from "@/lib/pricing/plans";
import { breadcrumbSchema, hostingPlansSchema } from "@/lib/seo/jsonld";
import { buildBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Pricing: Managed WordPress and Cloud Hosting Plans | DronaHost",
  description: `Compare DronaHost managed hosting plans, with the renewal price shown beside the signup price${startingPriceLabel() ? `. Plans from ${startingPriceLabel()}` : ""}.`,
  path: "/pricing",
});

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
      <JsonLd schema={[breadcrumbSchema(buildBreadcrumbs("/pricing")), ...(schema ? [schema] : [])]} />
      <CenteredHero {...PRICING_HERO} />
      <PricingPlans
        title="Choose your plan"
        description="Every plan is managed. Compare resources below, or open the full feature table."
        plans={plans}
        showPrices={prices}
        vatDisplay={VAT_DISPLAY}
        guaranteeNote={isVerified("money-back") ? "30-day money-back guarantee." : null}
      >
        <PricingExtras showPrices={prices} />
      </PricingPlans>
    </>
  );
}
