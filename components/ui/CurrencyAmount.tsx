"use client";

import { useSyncExternalStore } from "react";
import { DEFAULT_CURRENCY, type CurrencyCode, type Money } from "@/lib/pricing";
import { readCurrencyCookie, subscribeCurrency } from "@/lib/pricing/currency";

/**
 * The visitor's currency: their own choice, else the one detected from their location and browser, else USD. The server and
 * the first client render use USD, so the HTML never mismatches; the right currency applies right after.
 */
export function useCurrency(): CurrencyCode {
  return useSyncExternalStore<CurrencyCode>(subscribeCurrency, readCurrencyCookie, () => DEFAULT_CURRENCY);
}

/** Picks the visitor's currency from a Money value, falling back to USD. */
export const pickMoney = (money: Money | null | undefined, currency: CurrencyCode): string | null => money?.[currency] ?? money?.[DEFAULT_CURRENCY] ?? null;

/** One price in the visitor's currency. Every amount was formatted on the server from data/pricing.json; nothing is converted here. */
export default function CurrencyAmount({ amounts }: { amounts: Money }) {
  const currency = useCurrency();
  return <>{pickMoney(amounts, currency)}</>;
}
