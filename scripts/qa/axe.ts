/**
 * Axe accessibility scan (WCAG 2.x A/AA) of public routes in dark + light.
 * Usage: QA_BASE=http://localhost:3200 tsx scripts/qa/axe.ts [--routes=/,/pricing]
 * Exits 1 if any serious or critical violation is found.
 */
import AxeBuilder from "@axe-core/playwright";
import { chromium } from "playwright";
import { ALL_ROUTES, BASE, KEY_ROUTES } from "./routes";

const arg = process.argv.find((a) => a.startsWith("--routes="));
const routes = arg ? arg.slice(9).split(",") : ALL_ROUTES;

(async () => {
  const browser = await chromium.launch();
  let blocking = 0;
  for (const route of routes) {
    const themes = KEY_ROUTES.includes(route) || arg ? ["dark", "light"] : ["dark"];
    for (const theme of themes) {
      const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
      const page = await ctx.newPage();
      await page.addInitScript((t) => localStorage.setItem("theme", t), theme);
      await page.goto(BASE + route, { waitUntil: "load" });
      // Scan the settled page: reveal every armed element, then let transitions and one-shot animations finish.
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 500) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 80));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(1200);
      const { violations } = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
      const serious = violations.filter((v) => v.impact === "serious" || v.impact === "critical");
      blocking += serious.length;
      console.log(`${route.padEnd(22)} ${theme.padEnd(5)} violations=${violations.length} serious/critical=${serious.length}`);
      for (const v of violations) console.log(`    [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} node${v.nodes.length === 1 ? "" : "s"})  e.g. ${v.nodes[0]?.target.join(" ").slice(0, 70)}`);
      await ctx.close();
    }
  }
  await browser.close();
  console.log(blocking ? `\nFAIL: ${blocking} serious/critical violation group(s)` : "\nPASS: no serious or critical violations");
  process.exit(blocking ? 1 : 0);
})();
