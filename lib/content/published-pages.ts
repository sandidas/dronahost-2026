import type { FeatureIconName } from "@/components/ui/FeatureIcon";
import { POLICY_TEXT } from "@/content/strings";

/**
 * Pages whose wording has been reviewed and published. `TrustSignals` with `onlyPublished` lists only these.
 * Every legal and policy page is still a draft awaiting review, so this is empty. Add a path here (or move this to a
 * per-page status field) when its page is reviewed; it is the same decision as flipping a claim's `termsPageStatus`.
 */
export const PUBLISHED_PAGES: ReadonlySet<string> = new Set<string>(["/refund-policy", "/support-policy", "/pricing-policy", "/backup-policy", "/migration-terms"]);

/** Icon and text for the policy pages a page may link to. The text is in content/strings.ts (POLICY_TEXT). */
const ICONS: Record<string, FeatureIconName> = {
  "/refund-policy": "refresh-cw", "/support-policy": "life-buoy", "/pricing-policy": "shield-check", "/backup-policy": "server",
  "/migration-terms": "server", "/terms": "file-text", "/sla": "gauge", "/privacy": "lock",
};
export const POLICY_LINKS: Record<string, { title: string; description: string; linkLabel: string; icon: FeatureIconName }> = Object.fromEntries(
  Object.entries(POLICY_TEXT).map(([href, t]) => [href, { ...t, icon: ICONS[href] }]),
);
