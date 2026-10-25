"use client";

import { Globe } from "lucide-react";
import { useId } from "react";
import { FEATURES } from "@/lib/flags";
import { ENABLED_CURRENCIES } from "@/lib/pricing";
import { CURRENCY_OPTIONS, isCurrency, writeCurrencyCookie } from "@/lib/pricing/currency";
import { useCurrency } from "@/components/ui/CurrencyAmount";
import { cn } from "@/utils/cn";

type CurrencySelectorProps = {
  /** Showcase only: render even while FEATURES.currencySelector is off. */
  forceEnabled?: boolean;
  className?: string;
};

/**
 * Currency picker (USD, GBP, EUR, AED, INR). Renders nothing until
 * `FEATURES.currencySelector` is turned on in lib/flags.ts, because only USD prices
 * are confirmed. Starts on the currency detected from the visitor's location and browser until they pick one. Uses a
 * native <select> for full keyboard and screen-reader support and saves an explicit pick in a cookie (with consent).
 */
export default function CurrencySelector({ forceEnabled = false, className }: CurrencySelectorProps) {
  // Starts on the visitor's own choice, else the currency detected from their location and browser (lib/pricing/detect.ts).
  const current = useCurrency();
  // The header and the pricing block can both show one, so each needs its own id.
  const selectId = useId();

  if (!FEATURES.currencySelector && !forceEnabled) return null;

  return (
    <div className={cn("relative inline-flex items-center", className)}>
      <Globe className="pointer-events-none absolute start-3 size-4 text-muted-foreground" aria-hidden="true" />
      <label htmlFor={selectId} className="sr-only">
        Currency
      </label>
      <select
        id={selectId}
        value={current}
        onChange={(e) => {
          if (!isCurrency(e.target.value)) return;
          // Prices switch on the client: every amount is already in the page, so no reload is needed.
          writeCurrencyCookie(e.target.value);
        }}
        className="h-11 cursor-pointer appearance-none rounded-lg border border-border-strong bg-card ps-9 pe-8 text-sm font-semibold text-foreground transition-colors hover:border-accent"
      >
        {CURRENCY_OPTIONS.filter((c) => ENABLED_CURRENCIES.includes(c.code)).map((c) => (
          <option key={c.code} value={c.code}>
            {c.code} ({c.symbol})
          </option>
        ))}
      </select>
      <svg viewBox="0 0 20 20" className="pointer-events-none absolute end-2.5 size-4 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M5 7.5 10 12.5 15 7.5" />
      </svg>
    </div>
  );
}
