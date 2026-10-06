import { expect, test } from "@playwright/test";

const PAGES = ["/", "/pricing", "/wordpress-hosting", "/contact"];
const CONSENT = encodeURIComponent(
  JSON.stringify({ preferences: false, analytics: false, marketing: false, id: "00000000-0000-4000-8000-000000000000", at: "2026-01-01T00:00:00.000Z", v: 1 }),
);

test.beforeEach(async ({ context }) => {
  await context.addCookies([{ name: "dh_consent", value: CONSENT, url: "http://localhost:3200" }]);
});

test.describe("motion budgets", () => {
  for (const width of [390, 820, 1440]) {
    test(`no horizontal scroll at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      for (const path of PAGES) {
        await page.goto(path);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        expect(overflow, `${path} at ${width}`).toBeLessThanOrEqual(0);
      }
    });
  }

  test("everything is visible with JavaScript disabled", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    await context.addCookies([{ name: "dh_consent", value: CONSENT, url: "http://localhost:3200" }]);
    const page = await context.newPage();
    for (const path of PAGES) {
      await page.goto(path);
      const hidden = await page.evaluate(() =>
        [...document.querySelectorAll("[data-reveal]")].filter((el) => getComputedStyle(el).opacity !== "1").length,
      );
      expect(hidden, `${path}: reveal elements hidden without JS`).toBe(0);
    }
    await context.close();
  });

  test("reduced motion arms nothing and leaves no transforms in flight", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const path of PAGES) {
      await page.goto(path);
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(150);
      const state = await page.evaluate(() => ({
        armed: document.querySelectorAll(".reveal-armed").length,
        animations: document.getAnimations().filter((a) => a.playState === "running" && (a.effect?.getComputedTiming().iterations ?? 1) === Infinity).length,
      }));
      expect(state.armed, `${path}: armed elements`).toBe(0);
      expect(state.animations, `${path}: infinite animations`).toBe(0);
    }
  });

  test("reveal plays once: below-fold cards fade in after scrolling, above-fold never armed", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    const aboveFold = await page.evaluate(() =>
      [...document.querySelectorAll(".reveal-armed")].filter((el) => el.getBoundingClientRect().top < window.innerHeight).length,
    );
    expect(aboveFold).toBe(0);
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 500) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 100));
      }
      window.scrollTo(0, document.body.scrollHeight);
    });
    await expect.poll(() => page.locator(".reveal-armed:not(.is-in)").count(), { timeout: 5000 }).toBe(0);
  });

  for (const path of PAGES) {
    test(`layout shift stays under 0.05 on ${path}`, async ({ page }) => {
      await page.addInitScript(() => {
        (window as unknown as { __cls: number }).__cls = 0;
        new PerformanceObserver((list) => {
          for (const e of list.getEntries() as unknown as { value: number; hadRecentInput: boolean }[]) {
            if (!e.hadRecentInput) (window as unknown as { __cls: number }).__cls += e.value;
          }
        }).observe({ type: "layout-shift", buffered: true });
      });
      await page.goto(path);
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 600) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 120));
        }
      });
      const cls = await page.evaluate(() => (window as unknown as { __cls: number }).__cls);
      expect(cls).toBeLessThan(0.05);
    });
  }
});
