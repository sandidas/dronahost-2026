import { defineConfig } from "@playwright/test";

const PORT = Number(process.env.E2E_PORT ?? 3200);
const WP_PORT = Number(process.env.WP_MOCK_PORT ?? 3900);

/**
 * End-to-end tests run against a production build (`npm run build` first).
 * A WordPress REST mock serves the blog; MongoDB is not required (form submissions that
 * need it are expected to fail with a friendly error, which the tests assert).
 */
export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: { baseURL: `http://localhost:${PORT}`, trace: "retain-on-failure" },
  webServer: [
    { command: "node tests/mocks/wp-server.mjs", port: WP_PORT, reuseExistingServer: !process.env.CI },
    {
      command: `npx next start -p ${PORT}`,
      port: PORT,
      reuseExistingServer: !process.env.CI,
      env: { WORDPRESS_API_URL: `http://localhost:${WP_PORT}/wp-json/wp/v2` },
    },
  ],
});
