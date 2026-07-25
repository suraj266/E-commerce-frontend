"use client";

/**
 * /checkout — multi-gateway checkout page (orchestrator).
 *
 * Layout: left column = address + payment gateway + notes + B2B GSTIN; right
 * column = order summary (mini cart + place-order). Both panes scroll
 * independently on tall viewports.
 *
 * This file owns the page-level data queries, form state and derived values,
 * then composes the section components in `./_components`. The two-phase
 * place-order flow (initiate → COD redirect | Razorpay popup → verify), together
 * with the Phase-1 `clientRequestId` idempotency, lives in `usePlaceOrder`.
 *
 * Payment gateways are fetched dynamically from the backend — whatever the admin
 * has enabled shows up here automatically.
 */

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "@apollo/client/react";
import { AlertCircle } from "lucide-react";

import { GET_MY_CART } from "@/lib/graphql/cart";
import { GET_MY_ADDRESSES } from "@/lib/graphql/account";
import { GET_ACTIVE_PAYMENT_GATEWAYS } from "@/lib/graphql/payments";
import { GET_SHIPPING_QUOTE } from "@/lib/graphql/shipping";
import { ShippingQuoteData } from "@/types/shipping.types";
import { MyCartData } from "@/types/cart.types";
import { MyAddressesData } from "@/types/account.types";
import {
  ActivePaymentGatewaysData,
  PaymentGateway,
} from "@/types/order.types";
import { useAuthStore } from "@/store/auth.store";
import { formatPrice } from "@/lib/utils/currency";
import { useSiteSettings } from "@/lib/context/site-settings-context";
import { useAppliedCoupon } from "@/components/coupon/use-applied-coupon";
import { useCouponStore } from "@/store/coupon.store";
import { CartValidationNotice } from "@/components/cart/cart-validation-notice";

import { CenteredEmpty, SkeletonView } from "./_components/checkout-ui";
import { AddressSection } from "./_components/address-section";
import { PaymentMethodSection } from "./_components/payment-method-section";
import { OrderNotesSection } from "./_components/order-notes-section";
import { B2bGstinSection } from "./_components/b2b-gstin-section";
import { OrderSummary } from "./_components/order-summary";
import { usePlaceOrder } from "./_components/use-place-order";

