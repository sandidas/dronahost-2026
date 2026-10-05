/**
 * Raw-entity test. Fails if visible text on any public route contains an HTML entity that
 * was not decoded (for example "don&os;t", "&amp;", "&#39;"), which signals double-escaped
 * or malformed content. Usage: QA_BASE=... tsx scripts/qa/entities.ts
 */
import { chromium } from "playwright";
import { ALL_ROUTES, BASE } from "./routes";

const ENTITY = /&(?:#\d+|#x[0-9a-f]+|[a-z][a-z0-9]{1,30});/gi;
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  let bad = 0;
  for (const route of ALL_ROUTES) {
    await page.goto(BASE + route, { waitUntil: "load" });
    const text = await page.evaluate(() => document.body.textContent ?? "");
    const attrs = await page.$$eval("[alt],[aria-label],[title]", (els) => els.map((e) => `${e.getAttribute("alt") ?? ""} ${e.getAttribute("aria-label") ?? ""} ${e.getAttribute("title") ?? ""}`).join(" "));
    const found = [...new Set(`${text} ${attrs}`.match(ENTITY) ?? [])];
    if (found.length) {
      bad++;
      console.log(`FAIL ${route}: ${found.join(" ")}`);
    }
  }
  await browser.close();
  console.log(bad ? `\n${bad} route(s) contain raw entities` : `\nNo raw HTML entities in rendered text on ${ALL_ROUTES.length} routes`);
  process.exit(bad ? 1 : 0);
})();
