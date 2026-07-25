import { test, expect } from "@playwright/test";
import { loginAsSeller } from "./helpers/auth";
import { stubGraphQL } from "./helpers/graphql";

/**
 * Behaviour lock for the seller product create/edit form
 * (app/(seller)/seller/products/_components/product-form.tsx).
 *
 * These specs are written BEFORE the P3-12 decomposition so the refactor into
 * <400-LOC child components can be proven behaviour-preserving. They assert:
 *   - the full set of form sections renders (create + edit),
 *   - the happy-path create submits and redirects,
 *   - the happy-path edit submits.
 *
 * The terminal mutations are stubbed so tests are deterministic and never
 * mutate real data; every reference-data query is served by the real backend
 * from fixtures.
 */

const CREATED_ID = "11111111-1111-4111-8111-111111111111";

test.describe("seller product form", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsSeller(page);
  });

  test("create: renders all sections and submits happy path", async ({
    page,
  }) => {
    await stubGraphQL(page, {
      CreateMyProduct: {
        createMyProduct: { __typename: "Product", id: CREATED_ID },
      },
    });

    await page.goto("/seller/products/new");

    // Header + create-mode copy.
    await expect(
      page.getByRole("heading", { name: /add product/i }),
    ).toBeVisible();

    // Create-mode sections (Store picker + Product Type are create-only).
    await expect(page.getByText("Store *", { exact: false })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Basics" })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Product Type" }),
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: "Pricing" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Tags" })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Specifications" }),
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: "Logistics" })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Tax & Compliance" }),
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: "SEO" })).toBeVisible();

    // "Simple" is the default product type; media is deferred to the next screen.
    await expect(
      page.getByText(/Save the product first, then upload images/i),
    ).toBeVisible();

    // Minimal valid input: the store auto-selects; name is the only required field.
    await page
      .getByLabel("Product Name *")
      .fill("E2E Behaviour Lock Product");

    await page.getByRole("button", { name: /create as draft/i }).click();

    // Success toast + redirect to the new product's edit screen.
    await expect(page.getByText(/product created/i)).toBeVisible();
    await expect(page).toHaveURL(
      new RegExp(`/seller/products/${CREATED_ID}$`),
    );
  });

  test("edit: renders edit-only sections and saves happy path", async ({
    page,
  }) => {
    const productId = process.env.E2E_EDIT_PRODUCT_ID;
    test.skip(!productId, "E2E_EDIT_PRODUCT_ID fixture not provided");

    await stubGraphQL(page, {
      UpdateMyProduct: {
        updateMyProduct: { __typename: "Product", id: productId },
      },
    });

    await page.goto(`/seller/products/${productId}`);

    // Edit-mode header.
    await expect(page.getByRole("heading", { name: /^edit /i })).toBeVisible();

    // Edit-only sections: Media management + Status/danger zone.
    await expect(
      page.getByRole("heading", { name: /^Media/ }),
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: "Status" })).toBeVisible();

    // Shared sections still present in edit mode.
    await expect(page.getByRole("heading", { name: "Basics" })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Tax & Compliance" }),
    ).toBeVisible();

    // Mutate the name and save.
    const nameInput = page.getByLabel("Product Name *");
    await nameInput.fill("E2E Behaviour Lock Product (edited)");
    await page.getByRole("button", { name: /save changes/i }).click();

    await expect(page.getByText(/product updated/i)).toBeVisible();
  });
});
