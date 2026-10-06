import { expect, test } from "@playwright/test";
import pricing from "../../data/pricing.json";
import { isVerified } from "../../content/claims";
import { buildPlanCards } from "../../lib/pricing/plans";
import { RENEWAL_PROMISE, renewalLine } from "../../lib/pricing/renewal";

test.describe("renewal line", () => {
  test("the renewal price always shows; the promise wording is gated", () => {
    // Promise hidden (claim not rendering): price only.
    expect(renewalLine("$19.99", { promiseVisible: false, sameAsSignup: true })).toBe("Renews at $19.99/month");
    // Promise visible (claim rendering) and the data agrees: price plus the promise.
    expect(renewalLine("$19.99", { promiseVisible: true, sameAsSignup: true })).toBe(`Renews at $19.99/month — ${RENEWAL_PROMISE}`);
    // Promise visible but the data says the price changes: never promise it.
    expect(renewalLine("$24.99", { promiseVisible: true, sameAsSignup: false })).toBe("Renews at $24.99/month");
    // No renewal price (custom plan): nothing.
    expect(renewalLine(null, { promiseVisible: true, sameAsSignup: true })).toBeNull();
  });

  test("every priced plan has an explicit renewal price in pricing.json (not derived from signup)", () => {
    for (const plan of pricing.plans) {
      if (plan.pricing.annual.USD == null) continue;
      expect(plan.pricing.renewal.USD, `${plan.id} renewal`).not.toBeNull();
    }
    const cards = buildPlanCards();
    for (const card of cards.filter((c) => !c.custom)) {
      expect(card.renewal, `${card.id} card renewal`).toMatch(/^\$[\d,.]+$/);
    }
  });

  test("the renewal-price-same claim does not render today, so the promise is hidden", () => {
    expect(isVerified("renewal-price-same")).toBe(false);
  });

  for (const path of ["/pricing", "/wordpress-hosting"]) {
    test(`the live ${path} never shows the promise wording while the claim is hidden`, async ({ page }) => {
      await page.goto(path);
      const text = (await page.locator("body").innerText()).toLowerCase();
      expect(text).not.toContain(RENEWAL_PROMISE);
    });
  }
});