// ===========================================================================
export default function CheckoutPage() {
  const user = useAuthStore((s) => s.user);
  const isAuthed = !!user;
  const { showPriceWithTax, getDisplayPrice } = useSiteSettings();

  // ---- Data queries ----
  const cartQ = useQuery<MyCartData>(GET_MY_CART, {
    skip: !isAuthed,
    fetchPolicy: "cache-and-network",
    errorPolicy: "ignore",
  });
  const addrQ = useQuery<MyAddressesData>(GET_MY_ADDRESSES, {
    skip: !isAuthed,
    fetchPolicy: "cache-and-network",
    errorPolicy: "ignore",
  });
  const gatewayQ = useQuery<ActivePaymentGatewaysData>(
    GET_ACTIVE_PAYMENT_GATEWAYS,
    { fetchPolicy: "cache-and-network" },
  );

  const cart = cartQ.data?.myCart ?? null;
  const addresses = addrQ.data?.myAddresses ?? [];
  const gateways = gatewayQ.data?.activePaymentGateways ?? [];

  // ---- Form state ----
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [selectedGateway, setSelectedGateway] = useState<PaymentGateway | null>(
    null,
  );
  const [notes, setNotes] = useState("");
  // B2B GSTIN capture. When the customer toggles the "buying for business"
  // checkbox we reveal a GSTIN field; valid input is forwarded to the
  // backend and printed on the seller's tax invoice as the recipient GSTIN.
  const [b2bChecked, setB2bChecked] = useState(false);
  const [buyerGstin, setBuyerGstin] = useState("");
  const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][0-9A-Z][Z][0-9A-Z]$/;
  const buyerGstinValid = !b2bChecked || GSTIN_REGEX.test(buyerGstin);

  // Applied coupon — persisted from cart, re-validated against current cart.
  const {
    code: appliedCouponCode,
    discountAmount: couponDiscountPreTax,
    discountInclTax: couponDiscountInclTax,
    customerTotal: couponCustomerTotal,
  } = useAppliedCoupon({ cartSignal: cart?.subtotal });
  const clearAppliedCoupon = useCouponStore((s) => s.clear);

  // ---- Shipping quote (per-seller charge + COD eligibility + serviceability)
  // Reuses the same engine as placement, so the quoted total == what's charged.
  const shippingQ = useQuery<ShippingQuoteData>(GET_SHIPPING_QUOTE, {
    skip: !isAuthed || !selectedAddressId,
    fetchPolicy: "cache-and-network",
    errorPolicy: "ignore",
    variables: {
      input: {
        addressId: selectedAddressId,
        couponCode: appliedCouponCode ?? undefined,
      },
    },
  });
  const quote = shippingQ.data?.shippingQuote ?? null;
  const shippingTotal = quote?.shippingTotal ?? 0;
  const quoteServiceable = quote ? quote.serviceable : true;
  const quoteCodEligible = quote ? quote.codEligible : true;

  // Auto-select default address
  useEffect(() => {
    if (!selectedAddressId && addresses.length > 0) {
      const def = addresses.find((a) => a.isDefault) ?? addresses[0];
      setSelectedAddressId(def.id);
    }
  }, [addresses, selectedAddressId]);

  // Auto-select default gateway
  useEffect(() => {
    if (!selectedGateway && gateways.length > 0) {
      const def = gateways.find((g) => g.isDefault) ?? gateways[0];
      setSelectedGateway(def.gateway);
    }
  }, [gateways, selectedGateway]);

  // ---- Computed ----
  const activeGateway = useMemo(
    () => gateways.find((g) => g.gateway === selectedGateway) ?? null,
    [gateways, selectedGateway],
  );

  const processingFeeDisplay = useMemo(() => {
    if (!activeGateway || activeGateway.processingFee <= 0) return null;
    if (activeGateway.processingFeeType === "PERCENTAGE") {
      return `${activeGateway.processingFee}%`;
    }
    return formatPrice(activeGateway.processingFee);
  }, [activeGateway]);

  // ---- Place-order flow (initiate → COD redirect | Razorpay → verify) ----
  const { isProcessing, placeOrder } = usePlaceOrder({
    selectedAddressId,
    selectedGateway,
    notes,
    appliedCouponCode: appliedCouponCode ?? null,
    b2bChecked,
    buyerGstin,
    buyerGstinValid,
    clearAppliedCoupon,
  });

  // ---- Early returns ----
  if (!isAuthed) {
    return (
      <CenteredEmpty
        title="Sign in to checkout"
        body="Your cart and addresses are tied to your account."
        cta={{ href: "/login?next=/checkout", label: "Sign in" }}
      />
    );
  }

  if (cartQ.loading && !cart) {
    return <SkeletonView />;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <CenteredEmpty
        title="Your cart is empty"
        body="Add something to your cart before checking out."
        cta={{ href: "/shop", label: "Browse the shop" }}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 lg:py-14 space-y-8">
      <header>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Checkout
        </h1>
        <p className="mt-1 text-sm text-foreground/60">
          Review your details and place your order.
        </p>
      </header>

      <CartValidationNotice refreshSignal={cart.subtotal} />

      {cart.needsReview && (
        <div className="rounded-md border border-amber-300 bg-amber-50 px-4 py-3 flex items-start gap-3 text-sm">
          <AlertCircle className="h-4 w-4 text-feature mt-0.5 shrink-0" />
          <div className="flex-1">
            <strong className="font-semibold text-amber-900">
              Some items need attention.
            </strong>{" "}
            <span className="text-amber-800">
              Prices changed or items are out of stock. Resolve before placing
              your order.
            </span>
          </div>
          <Link
            href="/cart"
            className="text-sm font-semibold text-amber-900 underline whitespace-nowrap"
          >
            Open cart
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">
        {/* ------------- LEFT: Address + Payment + Notes ------------- */}
        <div className="space-y-8">
          <AddressSection
            addresses={addresses}
            loading={addrQ.loading}
            selectedAddressId={selectedAddressId}
            onSelect={setSelectedAddressId}
          />

          <PaymentMethodSection
            gateways={gateways}
            loading={gatewayQ.loading}
            selectedGateway={selectedGateway}
            onSelect={setSelectedGateway}
          />

          <OrderNotesSection notes={notes} onChange={setNotes} />

          <B2bGstinSection
            b2bChecked={b2bChecked}
            onToggle={(checked) => {
              setB2bChecked(checked);
              if (!checked) setBuyerGstin("");
            }}
            buyerGstin={buyerGstin}
            onGstinChange={setBuyerGstin}
            buyerGstinValid={buyerGstinValid}
          />
        </div>

        {/* ------------- RIGHT: Mini cart + Place order ------------- */}
        <OrderSummary
          cart={cart}
          showPriceWithTax={showPriceWithTax}
          getDisplayPrice={getDisplayPrice}
          couponDiscountPreTax={couponDiscountPreTax}
          couponDiscountInclTax={couponDiscountInclTax}
          couponCustomerTotal={couponCustomerTotal}
          quote={quote}
          shippingTotal={shippingTotal}
          shippingLoading={shippingQ.loading}
          activeGateway={activeGateway}
          processingFeeDisplay={processingFeeDisplay}
          selectedAddressId={selectedAddressId}
          selectedGateway={selectedGateway}
          quoteServiceable={quoteServiceable}
          quoteCodEligible={quoteCodEligible}
          hasAddresses={addresses.length > 0}
          isProcessing={isProcessing}
          onPlaceOrder={placeOrder}
        />
      </div>
    </div>
  );
}
