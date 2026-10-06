import { chromium } from "playwright";
const [tag = "after", base = "http://localhost:3001"] = process.argv.slice(2);
const OUT = "docs/reference/after/review-1";
(async () => {
  const b = await chromium.launch();
  for (const theme of ["light", "dark"] as const) {
    const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
    await ctx.addInitScript((t) => localStorage.setItem("theme", t), theme);
    const p = await ctx.newPage();
    for (const [id, name] of [["buttons", "buttons"], ["surfaces", "surfaces"]] as const) {
      await p.goto(`${base}/v2/design-system#${id}`, { waitUntil: "networkidle" });
      await p.waitForTimeout(700);
      await p.locator(`#${id}`).scrollIntoViewIfNeeded();
      await p.locator(`#${id}`).screenshot({ path: `${OUT}/${tag}-${name}-${theme}.png` });
    }
    await ctx.close();
  }
  await b.close();
})();
