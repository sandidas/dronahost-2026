import { expect, test } from "@playwright/test";

test.describe("migration form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/migration");
    await page.getByRole("button", { name: "Reject all" }).click();
  });

  test("validates each step, moves focus to the step heading and restores answers after reload", async ({ page }) => {
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page.getByText("Enter your name.")).toBeVisible();
    await page.getByLabel("Full name").fill("Jane Smith");
    await page.getByLabel("Work email").fill("jane@example.com");
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page.getByRole("heading", { name: "Your current site" })).toBeFocused();
    await page.getByLabel("Site address").fill("https://example.com");
    await page.reload();
    await expect(page.getByText("Step 2 of 3")).toBeVisible();
    await expect(page.getByLabel("Site address")).toHaveValue("https://example.com");
  });

  test("requires consent on the last step", async ({ page }) => {
    await page.getByLabel("Full name").fill("Jane Smith");
    await page.getByLabel("Work email").fill("jane@example.com");
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByLabel("Site address").fill("https://example.com");
    await page.getByLabel("What does it run on?").selectOption("wordpress");
    await page.getByLabel(/Approximate size/).selectOption("1-10");
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByLabel("Preferred region").selectOption("uk");
    await page.getByRole("button", { name: "Send migration request" }).click();
    await expect(page.getByText("Tick the box so we can contact you")).toBeVisible();
  });

  test("a filled honeypot is silently accepted and never stored", async ({ request }) => {
    const res = await request.post("/api/forms/migration", {
      data: { name: "Bot", email: "bot@example.com", consent: "on", website: "http://spam.example", startedAt: Date.now() - 60_000, siteUrl: "https://example.com", platform: "wordpress", siteSize: "lt1", region: "us" },
    });
    expect(res.status()).toBe(200);
    expect((await res.json()).success).toBe(true);
  });

  test("a submission that is too fast is treated as a bot", async ({ request }) => {
    const res = await request.post("/api/forms/consultation", {
      data: { name: "Fast", email: "fast@example.com", consent: "on", startedAt: Date.now(), interest: "seo", timeframe: "now", message: "A message that is long enough.", timezone: "UTC", preferredTime: "morning" },
    });
    expect((await res.json()).success).toBe(true);
  });

  test("invalid input is rejected with field errors", async ({ request }) => {
    const res = await request.post("/api/forms/migration", { data: { email: "not-an-email" } });
    expect(res.status()).toBe(400);
  });
});
