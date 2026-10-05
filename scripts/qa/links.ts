/**
 * Internal link checker: crawls the public routes, collects every same-site <a href> and
 * reports targets that do not return 200. Usage: QA_BASE=... tsx scripts/qa/links.ts
 */
import { chromium } from "playwright";
import { ALL_ROUTES, BASE } from "./routes";

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const found = new Map<string, Set<string>>();
  for (const route of ALL_ROUTES) {
    await page.goto(BASE + route, { waitUntil: "load" });
    const hrefs = await page.$$eval("a[href]", (as) => as.map((a) => (a as HTMLAnchorElement).getAttribute("href") ?? ""));
    for (const h of hrefs) {
      if (!h.startsWith("/") || h.startsWith("//")) continue;
      const target = h.split("#")[0].split("?")[0] || "/";
      if (!found.has(target)) found.set(target, new Set());
      found.get(target)!.add(route);
    }
  }
  let broken = 0;
  for (const [target, from] of [...found].sort()) {
    // /blog/<slug> pages are database-backed; they cannot be checked without MongoDB.
    if (target.startsWith("/blog/")) continue;
    const res = await page.request.get(BASE + target, { maxRedirects: 0, timeout: 20000 }).catch(() => null);
    if (!res || res.status() !== 200) {
      if (!res) {
        broken++;
        console.log(`ERR  ${target.padEnd(32)} no response linked from ${[...from].slice(0, 3).join(", ")}`);
        continue;
      }
      broken++;
      console.log(`${String(res.status()).padEnd(4)} ${target.padEnd(32)} linked from ${[...from].slice(0, 3).join(", ")}${from.size > 3 ? ` +${from.size - 3}` : ""}`);
    }
  }
  console.log(`\nChecked ${found.size} internal targets: ${broken ? `${broken} broken` : "all OK"}`);
  await browser.close();
  process.exit(broken ? 1 : 0);
})();
