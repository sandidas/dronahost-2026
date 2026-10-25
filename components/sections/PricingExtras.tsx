import { Check, PackagePlus } from "lucide-react";
import ComparisonTable from "@/components/sections/ComparisonTable";
import BackupAddonCard from "@/components/sections/BackupAddonCard";
import CurrencyAmount from "@/components/ui/CurrencyAmount";
import { UI } from "@/content/strings";
import { buildPlanComparison } from "@/lib/pricing/compare";
import { ADDONS, BACKUP_ADDON, INCLUDED_WITH_EVERY_PLAN } from "@/lib/pricing/plans";

type PricingExtrasProps = {
  showPrices: boolean;
  /** The folded "Compare all features" table. Off where the page shows the full comparison as its own section (/pricing). */
  compare?: boolean;
};

/** Everything under the plan cards: the included list, the add-ons with their prices, and optionally the folded feature table. */
export default function PricingExtras({ showPrices, compare = true }: PricingExtrasProps) {
  const t = UI.pricing;
  return (
    <div className="mt-16 space-y-12">
      {INCLUDED_WITH_EVERY_PLAN.length > 0 && (
        <section aria-labelledby="included-heading" className="surface p-6 sm:p-8">
          <h3 id="included-heading" className="t-h4 text-foreground">
            {t.includedTitle}
          </h3>
          <ul className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
            {INCLUDED_WITH_EVERY_PLAN.map((label) => (
              <li key={label} className="flex items-start gap-3 text-sm text-foreground">
                <Check className="mt-0.5 size-4 shrink-0 text-link" aria-hidden="true" strokeWidth={2.5} />
                {label}
              </li>
            ))}
          </ul>
        </section>
      )}

      {(ADDONS.length > 0 || BACKUP_ADDON) && (
        <section aria-labelledby="addons-heading">
          <div className="flex items-start gap-3">
            <span aria-hidden="true" className="grid size-10 shrink-0 place-items-center rounded-xl border border-border bg-surface-raised text-link">
              <PackagePlus className="size-5" strokeWidth={1.8} />
            </span>
            <div>
              <h3 id="addons-heading" className="t-h4 text-foreground">
                {t.addonsTitle}
              </h3>
              <p className="t-small mt-1 text-muted-foreground">{t.addonsLine}</p>
            </div>
          </div>
          <ul className="mt-6 grid gap-4 md:grid-cols-3">
            {ADDONS.map((addon) => (
              <li key={addon.id} className="surface flex flex-col gap-3 p-5">
                <div className="flex items-start justify-between gap-4">
                  <p className="font-semibold text-foreground">{addon.name}</p>
                  {showPrices && (
                    <p className="shrink-0 text-sm font-semibold tabular-nums text-foreground">
                      +{addon.monthlyAll ? <CurrencyAmount amounts={addon.monthlyAll} /> : addon.monthly}
                      <span className="font-normal text-muted-foreground">/month</span>
                    </p>
                  )}
                </div>
                <p className="t-small text-muted-foreground">{addon.description}</p>
                {addon.availability && <p className="mt-auto text-xs font-medium text-link">{addon.availability}</p>}
              </li>
            ))}
            {BACKUP_ADDON && <BackupAddonCard {...BACKUP_ADDON} showPrices={showPrices} />}
          </ul>
        </section>
      )}

      {compare && (
        // Native <details>: the full table is in the initial HTML and fully keyboard accessible.
        <details className="group surface">
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-6 py-4 text-base font-semibold text-foreground [&::-webkit-details-marker]:hidden">
            {t.compareToggle}
            <span aria-hidden="true" className="text-link transition-transform group-open:rotate-180">
              ▾
            </span>
          </summary>
          <div className="px-3 pb-4 sm:px-6 sm:pb-6">
            <ComparisonTable bare caption={t.compareCaption} {...buildPlanComparison()} rowHeader={t.compareRowHeader} />
          </div>
        </details>
      )}
    </div>
  );
}
