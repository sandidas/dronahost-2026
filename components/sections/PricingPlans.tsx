"use client";

import { Check } from "lucide-react";
import { useId, useState, type ReactNode } from "react";
import Button from "@/components/ui/Button";
import { reveal } from "@/lib/motion";
import { renewalLine } from "@/lib/pricing/renewal";
import { cn } from "@/utils/cn";
import SectionHeader from "./SectionHeader";
import type { PlanCardData } from "@/lib/pricing/plans";

type Cycle = "annual" | "monthly";

type PricingPlansProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  plans: readonly PlanCardData[];
  /** False in production until prices are confirmed: cards show "Price on request". */
  showPrices: boolean;
  /** Tax suffix from pricing.json, e.g. "+ VAT". Null for USD. */
  vatDisplay?: string | null;
  /** Only pass when the guarantee is verified in content/claims.ts. */
  guaranteeNote?: string | null;
  /** True only when the renewal-price-same claim may render (verified and terms page published). The renewal price itself always shows. */
  renewalPromise?: boolean;
  /** Billing periods actually offered. The toggle renders only when both are. */
  cycles?: readonly Cycle[];
  defaultCycle?: Cycle;
  headingLevel?: "h2" | "h3";
  /** Content under the cards, e.g. add-ons and the full comparison. */
  children?: ReactNode;
  className?: string;
};

function Price({ amount, vat }: { amount: string; vat?: string | null }) {
  return (
    <p className="flex flex-wrap items-baseline gap-x-1.5">
      <span className="font-[family-name:var(--font-heading)] text-4xl font-semibold tabular-nums tracking-tight text-foreground">{amount}</span>
      <span className="text-sm text-muted-foreground">/month{vat ? ` ${vat}` : ""}</span>
    </p>
  );
}

