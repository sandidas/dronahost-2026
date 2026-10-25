/**
 * Feature flags. Flip here only; no scattered `process.env` checks.
 */
export const FEATURES = {
  /**
   * Multi-currency selector (USD, GBP, EUR, AED, INR). On since 2026-10-12: data/pricing.json stores every price in each
   * currency, calculated once from the owner's fixed rates (pricing 4.1.0). Nothing is converted at runtime.
   */
  currencySelector: true,
  /**
   * Set true once the USD prices in data/pricing.json are confirmed final.
   * While false, prices render in development only; production shows "Price on request".
   */
  pricesConfirmed: true, // owner 2026-10-10 (decision 57): show the prices in data/pricing.json
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

/**
 * Sample content preview: in development only, sections that wait on owner facts (proof numbers, a case study, reviews)
 * show the clearly marked samples from content/placeholders.ts so the layout can be reviewed. Never in a production build,
 * and never in the content checks (they do not run in development). Real data replaces a sample as soon as it exists.
 */
export const showSamples = (): boolean => process.env.NODE_ENV === "development";
