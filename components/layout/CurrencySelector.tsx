"use client";

import { Globe } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSyncExternalStore } from "react";
import { FEATURES } from "@/lib/flags";
import { DEFAULT_CURRENCY, type CurrencyCode } from "@/lib/pricing";
import {
  CURRENCY_EVENT,
  CURRENCY_OPTIONS,
  isCurrency,
  readCurrencyCookie,
  writeCurrencyCookie,
} from "@/lib/pricing/currency";
import { cn } from "@/utils/cn";

const subscribe = (notify: () => void) => {
  window.addEventListener(CURRENCY_EVENT, notify);
  return () => window.removeEventListener(CURRENCY_EVENT, notify);
};

type CurrencySelectorProps = {
  /** Showcase only: render even while FEATURES.currencySelector is off. */
  forceEnabled?: boolean;
  className?: string;
};

/**
 * Currency picker (USD, GBP, EUR, AED, INR). Renders nothing until
 * `FEATURES.currencySelector` is turned on in lib/flags.ts, because only USD prices
 * are confirmed. Uses a native <select> for full keyboard and screen-reader support,
 * saves the choice in a cookie and refreshes server-rendered prices.
 */
export default function CurrencySelector({ forceEnabled = false, className }: CurrencySelectorProps) {
  const router = useRouter();
  const current = useSyncExternalStore<CurrencyCode>(subscribe, readCurrencyCookie, () => DEFAULT_CURRENCY);

  if (!FEATURES.currencySelector && !forceEnabled) return null;

  return (
    <div className={cn("relative inline-flex items-center", className)}>
      <Globe className="pointer-events-none absolute start-3 size-4 text-muted-foreground" aria-hidden="true" />
      <label htmlFor="currency-select" className="sr-only">
        Currency
      </label>
      <select
        id="currency-select"
        value={current}
        onChange={(e) => {
          if (!isCurrency(e.target.value)) return;
          writeCurrencyCookie(e.target.value);
          router.refresh();
        }}
        className="h-11 cursor-pointer appearance-none rounded-lg border border-border-strong bg-card ps-9 pe-8 text-sm font-semibold text-foreground transition-colors hover:border-accent"
      >
        {CURRENCY_OPTIONS.map((c) => (
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