function PlanCard({
  index = 0,
  plan,
  cycle,
  showPrices,
  vat,
  guaranteeNote,
  renewalPromise = false,
  headingLevel,
}: {
  index?: number;
  plan: PlanCardData;
  cycle: Cycle;
  showPrices: boolean;
  vat?: string | null;
  guaranteeNote?: string | null;
  renewalPromise?: boolean;
  headingLevel: "h3" | "h4";
}) {
  const Heading = headingLevel;
  const amount = (c: Cycle) => (c === "annual" ? plan.annual : plan.monthly);
  const activeAmount = amount(cycle);
  // "Choose {plan name}" when prices are shown (no price in the label). The visible label already names the plan,
  // so it needs no separate aria-label; the generic fallback gets the plan name added for screen readers.
  const priced = !plan.custom && showPrices && Boolean(activeAmount);
  const ctaLabel = plan.custom ? "Talk to the team" : priced ? `Choose ${plan.name}` : "Ask about this plan";
  const ctaAria = plan.custom || priced ? undefined : `${ctaLabel}: ${plan.name}`;

  return (
    <li className="flex" {...reveal(index)}>
      <article
        className={cn(
          "surface relative flex w-full flex-col p-6 sm:p-7",
          plan.highlight && "plan-glow surface-raised !border-accent/60 shadow-lg ring-1 ring-accent/30",
        )}
      >
        <div className="flex h-7 items-start">
          {plan.badge && (
            <span
              className={cn(
                "inline-block rounded-full border px-2.5 py-1 text-[0.6875rem] font-semibold uppercase leading-none tracking-wider",
                plan.highlight ? "border-accent/40 bg-accent/15 text-link" : "border-border bg-muted text-muted-foreground",
              )}
            >
              {plan.badge}
            </span>
          )}
        </div>
        <Heading className="t-h4 mt-3 text-foreground">{plan.name}</Heading>
        <p className="t-small mt-2 min-h-[6rem] text-muted-foreground">{plan.description}</p>

        <div className="mt-6 min-h-[6.5rem]">
          {plan.custom ? (
            <>
              <p className="font-[family-name:var(--font-heading)] text-3xl font-semibold tracking-tight text-foreground">Custom pricing</p>
              <p className="t-small mt-2 text-muted-foreground">Contact us for a quote.</p>
            </>
          ) : !showPrices ? (
            <>
              <p className="font-[family-name:var(--font-heading)] text-3xl font-semibold tracking-tight text-foreground">Price on request</p>
              <p className="t-small mt-2 text-muted-foreground">Ask the team for current pricing.</p>
            </>
          ) : (
            (["annual", "monthly"] as const).map((c) => (
              <div key={c} hidden={cycle !== c} data-cycle={c}>
                <Price amount={amount(c) ?? ""} vat={vat} />
                <p className="t-small mt-2 text-muted-foreground">
                  {c === "annual" ? (
                    <>
                      {plan.annualTotal ? `${plan.annualTotal} billed annually. ` : "Billed annually. "}
                      {renewalLine(plan.renewal, { promiseVisible: renewalPromise, sameAsSignup: plan.renewalSame })}
                    </>
                  ) : (
                    "Billed monthly."
                  )}
                </p>
              </div>
            ))
          )}
        </div>

        <div className="mt-6">
          <Button
            href={plan.ctaHref}
            variant={plan.highlight ? "primary" : "secondary"}
            fullWidth
            aria-label={ctaAria}
            className="!h-auto !whitespace-normal py-3 text-center"
          >
            {ctaLabel}
          </Button>
          {guaranteeNote && !plan.custom && <p className="t-small mt-3 text-center text-muted-foreground">{guaranteeNote}</p>}
        </div>

        <ul className="mt-6 space-y-3 border-t border-border pt-6">
          {plan.highlights.map((item) => (
            <li key={item} className="flex items-start gap-3 text-sm text-foreground">
              <Check className="mt-0.5 size-4 shrink-0 text-link" aria-hidden="true" strokeWidth={2.5} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </article>
    </li>
  );
}

/**
 * Pricing plans with a billing-period toggle. Both periods are rendered into the HTML (the
 * inactive one uses `hidden`), so prices stay crawlable. Renewal price sits directly under
 * the signup price. The toggle appears only when both billing periods are offered. Guarantee
 * copy renders only when verified. Prices are formatted with Intl from data/pricing.json.
 */
export default function PricingPlans({
  eyebrow,
  title,
  description,
  plans,
  showPrices,
  vatDisplay,
  guaranteeNote,
  renewalPromise,
  cycles = ["annual", "monthly"],
  defaultCycle = "annual",
  headingLevel = "h2",
  children,
  className,
}: PricingPlansProps) {
  const headingId = useId();
  const [swapped, setSwapped] = useState(false);
  const [cycle, setCycle] = useState<Cycle>(cycles.includes(defaultCycle) ? defaultCycle : cycles[0]);
  const showToggle = showPrices && cycles.length > 1;
  const cardHeading = headingLevel === "h2" ? "h3" : "h4";

  return (
    <section aria-labelledby={title ? headingId : undefined} className={cn("section-y", className)}>
      <div className="container-site">
        {title && <SectionHeader id={headingId} eyebrow={eyebrow} title={title} description={description} headingLevel={headingLevel} />}

        {showPrices && process.env.NODE_ENV === "development" && (
          <p role="note" className="mx-auto mt-6 max-w-xl rounded-xl border border-warning/40 bg-warning-surface px-4 py-2 text-center text-sm font-medium text-warning">
            Draft prices from data/pricing.json (unconfirmed). Hidden in production until FEATURES.pricesConfirmed is set.
          </p>
        )}

        {showToggle && (
          <div className="mt-10 flex justify-center">
            <div role="group" aria-label="Billing period" className="inline-flex rounded-xl border border-border-strong bg-muted p-1">
              {cycles.map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-pressed={cycle === c}
                  onClick={() => {
                    setSwapped(true);
                    setCycle(c);
                  }}
                  className={cn(
                    "min-h-11 rounded-lg px-5 text-sm font-semibold transition-colors",
                    cycle === c ? "bg-card text-foreground shadow-sm ring-1 ring-border-strong" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {c === "annual" ? "Billed annually" : "Billed monthly"}
                </button>
              ))}
            </div>
          </div>
        )}

        {plans.length === 0 ? (
          <p className="t-body mt-12 text-center text-muted-foreground">Plans are not available right now. Please contact the team.</p>
        ) : (
          <ul data-swapped={swapped || undefined} className={cn("grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3", title || showToggle ? "mt-10" : "")}>
            {plans.map((plan, index) => (
              <PlanCard
                key={plan.id}
                index={index}
                plan={plan}
                cycle={cycle}
                showPrices={showPrices}
                vat={vatDisplay}
                guaranteeNote={guaranteeNote}
                renewalPromise={renewalPromise}
                headingLevel={cardHeading}
              />
            ))}
          </ul>
        )}

        {children}
      </div>
    </section>
  );
}
