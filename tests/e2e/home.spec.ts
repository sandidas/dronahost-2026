import { expect, test } from "@playwright/test";
import { isVerified } from "../../content/claims";

const CONSENT = encodeURIComponent(
  JSON.stringify({ preferences: false, analytics: false, marketing: false, id: "00000000-0000-4000-8000-000000000000", at: "2026-01-01T00:00:00.000Z", v: 1 }),
);

test.beforeEach(async ({ context }) => {
  await context.addCookies([{ name: "dh_consent", value: CONSENT, url: "http://localhost:3200" }]);
});

/** The brand home page (blueprint C1, decisions 58 and 59), rendered from content/pages/home.json. */
test.describe("home page (rendered from content/pages/home.json)", () => {
  test("has one h1, the entity sentence and the migration form as the first action", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Hosting engineered for businesses that cannot afford to stop");
    const text = (await page.locator("main").innerText()).toLowerCase();
    expect(text).toContain("dronahost is a managed wordpress hosting and web services company");
    // No form on Home (owner, 2026-10-10): the hero action goes to the migration section.
    await expect(page.locator("main form")).toHaveCount(0);
    // The console visual says it is an example.
    await expect(page.getByText("Example of a migration in progress")).toBeVisible();
  });

  test("shows no price anywhere on the page (prices appear only on /pricing)", async ({ page }) => {
    await page.goto("/");
    const text = await page.locator("main").innerText();
    expect(text).not.toMatch(/[$£€₹]\s?\d/);
    expect(text.toLowerCase()).not.toContain("/month");
    await expect(page.getByRole("link", { name: "View plans and pricing" }).first()).toHaveAttribute("href", "/pricing");
  });

  test("never names the owner or calls the company a small team", async ({ page }) => {
    await page.goto("/");
    const text = (await page.locator("body").innerText()).toLowerCase();
    for (const banned of ["sandipan", "small team", "focused team"]) expect(text, `page says "${banned}"`).not.toContain(banned);
  });

  test("shows only what is confirmed: no unverified capability, retired channel or invented proof", async ({ page }) => {
    await page.goto("/");
    const text = (await page.locator("main").innerText()).toLowerCase();
    for (const hidden of ["whatsapp", "live chat", "litespeed", "nvme", "[sample]", "sample person", "trusted by"]) {
      expect(text, `main shows "${hidden}"`).not.toContain(hidden);
    }
    // Where we are based is said on /about only (decision 34). The GST line names India as a tax rule, which is fine.
    expect(text.replace(/customers in india pay gst/g, "")).not.toMatch(/india|based in/);
  });

  test("the brand sections render, and each advantage links to the policy behind it", async ({ page }) => {
    await page.goto("/");
    for (const name of ["Engineered for growth", "Everything your website needs, from one provider", "One ecosystem for every part of your online business", "Real support from real people", "Questions before you move", "Your website deserves better hosting"]) {
      await expect(page.getByRole("heading", { name: new RegExp(name) }).first()).toBeVisible();
    }
    const adv = page.locator("section", { has: page.getByRole("heading", { name: /Engineered for growth/ }) });
    await expect(adv.getByRole("link", { name: "Read the SLA" })).toHaveAttribute("href", "/sla");
    await expect(adv.getByRole("link", { name: "Read the refund policy" })).toHaveAttribute("href", "/refund-policy");
    await expect(adv.getByRole("link", { name: "Read how renewals work" })).toHaveAttribute("href", "/pricing-policy");
    // Until SUPPORT_PHOTO is set (content/team.ts), the support section shows its illustration. It never names anyone.
    const support = page.locator("section", { has: page.getByRole("heading", { name: /Real support from real people/ }) });
    await expect(support.locator("img")).toHaveCount(0);
    await expect(support.getByText("Illustration of a support ticket answered in writing")).toBeVisible();
    // The verified case study shows in production; unverified reviews stay hidden until they pass data/reviews.json's rules.
    const reviews = page.locator("section", { has: page.getByRole("heading", { name: "What businesses say after the move" }) });
    await expect(reviews.getByRole("heading", { name: /Mary Jane's CBD Dispensary/ })).toBeVisible();
    await expect(reviews.getByRole("img", { name: /mjcbdd\.com/ })).toBeVisible();
    // No status labels anywhere on the page (docs/rules/ui-ux-rules.md §3.7).
    await expect(page.getByText(/unverified|sample data|hidden in production/i)).toHaveCount(0);
    // Every section on the page has a heading or a labelled region: no section renders empty.
    const sections = await page.locator("main section").evaluateAll((els) => els.map((el) => !!el.querySelector("h1, h2, h3") || el.hasAttribute("aria-label")));
    expect(sections.every(Boolean)).toBe(true);
  });

  test("the migration section has no form and sends the reader to the client area", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: "Plan my migration" }).first()).toHaveAttribute("href", "/#plan");
    const plan = page.locator("#plan");
    await expect(plan.locator("form, input")).toHaveCount(0);
    await expect(plan.getByRole("link", { name: /Plan my migration/ })).toHaveAttribute("href", "https://my.dronahost.com");
  });

  test("the header offers the client login", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: "Client login" }).first()).toHaveAttribute("href", "https://my.dronahost.com");
  });

  test("FAQ answers are in the server HTML without JavaScript, including the login and support answers", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    await context.addCookies([{ name: "dh_consent", value: CONSENT, url: "http://localhost:3200" }]);
    const page = await context.newPage();
    await page.goto("/");
    await expect(page.locator("details")).toHaveCount(7);
    const all = (await page.locator("details").allTextContents()).join(" ");
    expect(all).toContain("my.dronahost.com");
    expect(all).toContain("support@dronahost.com");
    await context.close();
  });

  test("structured data is Organization and WebSite in the page, with no SearchAction", async ({ page }) => {
    await page.goto("/");
    const json = (await page.locator('script[type="application/ld+json"]').allInnerTexts()).join("\n");
    expect(json).toContain('"Organization"');
    expect(json).toContain('"WebSite"');
    expect(json).not.toContain("SearchAction");
  });

  test("metadata comes from the spec: title, description and a canonical for the home page", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Managed WordPress Hosting and Web Services \| DronaHost/);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /DronaHost is a managed WordPress hosting and web services company/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /dronahost\.com\/?$/);
  });

  test("the advantages the page states are verified claims", () => {
    for (const id of ["uptime-sla", "support-24-7", "renewal-price-same", "money-back", "free-migration"]) expect(isVerified(id), id).toBe(true);
  });
});
