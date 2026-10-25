import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";
import { isVerified } from "@/content/claims";
import { UI } from "@/content/strings";
import { showPrices } from "@/lib/flags";
import { moneyBackGuarantee } from "@/lib/pricing/guarantee";
import { buildFamilyCards, HIGH_TRAFFIC, PLAN_FAMILIES, VAT_DISPLAY } from "@/lib/pricing/plans";
import PricingExtras from "./PricingExtras";
import PricingPlans from "./PricingPlans";

type HostingPricingProps = {
  /** The section id, so a link such as #plans scrolls to it. */
  anchorId?: string;
  eyebrow?: string;
  /** Defaults to the lineup's label in data/pricing.json. */
  title?: string;
  /** Defaults to the lineup's description in data/pricing.json. */
  description?: string;
  /** The included list, add-ons and full comparison under the cards. On by default. */
  extras?: boolean;
  /** The folded "Compare all features" table inside the extras. Turn off where the page shows the full comparison itself. */
  compare?: boolean;
  /** The contact-only tier for high-traffic and dedicated sites. On by default. */
  highTraffic?: boolean;
  /** Page content under the block, e.g. a link to /pricing. */
  children?: ReactNode;
  headingLevel?: "h2" | "h3";
  className?: string;
};

/** The contact-only tier as one wide card under the plans: no price, no resource numbers (pricing.json `highTraffic`). */
function HighTrafficCard({ headingLevel }: { headingLevel: "h3" | "h4" }) {
  const Heading = headingLevel;
  return (
    <div className="surface mt-5 flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
      <div className="max-w-2xl">
        <p className="text-[0.6875rem] font-semibold uppercase tracking-wider text-link">{UI.pricing.highTrafficEyebrow}</p>
        <Heading className="t-h4 mt-2 text-foreground">{HIGH_TRAFFIC.name}</Heading>
        <p className="t-small mt-2 text-muted-foreground">{HIGH_TRAFFIC.description}</p>
      </div>
      <Button href={HIGH_TRAFFIC.ctaHref} variant="secondary" className="shrink-0" trailingIcon={<ArrowRight className="size-4" aria-hidden="true" />}>
        {HIGH_TRAFFIC.ctaLabel}
      </Button>
    </div>
  );
}

/**
 * The one pricing block for every page that sells hosting (decision 73). Plans, prices, renewal prices, limits, add-ons and
 * the contact tier all come from data/pricing.json through lib/pricing; a page may change only the heading text and whether
 * the extras show. There is no per-product pricing: /pricing, /wordpress-hosting, /business-hosting and every other
 * commercial page show the same plans at the same prices.
 */
export default function HostingPricing({
  anchorId = "plans",
  eyebrow,
  title,
  description,
  extras = true,
  compare = true,
  highTraffic = true,
  children,
  headingLevel = "h2",
  className,
}: HostingPricingProps) {
  const lineup = PLAN_FAMILIES[0];
  const plans = lineup ? buildFamilyCards(lineup.id) : [];
  const prices = showPrices();
  return (
    <PricingPlans
      anchorId={anchorId}
      eyebrow={eyebrow}
      title={title ?? lineup?.label}
      description={description ?? lineup?.description}
      plans={plans}
      showPrices={prices}
      vatDisplay={VAT_DISPLAY}
      // The note stays on each card; the refund policy link lives in the footer, bottom right.
      guaranteeNote={moneyBackGuarantee().guaranteeNote}
      renewalPromise={isVerified("renewal-price-same")}
      headingLevel={headingLevel}
      className={className}
    >
      {highTraffic && <HighTrafficCard headingLevel={headingLevel === "h2" ? "h3" : "h4"} />}
      {extras && <PricingExtras showPrices={prices} compare={compare} />}
      {children}
    </PricingPlans>
  );
}
