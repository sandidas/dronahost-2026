/**
 * Regional landing page facts (label, hreflang, regimes that apply to businesses serving that audience).
 * These are not prices, so they no longer live in data/pricing.json (removed in pricing v3.0.0).
 * Pages make no claim about where sites are hosted: they speak to businesses serving each audience.
 */
export type RegionKey = "us" | "uk" | "eu" | "uae";

export type RegionMeta = {
  label: string;
  hreflang: string;
  compliance: readonly string[];
  /** Display text for the compliance regimes. Never derive it from the ids. */
  complianceLabel: string;
};

export const REGION_KEYS: readonly RegionKey[] = ["us", "uk", "eu", "uae"];

export const REGIONS_META: Record<RegionKey, RegionMeta> = {
  us: { label: "United States", hreflang: "en-US", compliance: ["CCPA"], complianceLabel: "the CCPA" },
  uk: { label: "United Kingdom", hreflang: "en-GB", compliance: ["UK-GDPR", "ICO"], complianceLabel: "UK GDPR (regulated by the ICO)" },
  eu: { label: "European Union", hreflang: "en-IE", compliance: ["GDPR", "GDPR-Art3"], complianceLabel: "the GDPR" },
  uae: { label: "United Arab Emirates", hreflang: "en-AE", compliance: ["UAE-PDPL"], complianceLabel: "the UAE Personal Data Protection Law (PDPL)" },
};
