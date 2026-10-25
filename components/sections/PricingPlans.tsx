"use client";

import { Check } from "lucide-react";
import { useId, useState, type ReactNode } from "react";
import Button from "@/components/ui/Button";
import { reveal } from "@/lib/motion";
import { renewalLine } from "@/lib/pricing/renewal";
import { cn } from "@/utils/cn";
import SectionHeader from "./SectionHeader";
import type { PlanCardData } from "@/lib/pricing/plans";
import { UI } from "@/content/strings";
import { Link } from "@/i18n/link";
import type { GuaranteeLink } from "@/lib/pricing/guarantee";
import type { CurrencyCode } from "@/lib/pricing";
import { FEATURES } from "@/lib/flags";
import CurrencySelector from "@/components/layout/CurrencySelector";
import { pickMoney, useCurrency } from "@/components/ui/CurrencyAmount";

type Cycle = "annual" | "monthly";

type PricingPlansProps = {
  /** The section id, so a link such as #plans scrolls to it. */
  anchorId?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  plans: readonly PlanCardData[];
  /** False in production until prices are confirmed: cards show "Price on request". */
  showPrices: boolean;
  /**
   * Prices appear only on the pricing page (owner decision 58). Elsewhere pass the pricing page's path: the cards keep the plan
   * name, description and what is included, and send the reader to that page for the price.
   */
  pricesHref?: string;
  /** Tax suffix from pricing.json, e.g. "+ VAT". Null for USD. */
  vatDisplay?: string | null;
  /** Only pass when the guarantee is verified in content/claims.ts. */
  guaranteeNote?: string | null;
  /** Link to the guarantee terms, shown after the note. */
  guaranteeLink?: GuaranteeLink | null;
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
  currency,
  cycle,
  showPrices,
  vat,
  guaranteeNote,
  guaranteeLink,
  renewalPromise = false,
  pricesHref,
  headingLevel,
}: {
  index?: number;
  plan: PlanCardData;
  currency: CurrencyCode;
  cycle: Cycle;
  showPrices: boolean;
  pricesHref?: string;
  vat?: string | null;
  guaranteeNote?: string | null;
  guaranteeLink?: GuaranteeLink | null;
  renewalPromise?: boolean;
  headingLevel: "h3" | "h4";
}) {
  const Heading = headingLevel;
  // Prices in the visitor's currency, each stored in pricing.json (USD until the visitor picks another).
  const amount = (c: Cycle) => (c === "annual" ? (pickMoney(plan.money.annual, currency) ?? plan.annual) : (pickMoney(plan.money.monthly, currency) ?? plan.monthly));
  const annualTotal = pickMoney(plan.money.annualTotal, currency) ?? plan.annualTotal;
  const renewal = pickMoney(plan.money.renewal, currency) ?? plan.renewal;
  const activeAmount = amount(cycle);
  // "Choose {plan name}" when prices are shown (no price in the label). The visible label already names the plan,
  // so it needs no separate aria-label; the generic fallback gets the plan name added for screen readers.
  const priced = !plan.custom && showPrices && Boolean(activeAmount);
  const elsewhere = !plan.custom && Boolean(pricesHref);
  const ctaLabel = plan.custom ? UI.pricing.customCta : elsewhere ? UI.pricing.seePlanPrice(plan.name) : priced ? UI.pricing.choosePlan(plan.name) : UI.pricing.talkAboutPlan(plan.name);
  const ctaHref = elsewhere && pricesHref ? `${pricesHref}#${plan.id}` : plan.ctaHref;
  const ctaAria = plan.custom || priced || elsewhere ? undefined : `${ctaLabel}: ${plan.name}`;

  return (
    <li className="flex" {...reveal(index)}>
      <article
        id={plan.id}
        className={cn(
          "surface relative flex w-full scroll-mt-24 flex-col p-6 sm:p-7",
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
              <p className="font-[family-name:var(--font-heading)] text-3xl font-semibold tracking-tight text-foreground">{UI.pricing.customTitle}</p>
              <p className="t-small mt-2 text-muted-foreground">{UI.pricing.customLine}</p>
            </>
          ) : elsewhere && pricesHref ? (
            <>
              <p className="font-[family-name:var(--font-heading)] text-2xl font-semibold tracking-tight text-foreground">{UI.pricing.pricesElsewhereTitle}</p>
              <p className="t-small mt-2 text-muted-foreground">
                <Link href={pricesHref} className="text-link underline underline-offset-4">
                  {UI.pricing.pricesElsewhereLink}
                </Link>
              </p>
            </>
          ) : !showPrices ? (
            <>
              <p className="font-[family-name:var(--font-heading)] text-3xl font-semibold tracking-tight text-foreground">{UI.pricing.onRequestTitle}</p>
              <p className="t-small mt-2 text-muted-foreground">{UI.pricing.onRequestLine}</p>
            </>
          ) : (
            (["annual", "monthly"] as const).map((c) => (
              <div key={c} hidden={cycle !== c} data-cycle={c}>
                <Price amount={amount(c) ?? ""} vat={vat} />
                <p className="t-small mt-2 text-muted-foreground">
                  {c === "annual" ? (
                    <>
                      {annualTotal ? `${annualTotal} ${UI.pricing.billedAnnuallyAfter} ` : `${UI.pricing.billedAnnually}. `}
                      {renewalLine(renewal, { promiseVisible: renewalPromise, sameAsSignup: plan.renewalSame })}
                    </>
                  ) : (
                    `${UI.pricing.billedMonthly}.`
                  )}
                </p>
              </div>
            ))
          )}
        </div>

        <div className="mt-6">
          <Button
            href={ctaHref}
            variant={plan.highlight ? "primary" : "secondary"}
            fullWidth
            aria-label={ctaAria}
            className="!h-auto !whitespace-normal py-3 text-center"
          >
            {ctaLabel}
          </Button>
          {guaranteeNote && !plan.custom && (
            <p className="t-small mt-3 text-center text-muted-foreground">
              {guaranteeNote}
              {guaranteeLink && (
                <>
                  {" "}
                  <Link href={guaranteeLink.href} className="text-link underline underline-offset-4">
                    {guaranteeLink.label}
                  </Link>
                  .
                </>
              )}
            </p>
          )}
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
  guaranteeLink,
  renewalPromise,
  pricesHref,
  cycles = ["annual", "monthly"],
  defaultCycle = "annual",
  headingLevel = "h2",
  children,
  anchorId,
  className,
}: PricingPlansProps) {
  const headingId = useId();
  const [swapped, setSwapped] = useState(false);
  const [cycle, setCycle] = useState<Cycle>(cycles.includes(defaultCycle) ? defaultCycle : cycles[0]);
  const currency = useCurrency();
  const showCurrency = showPrices && !pricesHref && FEATURES.currencySelector;
  const showToggle = showPrices && !pricesHref && cycles.length > 1;
  const cardHeading = headingLevel === "h2" ? "h3" : "h4";

  return (
    <section id={anchorId} aria-labelledby={title ? headingId : undefined} className={cn("section-y scroll-mt-20", className)}>
      <div className="container-site">
        {title && <SectionHeader id={headingId} eyebrow={eyebrow} title={title} description={description} headingLevel={headingLevel} />}

        {(showToggle || showCurrency) && (
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {showToggle && (
            <div role="group" aria-label={UI.pricing.billingPeriod} className="inline-flex rounded-xl border border-border-strong bg-muted p-1">
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
                  {c === "annual" ? UI.pricing.billedAnnually : UI.pricing.billedMonthly}
                </button>
              ))}
            </div>
            )}
            {showCurrency && <CurrencySelector />}
          </div>
        )}

        {plans.length === 0 ? (
          <p className="t-body mt-12 text-center text-muted-foreground">{UI.pricing.unavailable}</p>
        ) : (
          <ul data-swapped={swapped || undefined} className={cn("grid grid-cols-1 gap-5 md:grid-cols-2", plans.length === 4 ? "xl:grid-cols-4" : "lg:grid-cols-3", title || showToggle ? "mt-10" : "")}>
            {plans.map((plan, index) => (
              <PlanCard
                key={plan.id}
                index={index}
                plan={plan}
                currency={currency}
                cycle={cycle}
                showPrices={showPrices}
                vat={vatDisplay}
                guaranteeNote={guaranteeNote}
                guaranteeLink={guaranteeLink}
                renewalPromise={renewalPromise}
                pricesHref={pricesHref}
                headingLevel={cardHeading}
              />
            ))}
          </ul>
        )}

        {showPrices && !pricesHref && plans.length > 0 && <p className="mt-6 text-center text-sm text-muted-foreground">{UI.pricing.taxLine}</p>}

        {children}
      </div>
    </section>
  );
}
