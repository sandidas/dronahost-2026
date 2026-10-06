import { expect, test } from "@playwright/test";

const CONSENT = encodeURIComponent(
  JSON.stringify({ preferences: false, analytics: false, marketing: false, id: "00000000-0000-4000-8000-000000000000", at: "2026-01-01T00:00:00.000Z", v: 1 }),
);

test.beforeEach(async ({ context }) => {
  await context.addCookies([{ name: "dh_consent", value: CONSENT, url: "http://localhost:3200" }]);
});

const isDark = (page: import("@playwright/test").Page) => page.evaluate(() => document.documentElement.classList.contains("dark"));

test.describe("theme", () => {
  test("a system that prefers dark gets dark", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/");
    expect(await isDark(page)).toBe(true);
  });

  test("a system that prefers light gets light", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");
    expect(await isDark(page)).toBe(false);
  });

  test("the server HTML is dark, the fallback with no JavaScript", async ({ request }) => {
    const html = await (await request.get("/")).text();
    expect(html).toMatch(/<html[^>]*class="[^"]*\bdark\b/);
  });

  test("the toggle overrides the system preference and persists across reloads", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");
    expect(await isDark(page)).toBe(false);
    await page.getByRole("button", { name: "Switch to dark theme" }).first().click();
    await expect.poll(() => isDark(page)).toBe(true);
    await page.reload();
    expect(await isDark(page)).toBe(true);
    expect(await page.evaluate(() => localStorage.getItem("theme"))).toBe("dark");
  });

  test("no flash: the theme is already final at the first paint", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.addInitScript(() => {
      const w = window as unknown as { __states: [number, boolean][]; __firstPaint: number };
      w.__states = [];
      w.__firstPaint = Infinity;
      // `document.documentElement` does not exist yet when an init script runs, so observe the document itself.
      new MutationObserver((records) => {
        if (records.some((r) => r.target === document.documentElement)) w.__states.push([performance.now(), document.documentElement.classList.contains("dark")]);
      }).observe(document, { attributes: true, attributeFilter: ["class"], subtree: true });
      new PerformanceObserver((list) => {
        for (const e of list.getEntries()) if (e.name === "first-paint") w.__firstPaint = e.startTime;
      }).observe({ type: "paint", buffered: true });
    });
    await page.goto("/");
    await page.waitForTimeout(400);
    const r = await page.evaluate(() => {
      const w = window as unknown as { __states: [number, boolean][]; __firstPaint: number };
      const finalDark = document.documentElement.classList.contains("dark");
      const beforePaint = w.__states.filter(([t]) => t <= w.__firstPaint);
      const afterPaint = w.__states.filter(([t]) => t > w.__firstPaint);
      return {
        finalDark,
        firstPaint: w.__firstPaint,
        lastStateBeforePaint: beforePaint.at(-1)?.[1],
        flipsAfterPaint: afterPaint.filter(([, dark]) => dark !== finalDark).length,
      };
    });
    expect(r.firstPaint).toBeLessThan(Infinity);
    expect(r.finalDark).toBe(false);
    // Resolved to light before the first paint, and never flipped afterwards (re-applying the same class is not a flash).
    expect(r.lastStateBeforePaint).toBe(false);
    expect(r.flipsAfterPaint).toBe(0);
  });
});
