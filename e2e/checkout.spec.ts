import { test, expect } from "@playwright/test";
import { loginAsCustomer } from "./helpers/auth";
import { stubGraphQL } from "./helpers/graphql";

/**
 * Behaviour lock for the public checkout page
 * (app/(public)/checkout/page.tsx).
 *
 * Written BEFORE the P3-12 decomposition so the extraction of the address /
 * payment / summary / place-order pieces can be proven behaviour-preserving.
 *
 * Both flows depend on the seeded fixture cart/address/gateways rendering the
 * page; only the terminal checkout mutations are stubbed so the front-end
 * place-order orchestration (including the clientRequestId idempotency and the
 * Razorpay SDK branch) is exercised deterministically.
 */

const ORDER_ID = "22222222-2222-4222-8222-222222222222";
const ORDER_NUMBER = "ORD-E2E-0001";

test.describe("checkout", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsCustomer(page);
  });

  test("renders the checkout layout from the fixture cart", async ({
    page,
  }) => {
    await page.goto("/checkout");

    await expect(
      page.getByRole("heading", { name: "Checkout", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Shipping address" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Payment method" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Order summary" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /order notes/i }),
    ).toBeVisible();

    // B2B GSTIN toggle reveals the GSTIN field (Phase-3 field must survive).
    await expect(
      page.getByText(/buying for business/i),
    ).toBeVisible();
  });

  test("COD happy path places the order and redirects to success", async ({
    page,
  }) => {
    await stubGraphQL(page, {
      InitiateCheckout: {
        initiateCheckout: {
          __typename: "InitiateCheckoutResult",
          orderId: ORDER_ID,
          orderNumber: ORDER_NUMBER,
          gateway: "COD",
          gatewayPayload: null,
          requiresPayment: false,
        },
      },
    });

    await page.goto("/checkout");
    await expect(
      page.getByRole("heading", { name: "Checkout", exact: true }),
    ).toBeVisible();

    // Choose Cash on Delivery (radio label "Cash on Delivery" is fixture copy;
    // fall back to the COD radio value if the display name differs).
    const codRadio = page.locator('input[name="payment-gateway"][value="COD"]');
    await codRadio.check();

    const placeOrder = page.getByRole("button", {
      name: /place order \(cash on delivery\)/i,
    });
    await expect(placeOrder).toBeEnabled();
    await placeOrder.click();

    await expect(page.getByText(/placed successfully/i)).toBeVisible();
    await expect(page).toHaveURL(
      new RegExp(`/checkout/success/${ORDER_ID}$`),
    );
  });

  test("prepaid happy path opens Razorpay and verifies to success", async ({
    page,
  }) => {
    // Fake Razorpay SDK: as soon as .open() is called, invoke the success
    // handler with a canned gateway response — mirrors a completed payment.
    await page.addInitScript(() => {
      class FakeRazorpay {
        private opts: Record<string, unknown>;
        constructor(opts: Record<string, unknown>) {
          this.opts = opts;
        }
        open() {
          const handler = this.opts.handler as
            | ((r: Record<string, string>) => void)
            | undefined;
          handler?.({
            razorpay_payment_id: "pay_e2e",
            razorpay_signature: "sig_e2e",
            razorpay_order_id: "order_e2e",
          });
        }
      }
      window.Razorpay = FakeRazorpay;
    });

    await stubGraphQL(page, {
      InitiateCheckout: {
        initiateCheckout: {
          __typename: "InitiateCheckoutResult",
          orderId: ORDER_ID,
          orderNumber: ORDER_NUMBER,
          gateway: "RAZORPAY",
          gatewayPayload: JSON.stringify({
            razorpayKeyId: "rzp_test_e2e",
            razorpayOrderId: "order_e2e",
            amount: 10000,
            currency: "INR",
            name: "E2E Order",
            prefill: {},
          }),
          requiresPayment: true,
        },
      },
      VerifyPayment: {
        verifyPayment: {
          __typename: "Order",
          id: ORDER_ID,
          orderNumber: ORDER_NUMBER,
          status: "CONFIRMED",
          paymentStatus: "PAID",
        },
      },
    });

    await page.goto("/checkout");
    await expect(
      page.getByRole("heading", { name: "Checkout", exact: true }),
    ).toBeVisible();

    const razorpayRadio = page.locator(
      'input[name="payment-gateway"][value="RAZORPAY"]',
    );
    await razorpayRadio.check();

    const proceed = page.getByRole("button", { name: /proceed to payment/i });
    await expect(proceed).toBeEnabled();
    await proceed.click();

    await expect(page.getByText(/payment successful/i)).toBeVisible();
    await expect(page).toHaveURL(
      new RegExp(`/checkout/success/${ORDER_ID}$`),
    );
  });
});
