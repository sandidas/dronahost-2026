import { expect, test } from "@playwright/test";

test.describe("blog (WordPress mock)", () => {
  test("index lists posts, filters by category and paginates", async ({ page }) => {
    await page.goto("/blog");
    await expect(page.getByRole("link", { name: "Test post 1", exact: true })).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Pagination" })).toBeVisible();
    await page.getByRole("link", { name: "Next" }).click();
    await expect(page).toHaveURL(/page=2/);
    await expect(page.getByRole("link", { name: "Previous" })).toBeVisible();

    await page.goto("/blog");
    const filter = page.getByRole("navigation", { name: "Filter articles by category" });
    await filter.getByRole("link", { name: "Security" }).click();
    await expect(page).toHaveURL(/category=security/);
    await expect(filter.getByRole("link", { name: "Security" })).toHaveAttribute("aria-current", "page");
  });

  test("article has a TOC, breadcrumbs, author box and sanitized content", async ({ page }) => {
    await page.goto("/blog/test-post-1");
    await expect(page.getByRole("heading", { level: 1, name: "Test post 1" })).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Breadcrumb" })).toBeVisible();
    const toc = page.getByRole("navigation", { name: "Table of contents" });
    await expect(toc.getByRole("link", { name: "First section" })).toHaveAttribute("href", "#first-section");
    await expect(page.getByRole("complementary", { name: "About the author" })).toContainText("Writes about hosting.");

    const article = page.locator(".article");
    expect(await article.locator("script, iframe").count()).toBe(0);
    expect(await article.locator("[onclick], [onerror]").count()).toBe(0);
    expect(await page.evaluate(() => (window as unknown as { __pwned?: boolean }).__pwned)).toBeUndefined();
    await expect(article.getByRole("link", { name: "external link" })).toHaveAttribute("rel", /noopener/);
  });

  test("author box is hidden when the author has no bio", async ({ page }) => {
    await page.goto("/blog/test-post-2");
    await expect(page.getByRole("complementary", { name: "About the author" })).toHaveCount(0);
  });

  test("unknown article is a real 404", async ({ request }) => {
    expect((await request.get("/blog/does-not-exist")).status()).toBe(404);
  });
});
