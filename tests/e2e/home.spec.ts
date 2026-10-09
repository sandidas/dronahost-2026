import { expect, test } from "@playwright/test";
import { isVerified } from "../../content/claims";

const CONSENT = encodeURIComponent(
  JSON.stringify({ preferences: false, analytics: false, marketing: false, id: "00000000-0000-4000-8000-000000000000", at: "2026-01-01T00:00:00.000Z", v: 1 }),
);

test.beforeEach(async ({ context }) => {
  await context.addCookies([{ name: "dh_consent", value: CONSENT, url: "http://localhost:3200" }]);
});

test.describe("home page (rendered from content/pages/home.json)", () => {
  test("has one h1, one primary action and no visual that is not real", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Managed WordPress hosting without the technical worry");
    await expect(page.getByRole("link", { name: "See WordPress hosting plans" }).first()).toHaveAttribute("href", "/wordpress-hosting");
    // No real screenshot is supplied yet, so the hero shows no fake dashboard and centres its text.
    await expect(page.getByText("Example dashboard")).toHaveCount(0);
    await expect(page.getByText("yoursite.com")).toHaveCount(0);
  });

  test("'Talk to our team' is gone from the home page, and 'Move my site free' stays off until the form can send", async ({ page }) => {
    await page.goto("/");
    const text = (await page.locator("body").innerText()).toLowerCase();
    expect(text).not.toContain("talk to our team");
    // The main server has no request destination, so the form and the buttons that point to it are hidden.
    await expect(page.locator("#move-my-site")).toHaveCount(0);
    await expect(page.getByRole("link", { name: "Move my site free" })).toHaveCount(0);
  });

  test("shows only what is confirmed: no unverified capability, retired channel or reply-time promise appears", async ({ page }) => {
    await page.goto("/");
    const text = (await page.locator("main").innerText()).toLowerCase();
    // Gated sections and copy stay out until their claims are verified and published. The home page makes no reply-time promise (owner, 2026-10-08).
    for (const hidden of ["same price, no increase", "whatsapp", "live chat", "5 minutes", "5-minute", "litespeed", "nvme"]) {
      expect(text, `main shows "${hidden}"`).not.toContain(hidden);
    }
    // The lead names DronaHost and uses the free-migration claim, which renders.
    expect(text).toContain("dronahost is a focused team that offers managed wordpress hosting");
    // Where we are based is said on /about only (decision 34). The GST line names India as a tax rule, which is fine.
    expect(text.replace(/customers in india pay gst/g, "")).not.toMatch(/india|based in/);
    expect(text).toContain("we move your site for free");
  });

  test("the sections that are confirmed render, with no empty gaps", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Where are you starting from?" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Three promises you can read in full" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Help when you need it, and the terms behind our promises" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Questions before you choose" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Ready to see which plan fits?" })).toBeVisible();
    // The long explanation of managed hosting lives on /wordpress-hosting; home keeps two lines under the router heading.
    await expect(page.getByRole("heading", { name: "What does managed WordPress hosting mean?" })).toHaveCount(0);
    await expect(page.getByText("Managed hosting means a team looks after the technical side of your site.")).toBeVisible();
    // Hidden until their data exists: proof numbers, plans, case study, reviews.
    for (const hidden of ["Service statistics", "Plans and pricing", "Case study"]) await expect(page.getByRole("heading", { name: hidden })).toHaveCount(0);
    // Every section on the page has a heading: no section renders empty.
    const sections = await page.locator("main section").evaluateAll((els) => els.map((el) => !!el.querySelector("h1, h2, h3")));
    expect(sections.every(Boolean)).toBe(true);
  });

  test("each promise links to the page that publishes its terms", async ({ page }) => {
    await page.goto("/");
    const why = page.locator("section", { has: page.getByRole("heading", { name: "Three promises you can read in full" }) });
    await expect(why.getByRole("link", { name: "Read the refund policy" })).toHaveAttribute("href", "/refund-policy");
    await expect(why.getByRole("link", { name: "Read the migration terms" })).toHaveAttribute("href", "/migration-terms");
    await expect(why.getByRole("link", { name: "Read how renewals work" })).toHaveAttribute("href", "/pricing-policy");
    // The migration terms row no longer mentions a VPS.
    expect((await page.locator("body").innerText()).toLowerCase()).not.toContain("up to 10");
  });

  test("the support button is secondary", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: "Open a ticket" })).toHaveClass(/btn-secondary/);
  });

  test("spacing stays even between the visible sections, however many are hidden", async ({ page }) => {
    for (const width of [1280, 390]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      // Content to content: the lowest visible element of one section to the highest visible element of the next.
      const gaps = await page.locator("main .page-tones > section").evaluateAll((els) => {
        const box = (el: Element) => {
          const rects = [...el.querySelectorAll("h1,h2,h3,p,li,figure,figcaption,a,button,summary")]
            .filter((n) => !n.closest(".sr-only") && n.checkVisibility({ checkVisibilityCSS: true, contentVisibilityAuto: true }))
            .filter((n) => {
              // Skip anything pinned to the screen (a mobile call-to-action bar): it floats over the page and has no place in the flow.
              for (let p: Element | null = n; p; p = p.parentElement) if (["fixed", "sticky"].includes(getComputedStyle(p).position)) return false;
              return true;
            })
            .map((n) => n.getBoundingClientRect())
            .filter((r) => r.width > 8 && r.height > 8);
          return { top: Math.min(...rects.map((r) => r.top)), bottom: Math.max(...rects.map((r) => r.bottom)) };
        };
        return els.slice(1).map((el, i) => Math.round(box(el).top - box(els[i]).bottom));
      });
      // Each section pads itself, so two neighbours sit 40 to 240px apart: never touching and never a double gap.
      for (const g of gaps) expect(g, `gap ${g}px at ${width}px wide (all: ${gaps.join(", ")})`).toBeGreaterThanOrEqual(40);
      for (const g of gaps) expect(g, `gap ${g}px at ${width}px wide`).toBeLessThanOrEqual(240);
    }
  });

  test("neighbouring sections never share a background, in both themes", async ({ page }) => {
    for (const theme of ["dark", "light"]) {
      await page.addInitScript((t) => localStorage.setItem("theme", t), theme);
      await page.goto("/");
      const tints = await page.locator("main .page-tones > section").evaluateAll((els) => els.map((el) => getComputedStyle(el).backgroundColor).map((c) => (/rgba?\(.*,\s*0\)$/.test(c) || c === "transparent" ? "none" : c)));
      for (let i = 1; i < tints.length; i++) expect(tints[i], `${theme}: section ${i + 1} and ${i} share "${tints[i]}"`).not.toBe(tints[i - 1]);
    }
  });

  test("body text on dark is large enough and bright enough", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("theme", "dark"));
    await page.goto("/");
    const body = await page.locator("p.t-body").first().evaluate((el) => { const cs = getComputedStyle(el); return { size: parseFloat(cs.fontSize), color: cs.color }; });
    expect(body.size).toBeGreaterThanOrEqual(17);
    const [r, g, b] = (body.color.match(/\d+/g) ?? []).map(Number);
    // muted-foreground on dark must be a light colour: its luminance is above 0.6.
    expect((0.2126 * r + 0.7152 * g + 0.0722 * b) / 255).toBeGreaterThan(0.7);
  });

  test("FAQ answers are in the server HTML and the open state is accessible without JavaScript", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    await context.addCookies([{ name: "dh_consent", value: CONSENT, url: "http://localhost:3200" }]);
    const page = await context.newPage();
    await page.goto("/");
    await expect(page.locator("details")).toHaveCount(7);
    // A closed <details> hides its answer from innerText but the text is in the HTML.
    expect(await page.locator("details").first().textContent()).toContain("Managed WordPress hosting means");
    await context.close();
  });

  test("structured data is Organization and WebSite in the page, with no SearchAction", async ({ page }) => {
    await page.goto("/");
    const blocks = await page.locator('script[type="application/ld+json"]').allInnerTexts();
    const json = blocks.join("\n");
    expect(json).toContain('"Organization"');
    expect(json).toContain('"WebSite"');
    expect(json).not.toContain("SearchAction");
  });

  test("metadata comes from the spec: title, description and a canonical for the home page", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Hosting With the Same Price at Renewal/);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /DronaHost is a focused team offering managed WordPress hosting/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /dronahost\.com\/?$/);
  });

  test("the title promises the renewal price only while that claim renders", () => {
    // A title is static text. If renewal-price-same stops rendering, change the title in content/pages/home.json (decision 35).
    expect(isVerified("renewal-price-same")).toBe(true);
  });
});
