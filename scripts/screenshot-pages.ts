/**
 * Full-page screenshots of routes in dark + light at 1440 and 390, with overflow and H1 checks.
 * Usage: tsx scripts/screenshot-pages.ts <outDir> <route:name> [<route:name> ...]
 */
import { chromium } from "playwright";

const [OUT = "docs/reference/after/pages", ...specs] = process.argv.slice(2);
const BASE = "http://localhost:3001";

(async () => {
  const b = await chromium.launch();
  for (const [w, h] of [[1440, 900], [390, 844]] as const) {
    for (const theme of ["dark", "light"]) {
      const ctx = await b.newContext({ viewport: { width: w, height: h } });
      const p = await ctx.newPage();
      await p.addInitScript((t) => localStorage.setItem("theme", t), theme);
      for (const spec of specs) {
        const [route, name] = spec.split(":");
        await p.goto(BASE + route, { waitUntil: "networkidle" });
        await p.waitForTimeout(600);
        await p.screenshot({ path: `${OUT}/${name}-${theme}-${w}.png`, fullPage: true });
        const r = await p.evaluate(() => ({
          overflow: document.documentElement.scrollWidth - window.innerWidth,
          h1: document.querySelectorAll("h1").length,
        }));
        console.log(name.padEnd(12), theme.padEnd(5), w, "overflow", r.overflow, "h1", r.h1);
      }
      await ctx.close();
    }
  }
  await b.close();
})();
