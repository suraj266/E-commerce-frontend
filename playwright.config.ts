import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright config for the storefront + seller e2e suite.
 *
 * These specs PIN the current behaviour of the two mega-pages that P3-12
 * decomposes (seller product create/edit form, and the public checkout flow)
 * so the refactor can be proven behaviour-preserving.
 *
 * Requirements to run (wired centrally — see e2e/README.md):
 *   - `@playwright/test` dev dependency installed + browsers (`playwright install`).
 *   - A running app + backend with seeded fixtures. Point the suite at it with:
 *       E2E_BASE_URL           default http://localhost:3000
 *       E2E_SELLER_EMAIL       seller login (has ≥1 ACTIVE store)
 *       E2E_SELLER_PASSWORD
 *       E2E_CUSTOMER_EMAIL     customer login (has a non-empty cart + ≥1 address)
 *       E2E_CUSTOMER_PASSWORD
 *       E2E_EDIT_PRODUCT_ID    an existing DRAFT product owned by the seller
 *   - When E2E_BASE_URL is unset the config boots `next dev` itself.
 */
const baseURL = process.env.E2E_BASE_URL ?? "http://localhost:3000";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  timeout: 60_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  // Only self-host the dev server when no external base URL was provided.
  ...(process.env.E2E_BASE_URL
    ? {}
    : {
        webServer: {
          command: "pnpm dev",
          url: baseURL,
          reuseExistingServer: !process.env.CI,
          timeout: 120_000,
        },
      }),
});
