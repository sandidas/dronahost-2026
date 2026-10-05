/**
 * Full-page screenshots at 1440 / 820 / 390 px.
 * Usage: tsx scripts/screenshot.ts <url-path> <out-dir> <name> [baseUrl]
 * Dev-only tool, not part of the build.
 */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const WIDTHS = [1440, 820, 390] as const;
const [path = "/v2", outDir = "docs/reference/before", name = "v2", base = "http://localhost:3100"] =
  process.argv.slice(2);

async function main() {
  mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch();
  for (const width of WIDTHS) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    await page.goto(`${base}${path}`, { waitUntil: "networkidle", timeout: 120_000 });
    await page.waitForTimeout(1500);
    const file = `${outDir}/${name}-${width}.png`;
    await page.screenshot({ path: file, fullPage: true });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    console.log(`${file}  horizontal overflow: ${overflow}px`);
    await page.close();
  }
  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
