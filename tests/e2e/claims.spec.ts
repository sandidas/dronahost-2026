import { expect, test } from "@playwright/test";
import { CLAIMS, claimHiddenReason, claimRenders, claimsMissingTermsPage, claimsWithDraftTermsPage } from "../../content/claims";

// The owner approved these five claims and their terms pages on 2026-10-08. A sixth must come with an explicit edit here.
const RENDERING = ["backups", "free-migration", "money-back", "renewal-price-same", "support-24-7"];
const PAGES = ["/", "/pricing", "/wordpress-hosting", "/about", "/contact"];

test.describe("claim gating (logic)", () => {
  test("a claim renders only when verified AND its terms page is published", () => {
    const published = { termsPage: "/refund-policy", termsPageStatus: "published" } as const;
    expect(claimRenders({ status: "verified", ...published })).toBe(true);
    expect(claimRenders({ status: "verified", termsPage: "/refund-policy", termsPageStatus: "draft" })).toBe(false);
    expect(claimRenders({ status: "verified", termsPage: null, termsPageStatus: "published" })).toBe(false);
    expect(claimRenders({ status: "unverified", ...published })).toBe(false);
  });

  test("today exactly the five owner-approved claims render", () => {
    expect(CLAIMS.filter((c) => c.verified).map((c) => c.id).sort()).toEqual(RENDERING);
  });

  test("hidden reasons match the registry", () => {
    const money = CLAIMS.find((c) => c.id === "money-back");
    expect(money && claimHiddenReason(money)).toBeNull();
    expect(claimsWithDraftTermsPage().map((c) => c.id)).toEqual([]);
    expect(claimsMissingTermsPage().map((c) => c.id)).toEqual([]);
    const uptime = CLAIMS.find((c) => c.id === "uptime-sla");
    expect(uptime && claimHiddenReason(uptime)).toBe("unverified");
  });
});

test.describe("claim gating (live site)", () => {
  for (const path of PAGES) {
    test(`no claim that does not render shows on ${path}`, async ({ page }) => {
      await page.goto(path);
      // Only rendering claims may carry a claim marker, and statistics stay hidden: no stat claim is verified.
      const marked = await page.locator("[data-claim]").evaluateAll((els) => els.map((e) => e.getAttribute("data-claim")));
      for (const id of marked) expect(RENDERING, `${path} marks the claim "${id}"`).toContain(id);
      await expect(page.getByRole("region", { name: "Service statistics" })).toHaveCount(0);
      const text = (await page.locator("body").innerText()).toLowerCase();
      // Stats and assurances render only through StatsBar and AssuranceStrip. Feature (capability) claims are not wired to page
      // copy yet: the existing draft copy states some capabilities, and the home rebuild will gate them.
      for (const claim of CLAIMS.filter((c) => c.kind !== "feature" && !RENDERING.includes(c.id))) expect(text, `${path} shows "${claim.text}"`).not.toContain(claim.text.toLowerCase());
    });
  }
});
