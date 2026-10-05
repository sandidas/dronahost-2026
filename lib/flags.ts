/**
 * Feature flags. Flip here only; no scattered `process.env` checks.
 */
export const FEATURES = {
  /**
   * Multi-currency selector (USD, GBP, EUR, AED, INR).
   * Off until non-USD prices in data/pricing.json are confirmed final.
   */
  currencySelector: false,
  /**
   * Set true once the USD prices in data/pricing.json are confirmed final.
   * While false, prices render in development only; production shows "Price on request".
   */
  pricesConfirmed: false,
  /** Newsletter signup endpoint exists and stores consented addresses. */
  newsletter: false,
  /** Checkout/signup routes exist. While false, plan CTAs go to /contact. */
  checkout: false,
} as const;

/** Whether numeric prices may be shown (and put in meta tags or structured data). */
export const showPrices = (): boolean => FEATURES.pricesConfirmed || process.env.NODE_ENV === "development";
