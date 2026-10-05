import { chromium } from "playwright";
const OUT = "docs/reference/after/batch-a";
const BASE = "http://localhost:3001";
(async () => {
  const b = await chromium.launch();
  for (const [w, h, tag] of [[1440, 900, "1440"], [390, 844, "390"]] as const) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
    const p = await ctx.newPage();
    await p.goto(BASE + "/", { waitUntil: "networkidle" });
    await p.waitForTimeout(800);
    await p.screenshot({ path: `${OUT}/header-${tag}.png` });
    if (w >= 1024) {
      await p.getByRole("button", { name: "Hosting", exact: true }).hover();
      await p.waitForTimeout(400);
      await p.screenshot({ path: `${OUT}/megamenu-${tag}.png` });
      await p.mouse.move(700, 600);
      await p.keyboard.press("Escape");
    } else {
      await p.getByRole("button", { name: "Open navigation menu" }).click();
      await p.waitForTimeout(500);
      await p.screenshot({ path: `${OUT}/drawer-${tag}.png` });
      await p.getByRole("button", { name: "Close navigation menu" }).click();
      await p.waitForTimeout(400);
    }
    await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await p.waitForTimeout(600);
    await p.screenshot({ path: `${OUT}/footer-${tag}.png` });
    const overflow = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    console.log(tag, "overflow", overflow);
    await ctx.close();
  }
  await b.close();
})();
