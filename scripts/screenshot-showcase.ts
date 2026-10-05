/**
 * Screenshots of /v2 showcase sections by id. Usage: tsx scripts/screenshot-showcase.ts <outDir> <id> [<id> ...]
 */
import { chromium } from "playwright";

const [OUT = "docs/reference/after/showcase", ...ids] = process.argv.slice(2);
(async () => {
  const b = await chromium.launch();
  for (const [w, h] of [[1440, 900], [390, 844]] as const) {
    for (const theme of ["dark", "light"]) {
      const ctx = await b.newContext({ viewport: { width: w, height: h } });
      const p = await ctx.newPage();
      await p.addInitScript((t) => localStorage.setItem("theme", t), theme);
      await p.goto("http://localhost:3001/v2", { waitUntil: "networkidle" });
      for (const id of ids) {
        const el = p.locator(`#${id}`);
        await el.scrollIntoViewIfNeeded();
        await p.waitForTimeout(300);
        await el.screenshot({ path: `${OUT}/${id}-${theme}-${w}.png` });
      }
      console.log(theme, w, "overflow", await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth));
      await ctx.close();
    }
  }
  await b.close();
})();
