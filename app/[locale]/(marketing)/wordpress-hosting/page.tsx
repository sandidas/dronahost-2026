import CTABand from "@/components/sections/CTABand";
import FAQSection from "@/components/sections/FAQSection";
import ProcessTimeline from "@/components/sections/ProcessTimeline";
import FeatureGrid from "@/components/sections/FeatureGrid";
import JsonLd from "@/components/sections/JsonLd";
import PricingExtras from "@/components/sections/PricingExtras";
import PricingPlans from "@/components/sections/PricingPlans";
import SplitHero from "@/components/sections/SplitHero";
import TwoColumn from "@/components/sections/TwoColumn";
import { MigrationVisual, WordPressSettingsVisual } from "@/components/sections/visuals/split";
import { isVerified } from "@/content/claims";
import { WORDPRESS_HERO } from "@/content/heroes";
import { MIGRATION_STEPS, WORDPRESS_FAQ } from "@/content/faqs";
import { HOME_CTA, HOME_SPLITS } from "@/content/home";
import { WORDPRESS_FEATURES, WORDPRESS_PRICING } from "@/content/wordpress";
import { showPrices } from "@/lib/flags";
import { startingPriceLabel } from "@/lib/pricing";
import { buildPlanCards, VAT_DISPLAY } from "@/lib/pricing/plans";
import { buildBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { breadcrumbSchema, faqPageSchema, serviceSchema } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return buildMetadata({ locale,
    title: "Managed WordPress Hosting | DronaHost",
    description: `Managed WordPress hosting on LiteSpeed servers, with free migration support and a staging area for safe updates${startingPriceLabel() ? `. Plans from ${startingPriceLabel()}` : ""}.`,
    path: "/wordpress-hosting",
  });
}

const [wpSplit, migrationSplit] = HOME_SPLITS;

export default function WordPressHostingPage() {
  const prices = showPrices();
  return (
    <>
      <JsonLd
        schema={[
          breadcrumbSchema(buildBreadcrumbs("/wordpress-hosting")),
          faqPageSchema(WORDPRESS_FAQ),
          serviceSchema({
            name: "Managed WordPress hosting",
            description: "Managed WordPress hosting on LiteSpeed servers with staging environments and migration support.",
            url: "https://dronahost.com/wordpress-hosting",
          }),
        ]}
      />
      <SplitHero {...WORDPRESS_HERO} />
      <FeatureGrid {...WORDPRESS_FEATURES} columns={3} />
      <TwoColumn
        eyebrow={wpSplit.eyebrow}
        title={wpSplit.title}
        description={wpSplit.description}
        features={wpSplit.features}
        cta={wpSplit.cta}
        visual={<WordPressSettingsVisual />}
      />
      <TwoColumn
        eyebrow={migrationSplit.eyebrow}
        title={migrationSplit.title}
        description={migrationSplit.description}
        features={migrationSplit.features}
        cta={migrationSplit.cta}
        visual={<MigrationVisual />}
        visualPosition="left"
      />
      <ProcessTimeline eyebrow="Migration" title="How moving your site works" steps={MIGRATION_STEPS} />
      <PricingPlans
        {...WORDPRESS_PRICING}
        plans={buildPlanCards()}
        showPrices={prices}
        vatDisplay={VAT_DISPLAY}
        guaranteeNote={isVerified("money-back") ? "30-day money-back guarantee." : null}
      >
        <PricingExtras showPrices={prices} />
      </PricingPlans>
      <FAQSection eyebrow="WordPress hosting" title="Questions about WordPress hosting" items={WORDPRESS_FAQ} />
      <CTABand {...HOME_CTA} />
    </>
  );
}
