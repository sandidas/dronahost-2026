import { expect, test } from "@playwright/test";

// Runs only against a build made with FEATURES.localeVariants = true:  E2E_VARIANTS=1 npm run test:e2e
test.skip(!process.env.E2E_VARIANTS, "locale variants are off in this build");

test.describe("locale variants (live)", () => {
  test("variant pages render with their own lang, canonical and hreflang set", async ({ page }) => {
    const res = await page.goto("/en-gb/pricing");
    expect(res?.status()).toBe(200);
    await expect(page.locator("html")).toHaveAttribute("lang", "en-GB");
    await expect(page.locator("link[rel=canonical]")).toHaveAttribute("href", /\/en-gb\/pricing$/);
    const langs = await page.locator("link[rel=alternate][hreflang]").evaluateAll((els) => els.map((e) => e.getAttribute("hreflang")));
    expect(langs).toEqual(expect.arrayContaining(["en-US", "en-GB", "en-AE", "x-default"]));
  });

  test("internal links keep the visitor in their locale", async ({ page }) => {
    await page.goto("/en-gb/about");
    const hrefs = await page.locator("main a[href^='/']").evaluateAll((els) => els.map((e) => e.getAttribute("href") ?? ""));
    expect(hrefs.length).toBeGreaterThan(0);
    expect(hrefs.every((h) => h.startsWith("/en-gb"))).toBe(true);
  });

  test("language switcher links to the same page in each locale", async ({ page }) => {
    await page.goto("/pricing");
    const nav = page.getByRole("navigation", { name: "Language" });
    await expect(nav.getByRole("link", { name: /UK/ })).toHaveAttribute("href", "/en-gb/pricing");
    await expect(nav.getByRole("link", { name: /US/ })).toHaveAttribute("aria-current", "true");
  });

  test("sitemap lists every live locale with alternates", async ({ request }) => {
    const xml = await (await request.get("/sitemap.xml")).text();
    expect(xml).toContain("/en-gb/pricing</loc>");
    expect(xml).toContain('hreflang="en-AE"');
  });
});
