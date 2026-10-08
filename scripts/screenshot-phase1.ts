/**
 * Review screenshots of the Phase 1 home components, dark + light, 1440 + 390.
 *  - preview: /v2/phase1-preview, each component exactly as it sits on a page (samples forced on)
 *  - showcase: /v2 sections (default, edge cases, "as it ships today")
 * Cookie banner, fixed/sticky chrome and dev badges are hidden and scroll reveals are forced on, so images show the component only.
 * Prints horizontal overflow per run. Usage: tsx scripts/screenshot-phase1.ts [outDir] [baseUrl]
 */
import { mkdirSync } from "node:fs";
import { chromium, type Page } from "playwright";

const OUT = process.argv[2] ?? "docs/reference/after/phase1-review";
const BASE = process.argv[3] ?? "http://localhost:3001";
const SHOWCASE_IDS = ["path-router", "responsibility-split", "answer-block", "support-channels"];
const CONSENT = encodeURIComponent(JSON.stringify({ preferences: false, analytics: false, marketing: false, id: "review", at: "2026-10-07T00:00:00.000Z", v: 1 }));

async function clean(p: Page) {
  await p.addStyleTag({ content: "[data-reveal],.reveal-armed{opacity:1!important;transform:none!important;clip-path:none!important;transition:none!important}" });
  await p.evaluate(() => {
    document.querySelectorAll<HTMLElement>("body *").forEach((el) => {
      const pos = getComputedStyle(el).position;
      if (pos === "fixed" || pos === "sticky") el.style.visibility = "hidden";
    });
    document.querySelectorAll("nextjs-portal").forEach((el) => ((el as HTMLElement).style.display = "none"));
  });
}

(async () => {
  mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch();
  for (const [w, h] of [[1440, 900], [390, 844]] as const) {
    for (const theme of ["dark", "light"]) {
      const ctx = await b.newContext({ viewport: { width: w, height: h } });
      await ctx.addCookies([{ name: "dh_consent", value: CONSENT, url: BASE }]);
      const p = await ctx.newPage();
      await p.addInitScript((t) => localStorage.setItem("theme", t), theme);

      await p.goto(`${BASE}/v2/phase1-preview`, { waitUntil: "networkidle" });
      await clean(p);
      const names = ["path-router", "answer-block", "responsibility-split"];
      const sections = p.locator("main > section");
      for (let i = 0; i < names.length; i++) {
        await sections.nth(i).scrollIntoViewIfNeeded();
        await sections.nth(i).screenshot({ path: `${OUT}/preview-${names[i]}-${theme}-${w}.png` });
      }
      const ov = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);

      await p.goto(`${BASE}/v2`, { waitUntil: "networkidle" });
      await clean(p);
      for (const id of SHOWCASE_IDS) await p.locator(`#${id}`).screenshot({ path: `${OUT}/showcase-${id}-${theme}-${w}.png` });
      const ov2 = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      console.log(theme, w, "overflow preview", ov, "showcase", ov2);
      await ctx.close();
    }
  }
  await b.close();
})();
