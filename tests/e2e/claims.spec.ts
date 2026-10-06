import { expect, test } from "@playwright/test";
import { CLAIMS, claimHiddenReason, claimRenders, claimsMissingTermsPage, claimsWithDraftTermsPage } from "../../content/claims";

const PAGES = ["/", "/pricing", "/wordpress-hosting", "/about", "/contact"];

test.describe("claim gating (logic)", () => {
  test("a claim renders only when verified AND its terms page is published", () => {
    const published = { termsPage: "/refund-policy", termsPageStatus: "published" } as const;
    expect(claimRenders({ status: "verified", ...published })).toBe(true);
    expect(claimRenders({ status: "verified", termsPage: "/refund-policy", termsPageStatus: "draft" })).toBe(false);
    expect(claimRenders({ status: "verified", termsPage: null, termsPageStatus: "published" })).toBe(false);
    expect(claimRenders({ status: "unverified", ...published })).toBe(false);
  });

  test("today no claim in the registry may render", () => {
    expect(CLAIMS.filter((c) => c.verified).map((c) => c.id)).toEqual([]);
  });

  test("hidden reasons match the registry", () => {
    const money = CLAIMS.find((c) => c.id === "money-back");
    expect(money && claimHiddenReason(money)).toBe("terms page is a draft");
    expect(claimsWithDraftTermsPage().map((c) => c.id)).toEqual(["money-back"]);
    expect(claimsMissingTermsPage().map((c) => c.id).sort()).toEqual(["free-migration", "renewal-price-same", "support-24-7"]);
    const uptime = CLAIMS.find((c) => c.id === "uptime-sla");
    expect(uptime && claimHiddenReason(uptime)).toBe("unverified");
  });
});

test.describe("claim gating (live site)", () => {
  for (const path of PAGES) {
    test(`no claim renders on ${path}`, async ({ page }) => {
      await page.goto(path);
      await expect(page.locator("[data-claim]")).toHaveCount(0);
      await expect(page.getByRole("region", { name: "Service statistics" })).toHaveCount(0);
      await expect(page.getByRole("region", { name: "Our commitments" })).toHaveCount(0);
      const text = (await page.locator("body").innerText()).toLowerCase();
      // Stats and assurances render only through StatsBar and AssuranceStrip. Feature (capability) claims are not wired to page
      // copy yet: the existing draft copy states some capabilities, and the home rebuild will gate them.
      for (const claim of CLAIMS.filter((c) => c.kind !== "feature")) expect(text, `${path} shows "${claim.text}"`).not.toContain(claim.text.toLowerCase());
    });
  }
});
