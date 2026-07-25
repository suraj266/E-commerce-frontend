import { expect, type Page } from "@playwright/test";

/**
 * UI-driven login helpers.
 *
 * The access token lives in memory only (see store/auth.store.ts) and the
 * source of truth is the httpOnly refresh cookie, so we log in through the real
 * login forms rather than forging a token. Credentials come from env so the
 * suite carries no secrets.
 */

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) {
    throw new Error(
      `Missing required e2e env var ${name}. See playwright.config.ts / e2e/README.md.`,
    );
  }
  return v;
}

/** Log in on the customer surface (/login) and wait for the redirect away. */
export async function loginAsCustomer(page: Page): Promise<void> {
  const email = requireEnv("E2E_CUSTOMER_EMAIL");
  const password = requireEnv("E2E_CUSTOMER_PASSWORD");

  await page.goto("/login");
  await page.getByLabel("Email Address").fill(email);
  await page.locator("#password").fill(password);
  await page.getByRole("button", { name: /sign in to account/i }).click();
  // Successful login navigates to the role home (or ?next=).
  await expect(page).not.toHaveURL(/\/login(\?|$)/, { timeout: 15_000 });
}

/** Log in on the seller surface (/seller/login) and land on the dashboard. */
export async function loginAsSeller(page: Page): Promise<void> {
  const email = requireEnv("E2E_SELLER_EMAIL");
  const password = requireEnv("E2E_SELLER_PASSWORD");

  await page.goto("/seller/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: /sign in to seller portal/i }).click();
  await expect(page).toHaveURL(/\/seller\/dashboard/, { timeout: 15_000 });
}
