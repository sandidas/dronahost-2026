import { chromium } from "playwright";
const OUT = "docs/reference/after/review-1";
const BASE = process.argv[2] ?? "http://localhost:3001";
(async () => {
  const b = await chromium.launch();
  // component sections (dark + light) from the showcase
  for (const theme of ["dark", "light"] as const) {
    const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
    await ctx.addInitScript((t) => localStorage.setItem("theme", t), theme);
    const p = await ctx.newPage();
    await p.goto(`${BASE}/v2`, { waitUntil: "networkidle" });
    await p.waitForTimeout(800);
    for (const id of ["buttons", "stats-bar", "faq", "product-hero", "split-hero", "pricing-plans"]) {
      const el = p.locator(`#${id}`);
      await el.scrollIntoViewIfNeeded();
      await p.waitForTimeout(500);
      await el.screenshot({ path: `${OUT}/${id}-${theme}.png` });
    }
    await ctx.close();
  }
  // nav: header, mega menu, drawer, announcement bar, footer at 1440 and 390 (dark)
  for (const [w, h] of [[1440, 900], [390, 844]] as const) {
    const ctx = await b.newContext({ viewport: { width: w, height: h } });
    const p = await ctx.newPage();
    await p.goto(`${BASE}/`, { waitUntil: "networkidle" });
    await p.waitForTimeout(800);
    await p.screenshot({ path: `${OUT}/header-${w}.png` });
    if (w >= 1024) {
      await p.getByRole("button", { name: "Hosting", exact: true }).hover();
      await p.waitForTimeout(400);
      await p.screenshot({ path: `${OUT}/megamenu-${w}.png` });
    } else {
      await p.getByRole("button", { name: "Open navigation menu" }).click();
      await p.waitForTimeout(500);
      await p.screenshot({ path: `${OUT}/drawer-${w}.png` });
    }
    await ctx.close();
    const c2 = await b.newContext({ viewport: { width: w, height: h } });
    const q = await c2.newPage();
    await q.goto(`${BASE}/v2#announcement-bar`, { waitUntil: "networkidle" });
    await q.waitForTimeout(800);
    await q.locator("#announcement-bar").screenshot({ path: `${OUT}/announcement-${w}.png` });
    await q.goto(`${BASE}/`, { waitUntil: "networkidle" });
    await q.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await q.waitForTimeout(700);
    await q.screenshot({ path: `${OUT}/footer-${w}.png` });
    await c2.close();
  }
  await b.close();
})();
