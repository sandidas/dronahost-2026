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
  /** Competitor comparison pages (/vs/*). Off until every claim about DronaHost and each competitor is verified. */
  comparisonPages: false,
  /** The customer account area (/login) exists. While false, no "Log in" link is shown. */
  accountArea: false,
  /** Newsletter signup endpoint exists and stores consented addresses. */
  newsletter: false,
  /** WHMCS domain search. Needs WHMCS_API_URL, WHMCS_API_IDENTIFIER and WHMCS_API_SECRET. */
  domainSearch: false,
  /** English locale variants (/en-gb, /en-ae) are public. Off until their content and regional claims are confirmed. */
  localeVariants: false,
  /** Checkout/signup routes exist. While false, plan CTAs go to /contact. */
  checkout: false,
} as const;

/** Whether numeric prices may be shown (and put in meta tags or structured data). */
export const showPrices = (): boolean => FEATURES.pricesConfirmed || process.env.NODE_ENV === "development";
