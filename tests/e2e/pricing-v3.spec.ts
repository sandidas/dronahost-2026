import { expect, test } from "@playwright/test";
import pricing from "../../data/pricing.json";
import homeSpec from "../../content/pages/home.json";
import wpSpec from "../../content/pages/wordpress-hosting.json";
import { buildPlanComparison } from "../../lib/pricing/compare";
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

/** Every string in pricing.json that a page can show. `_meta`, `internal`, `notes` and `$comment` never render. */
function renderedStrings(): string[] {
  const out: string[] = [];
  for (const p of pricing.plans) out.push(p.name, p.description, p.badge ?? "", p.bestFor, p.cta.label, ...p.headlineFeatures, ...p.extras, p.support.tier);
  for (const a of pricing.addons) {
    out.push(a.name, a.description);
    if ("options" in a && a.options) out.push(...a.options.map((o) => o.label));
  }
  for (const i of pricing.includedWithEveryPlan) out.push(i.label, i.detail);
  for (const f of pricing.families) out.push(f.label, f.description);
  out.push(pricing.highTraffic.name, pricing.highTraffic.description, pricing.highTraffic.cta.label);
  return out.filter(Boolean);
}

const near = (a: number, b: number) => Math.abs(a - b) < 0.005;

test.describe("pricing.json guard", () => {
  test("every plan id named by an add-on exists, and no plan is both available and included", () => {
    const ids = new Set(pricing.plans.map((p) => p.id));
    for (const a of pricing.addons) {
      for (const id of [...a.availableOn, ...a.includedOn]) expect(ids.has(id), `${a.id} -> ${id}`).toBe(true);
      expect(a.availableOn.filter((id) => (a.includedOn as string[]).includes(id)), a.id).toEqual([]);
    }
  });

  test("annual totals, discounts and renewal prices agree with the plan prices", () => {
    for (const p of pricing.plans) {
      const { monthly, annual, renewal, renewalMonthlyCycle, annualBilledTotal, annualDiscountPercent } = p.pricing;
      if (annual.USD == null || monthly.USD == null) continue;
      expect(near(annualBilledTotal.USD, Math.round(annual.USD * 12 * 100) / 100), `${p.id} annual total`).toBe(true);
      expect(annualDiscountPercent, `${p.id} discount`).toBe(Math.round(((monthly.USD - annual.USD) / monthly.USD) * 100));
      expect(renewal.USD, `${p.id} annual renewal`).toBe(annual.USD);
      expect(renewalMonthlyCycle.USD, `${p.id} monthly renewal`).toBe(monthly.USD);
    }
  });

  test("the annual savings sentence matches the discounts", () => {
    const pcts = pricing.plans.map((p) => p.pricing.annualDiscountPercent);
    expect(pricing._meta.annualSavings).toContain(`${Math.min(...pcts)}% to ${Math.max(...pcts)}%`);
  });

  test("PHP upload size never exceeds the post size", () => {
    for (const p of pricing.plans) expect(p.php.uploadMaxFilesizeMB, p.id).toBeLessThanOrEqual(p.php.postMaxSizeMB);
  });

  test("fair use is explicit: only limits.fairUse makes a null limit fair use", () => {
    const allowed = ["sites", "domains", "databases", "bandwidth"];
    for (const p of pricing.plans) {
      const fair = p.limits.fairUse as readonly string[];
      for (const key of fair) expect(allowed, `${p.id} fairUse ${key}`).toContain(key);
      // A listed limit holds no number; a null count that is not listed is "not set" and renders nothing.
      for (const key of ["sites", "domains", "databases"] as const) if (fair.includes(key)) expect(p.limits[key], `${p.id} ${key}`).toBeNull();
      if (fair.includes("bandwidth")) expect(p.internal.bandwidthGB, `${p.id} bandwidth`).toBeNull();
      expect(p.limits, p.id).not.toHaveProperty("trafficGB");
    }
  });

  test("headline features state only what the plan's own data says", () => {
    for (const p of pricing.plans) {
      const text = p.headlineFeatures.join(" | ").toLowerCase();
      const { sites, diskSpaceGB, ramGB, cpuCores } = p.limits;
      if (sites != null) expect(text, p.id).toContain(`${sites} website`);
      else expect(text, p.id).toContain("websites under fair use");
      expect(text, p.id).toContain(`${diskSpaceGB} gb`);
      expect(text, p.id).toContain(`${ramGB} gb memory, ${cpuCores} cpu cores`);
      if (text.includes("priority support")) expect(p.capabilities.prioritySupportQueue, p.id).toBe(true);
      if (text.includes("performance tuning")) expect(p.capabilities.performanceTuning, p.id).toBe(true);
      if (text.includes("semi-dedicated")) expect(p.limits.resourceType, p.id).toBe("semi-dedicated");
      else if (text.includes("dedicated resources")) expect(p.limits.resourceType, p.id).toBe("dedicated");
      if (text.includes("latest copy kept")) expect(p.limits.backupRetentionDays, p.id).toBe(1);
      for (const word of ["redis", "object cache", "woocommerce"]) expect(text, `${p.id} ${word}`).not.toContain(word);
    }
  });

  test("no rendered string says Unlimited or holds a placeholder", () => {
    for (const s of renderedStrings()) {
      expect(s.toLowerCase(), s).not.toContain("unlimited");
      expect(s.toLowerCase(), s).not.toContain("to be described");
      expect(s, s).not.toMatch(/cpanel/i);
    }
  });

  test("product pages show the whole lineup: a PricingPlans spec lists every plan (decision 73)", () => {
    const ids = pricing.plans.map((p) => p.id);
    for (const spec of [wpSpec, homeSpec]) {
      const plans = spec.sections.find((s) => s.type === "PricingPlans") as { content: { show: string[] } } | undefined;
      if (plans) expect(plans.content.show, spec.path).toEqual(ids);
    }
  });

  test("the comparison's add-on rows follow includedOn and availableOn", () => {
    const { groups } = buildPlanComparison();
    const addons = groups.find((g) => g.title === "Add-ons");
    expect(addons?.rows.length).toBe(pricing.addons.length);
    for (const a of pricing.addons) {
      const row = addons?.rows.find((r) => r.label === a.name);
      for (const p of pricing.plans) {
        const v = row?.values[p.id];
        if ((a.includedOn as string[]).includes(p.id)) expect(v, `${a.id} ${p.id}`).toBe("Included");
        else if ((a.availableOn as string[]).includes(p.id)) {
          const usd = typeof v === "object" && v ? v.amounts.USD : v;
          expect(String(usd), `${a.id} ${p.id}`).toMatch(/^(\+|From )\$[\d.]+\/month$|^Available$/);
        }
        else expect(v, `${a.id} ${p.id}`).toBe(false);
      }
    }
  });

  test("every currency stores every price, never below the fixed rate, with renewal equal to signup", () => {
    const currencies = Object.entries(pricing.currencies).filter(([code]) => code !== "USD") as [keyof typeof pricing.currencies, { rateFromUSD?: number }][];
    expect(currencies.length).toBeGreaterThan(0);
    const check = (usd: number | null | undefined, local: number | null | undefined, rate: number, label: string) => {
      if (usd == null) return expect(local ?? null, label).toBeNull();
      expect(typeof local, label).toBe("number");
      // Rounded up from the rate: at or above usd x rate, and less than one unit above it.
      expect(local as number, label).toBeGreaterThanOrEqual(usd * rate - 0.005);
      expect(local as number, label).toBeLessThan(usd * rate + 1);
    };
    for (const [code, meta] of currencies) {
      const rate = meta.rateFromUSD;
      expect(rate, `${code} rate`).toBeGreaterThan(0);
      for (const p of pricing.plans) {
        const pr = p.pricing;
        check(pr.annual.USD, pr.annual[code], rate as number, `${p.id} ${code} annual`);
        check(pr.monthly.USD, pr.monthly[code], rate as number, `${p.id} ${code} monthly`);
        expect(pr.renewal[code], `${p.id} ${code} renewal`).toBe(pr.annual[code]);
        expect(pr.renewalMonthlyCycle[code], `${p.id} ${code} monthly renewal`).toBe(pr.monthly[code]);
        const annual = pr.annual[code];
        if (annual != null) expect(near(pr.annualBilledTotal[code] as number, Math.round(annual * 12 * 100) / 100), `${p.id} ${code} total`).toBe(true);
      }
      for (const a of pricing.addons) {
        const blocks = "options" in a && a.options ? a.options.map((o) => o.pricing.monthly) : "pricing" in a && a.pricing ? [a.pricing.monthly] : [];
        for (const b of blocks) check(b.USD, (b as Record<string, number | undefined>)[code], rate as number, `${a.id} ${code}`);
      }
    }
  });
});
