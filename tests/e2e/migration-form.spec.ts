import { expect, test } from "@playwright/test";

// On a page the form shows only when a request has somewhere to go. This spec opens the same component in the /v2 showcase on
// the preview server (E2E_SHOWCASE=1, see playwright.config.ts), where no email address is set.
const PREVIEW = `http://localhost:${process.env.E2E_PREVIEW_PORT ?? 3201}`;
test.use({ baseURL: PREVIEW });

const URL = "/v2";
const FORM = "#v2-move-my-site";

test.describe("free-move form (showcase, preview server)", () => {
  test("the form has the four fields", async ({ page }) => {
    await page.goto(URL);
    const form = page.locator(FORM);
    await expect(form.getByRole("heading", { name: "Move your site to us for free" })).toBeVisible();
    for (const label of ["Your website address", "Who hosts your site now", "Your email", "Anything we should know (optional)"]) await expect(form.getByLabel(label)).toBeVisible();
  });

  test("an empty submit shows an error summary and a message under each required field", async ({ page }) => {
    await page.goto(URL);
    await page.locator(FORM).getByRole("button", { name: "Move my site free" }).click();
    await expect(page.locator(FORM).getByRole("alert")).toContainText("Please fix the fields marked below.");
    await expect(page.locator(FORM).getByText("Enter your website address, for example example.com.")).toBeVisible();
    await expect(page.locator(FORM).getByText("Tell us who hosts your site now.")).toBeVisible();
    await expect(page.locator(FORM).getByText("Enter an email address we can reply to.")).toBeVisible();
    await expect(page.locator(FORM).getByLabel("Your email")).toHaveAttribute("aria-invalid", "true");
  });

  test("a good request with no destination set says the form cannot send yet and points to a ticket", async ({ page }) => {
    await page.goto(URL);
    const form = page.locator(FORM);
    await form.getByLabel("Your website address").fill("example.com");
    await form.getByLabel("Who hosts your site now").fill("Some Host");
    await form.getByLabel("Your email").fill("me@example.com");
    await form.getByRole("button", { name: "Move my site free" }).click();
    await expect(page.locator(FORM).getByRole("alert")).toContainText("This form cannot send yet.");
    await expect(page.locator(FORM).getByRole("alert").getByRole("link", { name: "Open a ticket" })).toHaveAttribute("href", "/contact");
  });

  test("a bot that fills the honeypot is shown the success state and nothing is sent", async ({ page }) => {
    await page.goto(URL);
    const form = page.locator(FORM);
    await form.getByLabel("Your website address").fill("example.com");
    await form.getByLabel("Who hosts your site now").fill("Some Host");
    await form.getByLabel("Your email").fill("me@example.com");
    // A bot fills every field it finds, including the one people never see. force: true skips the visibility check a person would face.
    await form.locator('input[name="website"]').fill("http://spam.example", { force: true });
    await form.getByRole("button", { name: "Move my site free" }).click();
    await expect(page.locator(FORM).getByRole("status")).toContainText(/reply by email with the next steps/i);
  });

  test("the privacy line links to the privacy policy", async ({ page }) => {
    await page.goto(URL);
    await expect(page.locator(FORM).getByRole("link", { name: "privacy policy" })).toHaveAttribute("href", "/privacy");
  });

  test("the honeypot is hidden from people and from the keyboard", async ({ page }) => {
    await page.goto(URL);
    const trap = page.locator('#v2-move-my-site input[name="website"]');
    await expect(trap).toHaveAttribute("tabindex", "-1");
    await expect(trap).not.toBeInViewport();
  });
});
