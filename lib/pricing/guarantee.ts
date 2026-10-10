import { CLAIMS } from "@/content/claims";
import { POLICY_TEXT } from "@/content/strings";

export type GuaranteeLink = { href: string; label: string };

/**
 * The money-back line under plan buttons, taken from the claim text in content/claims.ts and
 * linked to its terms page. Both are null while the money-back claim does not render.
 */
export function moneyBackGuarantee(): { guaranteeNote: string | null; guaranteeLink: GuaranteeLink | null } {
  const claim = CLAIMS.find((c) => c.id === "money-back" && c.verified);
  if (!claim) return { guaranteeNote: null, guaranteeLink: null };
  const href = claim.termsPage;
  const label = claim.termsLabel ?? (href ? POLICY_TEXT[href]?.linkLabel : undefined);
  return { guaranteeNote: `${claim.text}.`, guaranteeLink: href && label ? { href, label } : null };
}
