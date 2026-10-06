import { Check } from "lucide-react";
import ComparisonTable from "@/components/sections/ComparisonTable";
import { buildPlanComparison } from "@/lib/pricing/compare";
import BackupAddonCard from "@/components/sections/BackupAddonCard";
import { ADDONS, BACKUP_ADDON, INCLUDED_WITH_EVERY_PLAN } from "@/lib/pricing/plans";

/** Everything under the plan cards: included list, optional add-ons and the full feature table. */
export default function PricingExtras({ showPrices }: { showPrices: boolean }) {
  const { columns, groups } = buildPlanComparison();
  return (
    <div className="mt-16 space-y-12">
      {INCLUDED_WITH_EVERY_PLAN.length > 0 && (
        <section aria-labelledby="included-heading" className="surface p-6 sm:p-8">
          <h3 id="included-heading" className="t-h4 text-foreground">
            Included with every plan
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
          <h3 id="addons-heading" className="t-h4 text-foreground">
            Optional add-ons
          </h3>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2">
            {ADDONS.map((addon) => (
              <li key={addon.id} className="surface flex items-start justify-between gap-4 p-5">
                <div>
                  <p className="font-semibold text-foreground">{addon.name}</p>
                  <p className="t-small mt-1 text-muted-foreground">{addon.description}</p>
                </div>
                {showPrices && <p className="shrink-0 text-sm font-semibold text-foreground">+{addon.monthly}/month</p>}
              </li>
            ))}
            {BACKUP_ADDON && <BackupAddonCard {...BACKUP_ADDON} showPrices={showPrices} />}
          </ul>
        </section>
      )}

      {/* Native <details>: the full table is in the initial HTML and fully keyboard accessible. */}
      <details className="group surface">
        <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-6 py-4 text-base font-semibold text-foreground [&::-webkit-details-marker]:hidden">
          Compare all features
          <span aria-hidden="true" className="text-link transition-transform group-open:rotate-180">
            ▾
          </span>
        </summary>
        <div className="px-3 pb-4 sm:px-6 sm:pb-6">
          <ComparisonTable bare caption="Comparison of every DronaHost hosting plan" columns={columns} groups={groups} rowHeader="Plan" />
        </div>
      </details>
    </div>
  );
}
