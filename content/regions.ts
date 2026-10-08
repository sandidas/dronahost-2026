/**
 * Regional landing page facts (label, hreflang, regimes that apply to businesses serving that audience).
 * These are not prices, so they no longer live in data/pricing.json (removed in pricing v3.0.0).
 * Data centre locations are left out on purpose until the owner confirms where servers are.
 */
export type RegionKey = "us" | "uk" | "eu" | "uae";

export type RegionMeta = {
  label: string;
  hreflang: string;
  compliance: readonly string[];
};

export const REGION_KEYS: readonly RegionKey[] = ["us", "uk", "eu", "uae"];

export const REGIONS_META: Record<RegionKey, RegionMeta> = {
  us: { label: "United States", hreflang: "en-US", compliance: ["CCPA"] },
  uk: { label: "United Kingdom", hreflang: "en-GB", compliance: ["UK-GDPR", "ICO"] },
  eu: { label: "European Union", hreflang: "de-DE", compliance: ["GDPR", "GDPR-Art3"] },
  uae: { label: "United Arab Emirates", hreflang: "en-AE", compliance: ["UAE-PDPL"] },
};
