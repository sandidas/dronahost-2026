/**
 * Feature flags. Flip here only; no scattered `process.env` checks.
 */
export const FEATURES = {
  /**
   * Multi-currency selector (USD, GBP, EUR, AED, INR).
   * Off until non-USD prices in data/pricing.json are confirmed final.
   */
  currencySelector: false,
} as const;
