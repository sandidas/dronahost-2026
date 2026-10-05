/**
 * Element screenshots of named homepage sections, dark + light, 1440 + 390.
 * Usage: tsx scripts/screenshot-sections.ts <outDir> [route]
 */
import { chromium } from "playwright";

const OUT = process.argv[2] ?? "docs/reference/after/batch-c";
const ROUTE = process.argv[3] ?? "/";
const BASE = "http://localhost:3001";
const SECTIONS: [string, string][] = [
  ["Hosting that stays out of your way", "bento"],
  ["Hosting and web services under one roof", "offer"],
  ["WordPress hosting that is looked after for you", "split-wordpress"],
  ["Move your site without losing a weekend", "split-migration"],
  ["Protection that runs in the background", "split-protection"],
  ["Real people, through the channel you prefer", "split-support"],
  ["Which hosting fits your site?", "compare"],
];

(async () => {
  const b = await chromium.launch();
  for (const [w, h] of [[1440, 900], [390, 844]] as const) {
    for (const theme of ["dark", "light"]) {
      const ctx = await b.newContext({ viewport: { width: w, height: h } });
      const p = await ctx.newPage();
      await p.addInitScript((t) => localStorage.setItem("theme", t), theme);
      await p.goto(BASE + ROUTE, { waitUntil: "networkidle" });
      for (const [heading, name] of SECTIONS) {
        const section = p.locator("section", { has: p.getByRole("heading", { name: heading, exact: true }) }).first();
        await section.scrollIntoViewIfNeeded();
        await p.waitForTimeout(250);
        await section.screenshot({ path: `${OUT}/${name}-${theme}-${w}.png` });
      }
      const ov = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      console.log(theme, w, "overflow", ov);
      await ctx.close();
    }
  }
  await b.close();
})();
