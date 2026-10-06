import { expect, test } from "@playwright/test";

test.describe("locale routing", () => {
  test("default locale keeps unprefixed URLs and sets lang", async ({ page }) => {
    await page.goto("/pricing");
    await expect(page).toHaveURL(/\/pricing$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "en-US");
    await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
  });

  test("the default locale prefix redirects to the clean URL", async ({ request }) => {
    const res = await request.get("/en-us/pricing", { maxRedirects: 0 });
    expect([307, 308]).toContain(res.status());
    expect(res.headers()["location"]).toMatch(/\/pricing$/);
  });

  test("variants stay unreachable until FEATURES.localeVariants is on", async ({ request }) => {
    expect((await request.get("/en-gb/pricing")).status()).toBe(404);
    expect((await request.get("/en-ae")).status()).toBe(404);
  });

  test("internal links are not prefixed and no language switcher shows with one live locale", async ({ page }) => {
    await page.goto("/");
    const hrefs = await page.locator("a[href^='/']").evaluateAll((els) => els.map((e) => e.getAttribute("href")));
    expect(hrefs.some((h) => h?.startsWith("/en-"))).toBe(false);
    await expect(page.getByRole("navigation", { name: "Language" })).toHaveCount(0);
  });

  test("canonical URL is the unprefixed page and there is no hreflang with one locale", async ({ page }) => {
    await page.goto("/pricing");
    await expect(page.locator("link[rel=canonical]")).toHaveAttribute("href", /dronahost\.com\/pricing$/);
    await expect(page.locator("link[rel=alternate][hreflang]")).toHaveCount(0);
  });

  test("no locale cookie is set", async ({ page, context }) => {
    await page.goto("/");
    expect((await context.cookies()).some((c) => c.name === "NEXT_LOCALE")).toBe(false);
  });

  test("sitemap lists clean URLs", async ({ request }) => {
    const xml = await (await request.get("/sitemap.xml")).text();
    expect(xml).toContain("/pricing</loc>");
    expect(xml).not.toContain("/en-us/");
  });

  test("404 pages show the branded page for visitors and return a 404 status", async ({ page }) => {
    for (const path of ["/definitely-not-a-page", "/blog/does-not-exist", "/en-gb/pricing"]) {
      const res = await page.goto(path);
      expect(res?.status()).toBe(404);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await expect(page.getByRole("link", { name: "Skip to main content" })).toBeAttached();
    }
  });
});
