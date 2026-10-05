import { chromium } from "playwright";
const OUT = "docs/reference/after/batch-b";
const BASE = "http://localhost:3001";
const PAGES: [string, string][] = [["/", "home"], ["/wordpress-hosting", "wordpress"], ["/about", "about"]];
(async () => {
  const b = await chromium.launch();
  for (const [w, h] of [[1440, 900], [390, 844]] as const) {
    const ctx = await b.newContext({ viewport: { width: w, height: h } });
    for (const theme of ["dark", "light"]) {
      const p = await ctx.newPage();
      await p.addInitScript((t) => localStorage.setItem("theme", t), theme);
      for (const [route, name] of PAGES) {
        await p.goto(BASE + route, { waitUntil: "networkidle" });
        await p.waitForTimeout(700);
        await p.screenshot({ path: `${OUT}/${name}-${theme}-${w}.png` });
        const ov = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        const h1 = await p.evaluate(() => document.querySelectorAll("h1").length);
        console.log(name, theme, w, "overflow", ov, "h1 count", h1);
      }
      await p.close();
    }
    await ctx.close();
  }
  await b.close();
})();
