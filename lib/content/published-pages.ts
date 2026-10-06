/**
 * Pages whose wording has been reviewed and published. `TrustSignals` with `onlyPublished` lists only these.
 * Every legal and policy page is still a draft awaiting review, so this is empty. Add a path here (or move this to a
 * per-page status field) when its page is reviewed; it is the same decision as flipping a claim's `termsPageStatus`.
 */
export const PUBLISHED_PAGES: ReadonlySet<string> = new Set<string>();

/** Plain title, icon and link text for the policy pages a page may link to. */
export const POLICY_LINKS: Record<string, { title: string; description: string; linkLabel: string; icon: "refresh-cw" | "gauge" | "file-text" | "lock" }> = {
  "/refund-policy": { title: "Refund policy", description: "How the money-back guarantee works and how to ask for a refund.", linkLabel: "Read the refund policy", icon: "refresh-cw" },
  "/terms": { title: "Terms of service", description: "The agreement between you and DronaHost, in writing.", linkLabel: "Read the terms", icon: "file-text" },
  "/sla": { title: "Service level agreement", description: "What we commit to on availability, and what happens if we miss it.", linkLabel: "Read the SLA", icon: "gauge" },
  "/privacy": { title: "Privacy policy", description: "What data we collect, why, and the choices you have.", linkLabel: "Read the privacy policy", icon: "lock" },
};
