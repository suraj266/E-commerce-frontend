"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client/react";
import { toast } from "sonner";

import {
  CANCEL_CHECKOUT,
  INITIATE_CHECKOUT,
  VERIFY_PAYMENT,
} from "@/lib/graphql/payments";
import {
  InitiateCheckoutData,
  VerifyPaymentData,
  PaymentGateway,
} from "@/types/order.types";

// ---------------------------------------------------------------------------
// Razorpay SDK type (loaded dynamically)
// ---------------------------------------------------------------------------
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

/** Load the Razorpay checkout.js script once. */
function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/**
 * The place-order flow, extracted from the checkout page verbatim.
 *
 * Two-phase:
 *   Phase 1: initiateCheckout → creates order + payment session
 *   Phase 2 (online): Razorpay SDK popup → verifyPayment mutation
 *   Phase 2 (COD): order placed immediately, redirect to success
 *
 * Owns the per-attempt idempotency key (`clientRequestId`), kept stable across
 * double-clicks / network retries so the server never creates a duplicate
 * order, and reset once the attempt reaches a terminal outcome.
 */
export function usePlaceOrder(params: {
  selectedAddressId: string | null;
  selectedGateway: PaymentGateway | null;
  notes: string;
  appliedCouponCode: string | null;
  b2bChecked: boolean;
  buyerGstin: string;
  buyerGstinValid: boolean;
  clearAppliedCoupon: () => void;
}): { isProcessing: boolean; placeOrder: () => Promise<void> } {
  const {
    selectedAddressId,
    selectedGateway,
    notes,
    appliedCouponCode,
    b2bChecked,
    buyerGstin,
    buyerGstinValid,
    clearAppliedCoupon,
  } = params;

  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const [initiateCheckout] = useMutation<InitiateCheckoutData>(INITIATE_CHECKOUT);
  const [verifyPayment] = useMutation<VerifyPaymentData>(VERIFY_PAYMENT);
  const [cancelCheckout] = useMutation(CANCEL_CHECKOUT);

  // Idempotency key for the current checkout attempt. Generated lazily on the
  // first submit and kept stable across double-clicks / network retries so the
  // server (OrderPlacementService) never creates a duplicate order. Reset once
  // the attempt reaches a terminal outcome (placed / paid / cancelled) so the
  // next order gets a fresh key. Kept on an initiateCheckout error so a retry
  // recovers the same order if the response was lost after it was created.
  const checkoutRequestId = useRef<string | null>(null);

  // ---- Razorpay checkout handler ----
  const openRazorpay = useCallback(
    async (orderId: string, payload: Record<string, unknown>) => {
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error("Failed to load Razorpay SDK. Please try again.");
        setIsProcessing(false);
        return;
      }

      const options = {
        key: payload.razorpayKeyId,
        amount: payload.amount,
        currency: payload.currency,
        name: payload.name ?? "Order Payment",
        order_id: payload.razorpayOrderId,
        prefill: payload.prefill ?? {},
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        handler: async (response: any) => {
          try {
            await verifyPayment({
              variables: {
                input: {
                  orderId,
                  gatewayPaymentId: response.razorpay_payment_id,
                  gatewaySignature: response.razorpay_signature,
                  gatewayOrderId: response.razorpay_order_id,
                },
              },
            });
            // Order is redeemed — clear the persisted coupon.
            checkoutRequestId.current = null; // attempt complete
            clearAppliedCoupon();
            toast.success("Payment successful! Redirecting...");
            router.push(`/checkout/success/${orderId}`);
          } catch (err) {
            toast.error(
              err instanceof Error ? err.message : "Payment verification failed.",
            );
            // Verification failed — treat as a failed payment so the order
            // doesn't linger as a seller-actionable PENDING order. Reset the
            // key so a fresh retry creates a new order (this one is cancelled).
            checkoutRequestId.current = null;
            await cancelCheckout({ variables: { orderId } }).catch(() => {});
            router.push(`/checkout/failed/${orderId}?reason=failed`);
          } finally {
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: async () => {
            // Customer closed the gateway without paying. Cancel the order
            // server-side (releases reserved stock) so it can't be fulfilled,
            // then send them to the failed page. The webhook is the backstop
            // if this call doesn't land.
            try {
              checkoutRequestId.current = null; // attempt cancelled — next is fresh
              await cancelCheckout({ variables: { orderId } });
            } catch {
              // best-effort; the payment.failed webhook will reconcile.
            } finally {
              setIsProcessing(false);
              router.push(`/checkout/failed/${orderId}?reason=cancelled`);
            }
          },
        },
        theme: {
          color: "#6366f1",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    },
    [verifyPayment, cancelCheckout, router, clearAppliedCoupon],
  );

  // ---- Place Order Handler ----
  async function placeOrder() {
    if (!selectedAddressId) {
      toast.error("Please select a shipping address.");
      return;
    }
    if (!selectedGateway) {
      toast.error("Please select a payment method.");
      return;
    }
    if (b2bChecked && !buyerGstinValid) {
      toast.error("Enter a valid 15-character GSTIN or uncheck B2B.");
      return;
    }

    setIsProcessing(true);

    // Stable per-attempt idempotency key (generated once, reused on retry).
    if (!checkoutRequestId.current) {
      checkoutRequestId.current = crypto.randomUUID();
    }

    try {
      const res = await initiateCheckout({
        variables: {
          input: {
            shippingAddressId: selectedAddressId,
            gateway: selectedGateway,
            customerNotes: notes || undefined,
            couponCode: appliedCouponCode ?? undefined,
            buyerGstin: b2bChecked ? buyerGstin.toUpperCase().trim() : undefined,
            clientRequestId: checkoutRequestId.current,
          },
        },
      });

      const result = res.data?.initiateCheckout;
      if (!result) {
        toast.error("Checkout failed. Please try again.");
        setIsProcessing(false);
        return;
      }

      if (!result.requiresPayment) {
        // COD — order placed immediately. Clear the persisted coupon now
        // that it's redeemed; the server enforces idempotency via the
        // unique CouponRedemption.orderId so a retry can't double-apply.
        checkoutRequestId.current = null; // attempt complete — next order is fresh
        clearAppliedCoupon();
        toast.success(`Order ${result.orderNumber} placed successfully!`);
        router.push(`/checkout/success/${result.orderId}`);
        return;
      }

      // Online payment — parse gateway payload and open SDK
      const payload = result.gatewayPayload
        ? JSON.parse(result.gatewayPayload)
        : {};

      if (result.gateway === "RAZORPAY") {
        await openRazorpay(result.orderId, payload);
      } else {
        // Future: handle STRIPE redirect, PHONEPE, etc.
        toast.error(`${result.gateway} checkout is not yet supported.`);
        setIsProcessing(false);
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not initiate checkout.",
      );
      setIsProcessing(false);
    }
  }

  return { isProcessing, placeOrder };
}
