import { expect, test } from "@playwright/test";
import pricing from "../../data/pricing.json";
import homeSpec from "../../content/pages/home.json";
import { buildFamilyCards, ADDONS, BACKUP_ADDON } from "../../lib/pricing/plans";

test.describe("pricing.json v3 shape", () => {
  test("every family lists real plans and every plan belongs to one family", () => {
    const ids = new Set(pricing.plans.map((p) => p.id));
    for (const family of pricing.families) {
      for (const id of family.planIds) expect(ids.has(id), `${family.id} -> ${id}`).toBe(true);
      expect(buildFamilyCards(family.id).map((c) => c.id)).toEqual(family.planIds);
    }
    expect(pricing.families.flatMap((f) => f.planIds).sort()).toEqual([...ids].sort());
  });

  test("the home spec only shows plans that exist", () => {
    const plans = homeSpec.sections.find((s) => s.type === "PricingPlans") as { content: { show: string[] } } | undefined;
    const ids = new Set(pricing.plans.map((p) => p.id));
    for (const id of plans?.content.show ?? []) expect(ids.has(id), id).toBe(true);
  });

  test("no plan promises unlimited, and email hosting is not a limit", () => {
    for (const p of pricing.plans) {
      expect(JSON.stringify(p.headlineFeatures).toLowerCase()).not.toContain("unlimited");
      expect(p.limits).not.toHaveProperty("mailboxes");
    }
  });

  test("add-ons come from pricing.json, with offsite backup as one add-on with sizes", () => {
    expect(ADDONS.length).toBeGreaterThan(0);
    expect(BACKUP_ADDON?.tiers.length).toBeGreaterThan(1);
  });
});
