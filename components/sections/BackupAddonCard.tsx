"use client";

import { useId, useState } from "react";
import type { Money } from "@/lib/pricing";
import { pickMoney, useCurrency } from "@/components/ui/CurrencyAmount";

type Tier = { id: string; size: string; monthly: string; monthlyAll?: Money | null };

type BackupAddonCardProps = {
  name: string;
  description: string;
  tiers: readonly Tier[];
  showPrices: boolean;
  /** Which plans include it or can add it, from pricing.json. */
  availability?: string;
};

/** One add-on card for every offsite backup size. Native select, so it works with any assistive tech. */
export default function BackupAddonCard({ name, description, tiers, showPrices, availability }: BackupAddonCardProps) {
  const selectId = useId();
  const [tierId, setTierId] = useState(tiers[0]?.id ?? "");
  const tier = tiers.find((t) => t.id === tierId) ?? tiers[0];
  const currency = useCurrency();
  if (!tier) return null;

  return (
    <li className="surface flex flex-col gap-4 p-5">
      <div>
        <p className="font-semibold text-foreground">{name}</p>
        <p className="t-small mt-1 text-muted-foreground">{description}</p>
        {availability && <p className="mt-2 text-xs font-medium text-link">{availability}</p>}
      </div>
      <div className="mt-auto flex flex-wrap items-end justify-between gap-4">
        <div>
          <label htmlFor={selectId} className="t-small block font-medium text-foreground">
            Backup size
          </label>
          <select
            id={selectId}
            value={tierId}
            onChange={(e) => setTierId(e.target.value)}
            className="mt-1.5 min-h-11 rounded-lg border border-border-strong bg-muted px-3 text-sm text-foreground"
          >
            {tiers.map((t) => (
              <option key={t.id} value={t.id}>
                {t.size}
              </option>
            ))}
          </select>
        </div>
        {showPrices && (
          <p className="text-sm font-semibold text-foreground" aria-live="polite">
            +{pickMoney(tier.monthlyAll, currency) ?? tier.monthly}/month
          </p>
        )}
      </div>
    </li>
  );
}
