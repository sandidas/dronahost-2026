/**
 * Trust signals shown by <TrustSignals>.
 *
 * TODO: replace with verified data. Each entry renders only when `verified` is true
 * (certifications and locations only if the company actually holds/operates them).
 * Where a claim exists in content/claims.ts, `verified` is derived from it, never set by hand.
 * Reuse the evidence in content/claims.ts; do not duplicate figures here.
 */
import type { FeatureIconName } from "@/components/ui/FeatureIcon";
import { isVerified } from "./claims";

export type TrustItem = {
  id: string;
  icon: FeatureIconName;
  title: string;
  description: string;
  href?: string;
  linkLabel?: string;
  verified: boolean;
};

export const TRUST_ITEMS: readonly TrustItem[] = [
  {
    id: "money-back",
    icon: "refresh-cw",
    title: "Money-back guarantee",
    description: "If hosting is not right for you, you can cancel within the guarantee period for a refund.",
    href: "/refund-policy",
    linkLabel: "Read the refund policy",
    verified: isVerified("money-back"),
  },
  {
    id: "sla",
    icon: "gauge",
    title: "Published uptime commitment",
    description: "Our uptime commitment and service-credit terms are set out in writing.",
    href: "/sla",
    linkLabel: "Read the SLA",
    verified: isVerified("uptime-sla"),
  },
  {
    id: "security",
    icon: "shield-check",
    title: "Security practices",
    description: "How we protect servers, data and backups, in plain language.",
    href: "/security",
    linkLabel: "Read our security practices",
    verified: false,
  },
  {
    id: "dpa",
    icon: "file-text",
    title: "Data processing agreement",
    description: "A DPA is available for customers who need one for GDPR compliance.",
    href: "/data-processing",
    linkLabel: "Read about data processing",
    verified: false,
  },
  {
    id: "support",
    icon: "life-buoy",
    title: "Support by people",
    description: "Open a ticket and reach the team that runs your server.",
    href: "/contact",
    linkLabel: "Contact support",
    verified: false,
  },
];

export const PRICING_TRANSPARENCY_NOTE = "Renewal prices are shown next to the signup price on every plan.";
