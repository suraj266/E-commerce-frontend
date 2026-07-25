"use client";

import Image from "next/image";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

import { Cart } from "@/types/cart.types";
import { ShippingQuote } from "@/types/shipping.types";
import { ActiveGateway, PaymentGateway } from "@/types/order.types";
import { formatPrice } from "@/lib/utils/currency";
import { ApplyCouponPanel } from "@/components/coupon/apply-coupon-panel";
import { Row } from "./checkout-ui";

/**
 * Order summary (right rail): mini cart, the reconciling totals block,
 * serviceability / COD warnings, the selected-gateway confirmation, and the
 * place-order button. The totals math is preserved exactly from the original
 * single-file checkout so the displayed total is byte-for-byte identical.
 */
export function OrderSummary({
  cart,
  showPriceWithTax,
  getDisplayPrice,
  couponDiscountPreTax,
  couponDiscountInclTax,
  couponCustomerTotal,
  quote,
  shippingTotal,
  shippingLoading,
  activeGateway,
  processingFeeDisplay,
  selectedAddressId,
  selectedGateway,
  quoteServiceable,
  quoteCodEligible,
  hasAddresses,
  isProcessing,
  onPlaceOrder,
}: {
  cart: Cart;
  showPriceWithTax: boolean;
  getDisplayPrice: (
    price: number | null | undefined,
    priceWithTax: number | null | undefined,
  ) => number;
  couponDiscountPreTax: number;
  couponDiscountInclTax: number;
  couponCustomerTotal: number | null;
  quote: ShippingQuote | null;
  shippingTotal: number;
  shippingLoading: boolean;
  activeGateway: ActiveGateway | null;
  processingFeeDisplay: string | null;
  selectedAddressId: string | null;
  selectedGateway: PaymentGateway | null;
  quoteServiceable: boolean;
  quoteCodEligible: boolean;
  hasAddresses: boolean;
  isProcessing: boolean;
  onPlaceOrder: () => void;
}) {
  return (
    <aside className="lg:sticky lg:top-24 self-start space-y-4">
      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-base font-semibold mb-4">Order summary</h2>

        <ul className="space-y-3 max-h-72 overflow-y-auto pr-1 -mr-1">
          {cart.items.map((it) => (
            <li key={it.id} className="flex gap-3 items-start text-sm">
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
                {it.variant?.attributes && it.variant.attributes.length > 0 && (
                  <div className="text-xs text-foreground/60 line-clamp-1">
                    {it.variant.attributes.map((a) => a.value).join(" / ")}
                  </div>
                )}
              </div>
              <div className="text-right text-sm font-semibold">
                {formatPrice(
                  showPriceWithTax
                    ? getDisplayPrice(
                        it.unitPriceCurrent,
                        it.variant?.priceWithTax ?? null,
                      ) * it.quantity
                    : it.lineTotal,
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
                  item.variant?.priceWithTax ?? null,
                );
                return sum + unitPrice * item.quantity;
              }, 0)
            : cart.subtotal;

          // GST estimate across the cart (per-line taxAmount = unit tax × qty).
          const taxEstimate = cart.items.reduce(
            (sum, item) => sum + (item.taxAmount ?? 0),
            0,
          );

          // Match the discount line to the display mode. Pre-tax mode
          // shows ₹X off; tax-inclusive mode shows the effective ₹X +
          // GST reduction, which is the real customer saving.
          const couponDiscount = showPriceWithTax
            ? couponDiscountInclTax
            : couponDiscountPreTax;

          // Goods total is always tax-INCLUSIVE (the stored price is base;
          // GST is always charged). Prefer the server's customerTotal (it
          // recomputes GST on the discounted base), else base + GST. When
          // the toggle is ON the subtotal already carries GST.
          const goodsTotalInclTax =
            couponCustomerTotal != null
              ? couponCustomerTotal
              : showPriceWithTax
                ? displaySubtotal
                : Math.max(0, displaySubtotal - couponDiscount) + taxEstimate;

          // When the subtotal is shown pre-tax, surface GST as its own line
          // so Subtotal − Discount + Tax + Shipping reconciles to the total.
          const taxLine = !showPriceWithTax
            ? Math.max(0, goodsTotalInclTax - (displaySubtotal - couponDiscount))
            : null;

          let displayTotal = goodsTotalInclTax;

          // Shipping (tax-inclusive) — a flat add on the goods total.
          displayTotal += shippingTotal;

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
            displayTotal += (displayTotal * activeGateway.processingFee) / 100;
          }

          return (
            <>
              <div className="mt-5 pt-4 border-t space-y-2 text-sm">
                <Row
                  label={`Subtotal${showPriceWithTax ? " (incl. tax)" : ""}`}
                  value={formatPrice(displaySubtotal)}
                />
                <Row
                  label={(() => {
                    const couriers = Array.from(
                      new Set(
                        (quote?.sellers ?? [])
                          .filter((s) => s.rateSource === "LIVE" && s.courierName)
                          .map((s) => s.courierName as string),
                      ),
                    );
                    return couriers.length > 0
                      ? `Shipping (via ${couriers.join(", ")})`
                      : "Shipping";
                  })()}
                  value={
                    !selectedAddressId
                      ? "Select an address"
                      : shippingLoading && !quote
                        ? "Calculating…"
                        : shippingTotal > 0
                          ? formatPrice(shippingTotal)
                          : "Free"
                  }
                />
                {taxLine != null && (
                  <Row
                    label="Tax (GST)"
                    value={
                      taxLine > 0
                        ? formatPrice(taxLine)
                        : "Calculated by seller"
                    }
                  />
                )}
                {couponDiscount > 0 && (
                  <Row
                    label="Coupon discount"
                    value={`− ${formatPrice(couponDiscount)}`}
                  />
                )}
                {processingFeeDisplay && (
                  <Row label="Processing fee" value={processingFeeDisplay} />
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

        {/* Serviceability + COD eligibility warnings */}
        {selectedAddressId && !quoteServiceable && (
          <div className="mt-3 rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2 flex items-start gap-2 text-xs text-destructive">
            <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
            <span>
              One or more items can&apos;t be delivered to this address. Try a
              different address.
            </span>
          </div>
        )}
        {selectedAddressId &&
          quoteServiceable &&
          selectedGateway === "COD" &&
          !quoteCodEligible && (
            <div className="mt-3 rounded-md border border-amber-400/40 bg-amber-50 px-3 py-2 flex items-start gap-2 text-xs text-amber-700">
              <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
              <span>
                Cash on Delivery isn&apos;t available for this order. Please
                choose another payment method.
              </span>
            </div>
          )}

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
          onClick={onPlaceOrder}
          disabled={
            isProcessing ||
            cart.needsReview ||
            !hasAddresses ||
            !selectedAddressId ||
            !selectedGateway ||
            (!!selectedAddressId && !quoteServiceable) ||
            (selectedGateway === "COD" && !quoteCodEligible)
          }
          className="mt-5 w-full inline-flex items-center justify-center rounded-md bg-brand text-white px-6 py-3 text-sm font-semibold shadow hover:bg-brand/90 transition disabled:opacity-60"
        >
          {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
  );
}
