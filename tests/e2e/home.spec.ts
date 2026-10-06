import { expect, test } from "@playwright/test";

const CONSENT = encodeURIComponent(
  JSON.stringify({ preferences: false, analytics: false, marketing: false, id: "00000000-0000-4000-8000-000000000000", at: "2026-01-01T00:00:00.000Z", v: 1 }),
);

test.beforeEach(async ({ context }) => {
  await context.addCookies([{ name: "dh_consent", value: CONSENT, url: "http://localhost:3200" }]);
});

test.describe("home page (rendered from content/pages/home.json)", () => {
  test("has one h1, the primary and secondary actions, and a plain answer-first hero", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Managed WordPress hosting without the technical worry");
    await expect(page.getByRole("link", { name: "See WordPress hosting plans" }).first()).toHaveAttribute("href", "/pricing");
    await expect(page.getByRole("link", { name: "Talk to our team" }).first()).toHaveAttribute("href", "/contact");
  });

  test("shows only what is confirmed: no unverified capability, claim or channel appears", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("[data-claim]")).toHaveCount(0);
    const text = (await page.locator("main").innerText()).toLowerCase();
    // Gated sections and copy stay out until their claims are verified and published.
    for (const hidden of ["where are you starting from", "what we look after", "moving to dronahost", "back up your site", "same price, no increase", "whatsapp", "live chat", "24/7"]) {
      expect(text, `main shows "${hidden}"`).not.toContain(hidden);
    }
    // The neutral fallback lead stands in for the capability lead.
    expect(text).toContain("a team you can talk to");
  });

  test("the sections that are confirmed render, with no empty gaps", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Reach a person when you need one" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Questions before you choose" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Ready to see which plan fits?" })).toBeVisible();
    // Every section on the page has a heading: no section renders empty.
    const sections = await page.locator("main section").evaluateAll((els) => els.map((el) => !!el.querySelector("h1, h2, h3")));
    expect(sections.every(Boolean)).toBe(true);
  });

  test("FAQ answers are in the server HTML and the open state is accessible without JavaScript", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    await context.addCookies([{ name: "dh_consent", value: CONSENT, url: "http://localhost:3200" }]);
    const page = await context.newPage();
    await page.goto("/");
    await expect(page.locator("details")).toHaveCount(3);
    // A closed <details> hides its answer from innerText but the text is in the HTML.
    expect(await page.locator("details").first().textContent()).toContain("Managed WordPress hosting means");
    await context.close();
  });

  test("structured data is Organization and WebSite in the page, with no SearchAction", async ({ page }) => {
    await page.goto("/");
    const blocks = await page.locator('script[type="application/ld+json"]').allInnerTexts();
    const json = blocks.join("\n");
    expect(json).toContain('"Organization"');
    expect(json).toContain('"WebSite"');
    expect(json).not.toContain("SearchAction");
  });

  test("metadata comes from the spec: title, description and a canonical for the home page", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Managed WordPress & VPS Hosting/);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /compare plans and talk to our team/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /dronahost\.com\/?$/);
  });
});
