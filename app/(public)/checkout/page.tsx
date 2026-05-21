"use client";

/**
 * /checkout — multi-gateway checkout page.
 *
 * Layout: left column = address + payment gateway + notes; right column = order
 * summary (mini cart). Both panes scroll independently on tall viewports.
 *
 * Two-phase flow:
 *   Phase 1: initiateCheckout → creates order + payment session
 *   Phase 2 (online): Razorpay SDK popup → verifyPayment mutation
 *   Phase 2 (COD): order placed immediately, redirect to success
 *
 * Payment gateways are fetched dynamically from the backend — whatever
 * the admin has enabled shows up here automatically.
 */

import { useEffect, useMemo, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@apollo/client/react";
import { toast } from "sonner";
import {
  AlertCircle,
  CreditCard,
  Loader2,
  MapPin,
  Plus,
  ShieldCheck,
  Wallet,
  Banknote,
  CheckCircle2,
} from "lucide-react";

import { GET_MY_CART } from "@/lib/graphql/cart";
import { GET_MY_ADDRESSES } from "@/lib/graphql/account";
import {
  GET_ACTIVE_PAYMENT_GATEWAYS,
  INITIATE_CHECKOUT,
  VERIFY_PAYMENT,
} from "@/lib/graphql/payments";
import { MyCartData } from "@/types/cart.types";
import { Address, MyAddressesData } from "@/types/account.types";
import {
  InitiateCheckoutData,
  VerifyPaymentData,
  ActivePaymentGatewaysData,
  ActiveGateway,
  PaymentGateway,
} from "@/types/order.types";
import { useAuthStore } from "@/store/auth.store";
import { formatPrice } from "@/lib/utils/currency";
import { useSiteSettings } from "@/lib/context/site-settings-context";
import { ApplyCouponPanel } from "@/components/coupon/apply-coupon-panel";
import { useAppliedCoupon } from "@/components/coupon/use-applied-coupon";
import { useCouponStore } from "@/store/coupon.store";

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

// ===========================================================================
export default function CheckoutPage() {
  const router = useRouter();
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
    { fetchPolicy: "cache-and-network" }
  );

  const cart = cartQ.data?.myCart ?? null;
  const addresses = addrQ.data?.myAddresses ?? [];
  const gateways = gatewayQ.data?.activePaymentGateways ?? [];

  // ---- Form state ----
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null
  );
  const [selectedGateway, setSelectedGateway] = useState<PaymentGateway | null>(
    null
  );
  const [notes, setNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Applied coupon — persisted from cart, re-validated against current cart.
  const {
    code: appliedCouponCode,
    discountAmount: couponDiscountPreTax,
    discountInclTax: couponDiscountInclTax,
    customerTotal: couponCustomerTotal,
  } = useAppliedCoupon({ cartSignal: cart?.subtotal });
  const clearAppliedCoupon = useCouponStore((s) => s.clear);

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

  // ---- Mutations ----
  const [initiateCheckout] = useMutation<InitiateCheckoutData>(
    INITIATE_CHECKOUT
  );
  const [verifyPayment] = useMutation<VerifyPaymentData>(VERIFY_PAYMENT);

  // ---- Computed ----
  const activeGateway = useMemo(
    () => gateways.find((g) => g.gateway === selectedGateway) ?? null,
    [gateways, selectedGateway]
  );

  const processingFeeDisplay = useMemo(() => {
    if (!activeGateway || activeGateway.processingFee <= 0) return null;
    if (activeGateway.processingFeeType === "PERCENTAGE") {
      return `${activeGateway.processingFee}%`;
    }
    return formatPrice(activeGateway.processingFee);
  }, [activeGateway]);

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
            clearAppliedCoupon();
            toast.success("Payment successful! Redirecting...");
            router.push(`/account/orders/${orderId}`);
          } catch (err) {
            toast.error(
              err instanceof Error
                ? err.message
                : "Payment verification failed."
            );
          } finally {
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: () => {
            toast.info(
              "Payment cancelled. Your order is saved — you can retry from your orders."
            );
            setIsProcessing(false);
            router.push(`/account/orders/${orderId}`);
          },
        },
        theme: {
          color: "#6366f1",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    },
    [verifyPayment, router, clearAppliedCoupon]
  );

  // ---- Place Order Handler ----
  async function handleCheckout() {
    if (!selectedAddressId) {
      toast.error("Please select a shipping address.");
      return;
    }
    if (!selectedGateway) {
      toast.error("Please select a payment method.");
      return;
    }

    setIsProcessing(true);

    try {
      const res = await initiateCheckout({
        variables: {
          input: {
            shippingAddressId: selectedAddressId,
            gateway: selectedGateway,
            customerNotes: notes || undefined,
            couponCode: appliedCouponCode ?? undefined,
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
        clearAppliedCoupon();
        toast.success(`Order ${result.orderNumber} placed successfully!`);
        router.push(`/account/orders/${result.orderId}`);
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
        err instanceof Error ? err.message : "Could not initiate checkout."
      );
      setIsProcessing(false);
    }
  }

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
          {/* Address picker */}
          <section className="rounded-lg border bg-card p-6">
            <SectionHeader
              icon={MapPin}
              title="Shipping address"
              action={
                <Link
                  href="/account/addresses"
                  className="text-xs font-semibold text-brand hover:underline"
                >
                  Manage
                </Link>
              }
            />

            {addrQ.loading && addresses.length === 0 ? (
              <div className="text-sm text-foreground/60">
                <Loader2 className="inline h-4 w-4 animate-spin mr-2" />
                Loading addresses...
              </div>
            ) : addresses.length === 0 ? (
              <NoAddressBlock />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {addresses.map((a) => (
                  <AddressOption
                    key={a.id}
                    addr={a}
                    selected={selectedAddressId === a.id}
                    onSelect={() => setSelectedAddressId(a.id)}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Payment gateway selection */}
          <section className="rounded-lg border bg-card p-6">
            <SectionHeader icon={CreditCard} title="Payment method" />

            {gatewayQ.loading ? (
              <div className="text-sm text-foreground/60">
                <Loader2 className="inline h-4 w-4 animate-spin mr-2" />
                Loading payment methods...
              </div>
            ) : gateways.length === 0 ? (
              <div className="rounded-md border border-dashed bg-muted/20 px-4 py-6 text-center text-sm text-foreground/70">
                No payment methods are currently available. Please contact
                support.
              </div>
            ) : (
              <div className="space-y-2">
                {gateways.map((gw) => (
                  <GatewayOption
                    key={gw.id}
                    gw={gw}
                    selected={selectedGateway === gw.gateway}
                    onSelect={() => setSelectedGateway(gw.gateway)}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Notes */}
          <section className="rounded-lg border bg-card p-6">
            <SectionHeader icon={ShieldCheck} title="Order notes (optional)" />
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value.slice(0, 500))}
              placeholder="Anything the seller should know? (e.g. delivery instructions)"
              rows={3}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-brand transition resize-none"
            />
            <p className="mt-1 text-xs text-foreground/50">
              {notes.length} / 500
            </p>
          </section>
        </div>

        {/* ------------- RIGHT: Mini cart + Place order ------------- */}
        <aside className="lg:sticky lg:top-24 self-start space-y-4">
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-base font-semibold mb-4">Order summary</h2>

            <ul className="space-y-3 max-h-72 overflow-y-auto pr-1 -mr-1">
              {cart.items.map((it) => (
                <li
                  key={it.id}
                  className="flex gap-3 items-start text-sm"
                >
                  <div className="relative h-14 w-14 shrink-0 rounded-md overflow-hidden bg-muted">
                    {it.product?.images?.[0]?.imageUrl ? (
                      <Image
                        src={it.product.images[0].imageUrl}
                        alt={it.product.name}
                        fill
                        sizes="100px"
                        className="object-cover"
                      />
                    ) : null}
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-brand text-white text-[10px] font-bold flex items-center justify-center">
                      {it.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium line-clamp-2">
                      {it.product?.name ?? "Product"}
                    </div>
                    {it.variant?.attributes &&
                      it.variant.attributes.length > 0 && (
                        <div className="text-xs text-foreground/60 line-clamp-1">
                          {it.variant.attributes
                            .map((a) => a.value)
                            .join(" / ")}
                        </div>
                      )}
                  </div>
                  <div className="text-right text-sm font-semibold">
                    {formatPrice(
                      showPriceWithTax
                        ? getDisplayPrice(
                            it.unitPriceCurrent,
                            it.variant?.priceWithTax ?? null
                          ) * it.quantity
                        : it.lineTotal
                    )}
                  </div>
                </li>
              ))}
            </ul>

            {(() => {
              const displaySubtotal = showPriceWithTax
                ? cart.items.reduce((sum, item) => {
                    const unitPrice = getDisplayPrice(
                      item.unitPriceCurrent,
                      item.variant?.priceWithTax ?? null
                    );
                    return sum + unitPrice * item.quantity;
                  }, 0)
                : cart.subtotal;

              // Match the discount line to the display mode. Pre-tax mode
              // shows ₹X off; tax-inclusive mode shows the effective ₹X +
              // GST reduction, which is the real customer saving.
              const couponDiscount = showPriceWithTax
                ? couponDiscountInclTax
                : couponDiscountPreTax;

              // Base total: prefer the server's customerTotal in tax-inclusive
              // mode (it accounts for GST recomputing on the discounted base),
              // otherwise fall back to subtotal − discount.
              let displayTotal =
                showPriceWithTax && couponCustomerTotal != null
                  ? couponCustomerTotal
                  : Math.max(0, displaySubtotal - couponDiscount);

              // Processing fee tacks on top of whichever base we chose.
              if (
                activeGateway &&
                activeGateway.processingFee > 0 &&
                activeGateway.processingFeeType === "FIXED"
              ) {
                displayTotal += activeGateway.processingFee;
              }
              if (
                activeGateway &&
                activeGateway.processingFee > 0 &&
                activeGateway.processingFeeType === "PERCENTAGE"
              ) {
                displayTotal +=
                  (displayTotal * activeGateway.processingFee) / 100;
              }

              return (
                <>
                  <div className="mt-5 pt-4 border-t space-y-2 text-sm">
                    <Row
                      label={`Subtotal${showPriceWithTax ? " (incl. tax)" : ""}`}
                      value={formatPrice(displaySubtotal)}
                    />
                    <Row label="Shipping" value="Free" />
                    {!showPriceWithTax && (
                      <Row label="Tax" value="Calculated by seller" />
                    )}
                    {couponDiscount > 0 && (
                      <Row
                        label="Coupon discount"
                        value={`− ${formatPrice(couponDiscount)}`}
                      />
                    )}
                    {processingFeeDisplay && (
                      <Row
                        label="Processing fee"
                        value={processingFeeDisplay}
                      />
                    )}
                  </div>

                  <div className="mt-4 pt-4">
                    <ApplyCouponPanel cartSignal={cart.subtotal} compact />
                  </div>

                  <div className="mt-4 pt-4 border-t flex items-baseline justify-between">
                    <span className="text-base font-semibold">Total</span>
                    <span className="text-xl font-bold">
                      {formatPrice(displayTotal)}
                    </span>
                  </div>
                </>
              );
            })()}

            {/* Selected gateway summary */}
            {activeGateway && (
              <div className="mt-3 rounded-md bg-muted/50 px-3 py-2 flex items-center gap-2 text-xs">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-600 shrink-0" />
                <span className="text-foreground/70">
                  Paying via{" "}
                  <span className="font-semibold text-foreground">
                    {activeGateway.displayName}
                  </span>
                </span>
              </div>
            )}

            <button
              type="button"
              onClick={handleCheckout}
              disabled={
                isProcessing ||
                cart.needsReview ||
                addresses.length === 0 ||
                !selectedAddressId ||
                !selectedGateway
              }
              className="mt-5 w-full inline-flex items-center justify-center rounded-md bg-brand text-white px-6 py-3 text-sm font-semibold shadow hover:bg-brand/90 transition disabled:opacity-60"
            >
              {isProcessing && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isProcessing
                ? "Processing..."
                : selectedGateway === "COD"
                  ? "Place order (Cash on Delivery)"
                  : "Proceed to payment"}
            </button>
            <p className="mt-2 text-xs text-foreground/50 text-center">
              By placing this order you agree to our terms.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function SectionHeader({
  icon: Icon,
  title,
  action,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-base font-semibold flex items-center gap-2">
        <Icon className="h-4 w-4 text-foreground/60" />
        {title}
      </h2>
      {action}
    </div>
  );
}

function AddressOption({
  addr,
  selected,
  onSelect,
}: {
  addr: Address;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`text-left rounded-md border p-4 transition ${
        selected
          ? "border-brand bg-blue-50/50 ring-2 ring-brand/10"
          : "hover:border-foreground/40"
      }`}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[10px] uppercase tracking-wide font-semibold text-foreground/60">
          {addr.label || addr.type}
        </span>
        {addr.isDefault && (
          <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-brand text-white">
            Default
          </span>
        )}
      </div>
      <div className="text-sm font-semibold">
        {addr.firstName} {addr.lastName}
      </div>
      <div className="text-xs text-foreground/70 mt-1 leading-relaxed">
        {addr.addressLine1}
        {addr.addressLine2 && <>, {addr.addressLine2}</>}
        <br />
        {addr.city}, {addr.state} {addr.postalCode}
      </div>
      {addr.phone && (
        <div className="text-xs text-foreground/60 mt-1">{addr.phone}</div>
      )}
    </button>
  );
}

/** Dynamic gateway option card — replaces the old hardcoded PaymentOption. */
function GatewayOption({
  gw,
  selected,
  onSelect,
}: {
  gw: ActiveGateway;
  selected: boolean;
  onSelect: () => void;
}) {
  const icon =
    gw.gateway === "COD" ? (
      <Banknote className="h-5 w-5 text-foreground/60" />
    ) : (
      <Wallet className="h-5 w-5 text-foreground/60" />
    );

  return (
    <label
      className={`flex items-start gap-3 rounded-md border p-3 transition cursor-pointer ${
        selected
          ? "border-brand bg-blue-50/50"
          : "hover:border-foreground/40"
      }`}
    >
      <input
        type="radio"
        name="payment-gateway"
        value={gw.gateway}
        checked={selected}
        onChange={onSelect}
        className="mt-0.5 h-4 w-4"
      />
      <div className="flex items-center gap-2.5 flex-1 min-w-0">
        {gw.logoUrl ? (
          <div className="relative h-6 w-6">
            <Image
              src={gw.logoUrl}
              alt={gw.displayName}
              fill
              sizes="50px"
              className="object-contain rounded"
            />
          </div>
        ) : (
          icon
        )}
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold flex items-center gap-2">
            {gw.displayName}
            {gw.isDefault && (
              <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                Recommended
              </span>
            )}
          </div>
          {gw.description && (
            <div className="text-xs text-foreground/60 mt-0.5 line-clamp-1">
              {gw.description}
            </div>
          )}
          {gw.processingFee > 0 && (
            <div className="text-xs text-foreground/50 mt-0.5">
              Processing fee:{" "}
              {gw.processingFeeType === "PERCENTAGE"
                ? `${gw.processingFee}%`
                : formatPrice(gw.processingFee)}
            </div>
          )}
        </div>
      </div>
    </label>
  );
}

function NoAddressBlock() {
  return (
    <div className="rounded-md border border-dashed bg-muted/20 px-4 py-6 text-center">
      <p className="text-sm text-foreground/70">
        You don&apos;t have any saved addresses.
      </p>
      <Link
        href="/account/addresses"
        className="mt-3 inline-flex items-center justify-center rounded-md bg-brand text-white px-5 py-2 text-sm font-semibold hover:bg-brand/90 transition"
      >
        <Plus className="mr-1.5 h-4 w-4" />
        Add an address
      </Link>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-foreground/70">
      <span>{label}</span>
      <span className="text-foreground">{value}</span>
    </div>
  );
}

function CenteredEmpty({
  title,
  body,
  cta,
}: {
  title: string;
  body: string;
  cta: { href: string; label: string };
}) {
  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      <p className="text-sm text-foreground/60">{body}</p>
      <Link
        href={cta.href}
        className="inline-flex items-center justify-center rounded-md bg-brand px-6 py-3 text-sm font-semibold text-white shadow hover:bg-brand/90 transition"
      >
        {cta.label}
      </Link>
    </div>
  );
}

function SkeletonView() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10 lg:py-14">
      <div className="h-8 w-48 bg-muted animate-pulse rounded mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-32 rounded-lg bg-muted animate-pulse"
            />
          ))}
        </div>
        <div className="h-72 rounded-lg bg-muted animate-pulse" />
      </div>
    </div>
  );
}
