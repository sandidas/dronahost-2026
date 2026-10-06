import { expect, test } from "@playwright/test";

test.describe("cookie consent", () => {
  test("banner offers reject and accept with equal prominence and stores the choice", async ({ page }) => {
    await page.goto("/");
    const banner = page.getByRole("region", { name: "Cookie consent" });
    await expect(banner).toBeVisible();
    const reject = banner.getByRole("button", { name: "Reject all" });
    const accept = banner.getByRole("button", { name: "Accept all" });
    const [r, a] = await Promise.all([reject.boundingBox(), accept.boundingBox()]);
    expect(r!.width).toBeCloseTo(a!.width, 0);
    expect(r!.height).toBeCloseTo(a!.height, 0);

    await reject.click();
    await expect(banner).toBeHidden();
    const cookie = (await page.context().cookies()).find((c) => c.name === "dh_consent");
    expect(JSON.parse(decodeURIComponent(cookie!.value))).toMatchObject({ analytics: false, marketing: false, preferences: false });
  });

  test("choice persists and can be changed from the footer", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Accept all" }).click();
    await page.reload();
    await expect(page.getByRole("region", { name: "Cookie consent" })).toBeHidden();
    await page.getByRole("button", { name: "Cookie settings" }).click();
    const dialog = page.getByRole("dialog", { name: "Cookie preferences" });
    await expect(dialog).toBeVisible();
    await dialog.getByRole("switch", { name: "Analytics cookies" }).click();
    await dialog.getByRole("button", { name: "Save choices" }).click();
    const cookie = (await page.context().cookies()).find((c) => c.name === "dh_consent");
    expect(JSON.parse(decodeURIComponent(cookie!.value))).toMatchObject({ analytics: false });
  });

  test("no optional third-party script loads before consent", async ({ page }) => {
    const requests: string[] = [];
    page.on("request", (r) => requests.push(r.url()));
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    expect(requests.some((u) => u.includes("googletagmanager.com"))).toBe(false);
  });
});

test("cookie policy lists the consent cookie and reopens the settings dialog", async ({ page }) => {
  await page.goto("/cookie-policy");
  await expect(page.getByRole("heading", { level: 1, name: "Cookie Policy" })).toBeVisible();
  await expect(page.getByRole("cell", { name: "Remembers your cookie choices and a random ID" })).toBeVisible();
  await page.getByRole("main").getByRole("button", { name: "Cookie settings" }).click();
  await expect(page.getByRole("dialog", { name: "Cookie preferences" })).toBeVisible();
});
