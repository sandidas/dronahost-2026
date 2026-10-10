import { expect, test } from "@playwright/test";

test.describe("keyboard and structure", () => {
  test.beforeEach(async ({ page, context }) => {
    // Consent already given, so the banner does not interfere with keyboard and scroll tests.
    const value = encodeURIComponent(JSON.stringify({ preferences: false, analytics: false, marketing: false, id: "00000000-0000-4000-8000-000000000000", at: "2026-01-01T00:00:00.000Z", v: 1 }));
    await context.addCookies([{ name: "dh_consent", value, url: "http://localhost:3200" }]);
    await page.goto("/");
  });

  test("skip link is the first tab stop and moves focus to main", async ({ page }) => {
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Skip to main content" });
    await expect(skip).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.locator("#main-content")).toBeFocused();
  });

  test("mega menu opens with the keyboard and closes with Escape", async ({ page }) => {
    const trigger = page.getByRole("button", { name: "Hosting", exact: true });
    await trigger.focus();
    await page.keyboard.press("Enter");
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await page.keyboard.press("Escape");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  test("tablets show the primary links and the action, not a hamburger; a tap opens the mega menu", async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 834, height: 1112 }, hasTouch: true });
    const page = await context.newPage();
    await page.goto("/");
    await expect(page.getByRole("navigation", { name: "Primary" })).toBeVisible();
    await expect(page.getByRole("link", { name: "View plans" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Open navigation menu" })).toBeHidden();
    const trigger = page.getByRole("button", { name: "Hosting", exact: true });
    await trigger.tap();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator("#hosting-mega-menu")).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBe(0);
    await context.close();
  });

  test("phones keep the drawer", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 800 });
    await expect(page.getByRole("navigation", { name: "Primary" })).toBeHidden();
    await page.getByRole("button", { name: "Open navigation menu" }).click();
    await expect(page.getByRole("dialog", { name: "Navigation menu" })).toBeVisible();
  });

  test("each page has exactly one h1", async ({ page }) => {
    for (const path of ["/", "/pricing", "/contact", "/terms", "/blog"]) {
      await page.goto(path);
      await expect(page.locator("h1")).toHaveCount(1);
    }
  });

  test("legal pages show breadcrumbs, last-updated date and a table of contents", async ({ page }) => {
    await page.goto("/terms");
    await expect(page.getByRole("navigation", { name: "Breadcrumb" })).toBeVisible();
    await expect(page.getByText(/Last updated:/)).toBeVisible();
    await expect(page.getByRole("navigation", { name: "On this page" })).toBeVisible();
  });

  test("sticky mobile CTA appears after scrolling on phones only", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 800 });
    await page.goto("/about");
    const cta = page.locator(".sticky-cta");
    await expect(cta).toHaveAttribute("data-shown", "false");
    await page.mouse.wheel(0, 1200);
    await expect(cta).toHaveAttribute("data-shown", "true");
    await page.setViewportSize({ width: 1280, height: 800 });
    await expect(cta).toBeHidden();
  });

  test("unknown route returns a real 404", async ({ request }) => {
    expect((await request.get("/definitely-not-a-page")).status()).toBe(404);
  });
});
