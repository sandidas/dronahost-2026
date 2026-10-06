import { chromium } from "playwright";
(async () => {
  const b = await chromium.launch();
  for (const w of [1440, 390]) {
    const p = await b.newPage({ viewport: { width: w, height: 900 } });
    await p.goto("http://localhost:3001/", { waitUntil: "networkidle" });
    await p.waitForTimeout(800);
    await p.screenshot({ path: `docs/reference/after/review-1/home-hero-${w}.png` });
  }
  await b.close();
})();
