"use client";

/**
 * /cart — customer's active shopping cart.
 *
 * Render states:
 *   1. Not logged in            → "Sign in to view your cart"
 *   2. Logged in, no items      → "Your cart is empty"
 *   3. Logged in, has items     → line items + summary panel
 *   4. Forbidden (admin/seller) → "Cart is only for customer accounts"
 *
 * Each line shows:
 *   - product image, name, variant axes
 *   - qty stepper (+/-) with live mutation
 *   - line total + remove
 *   - inline warning when price changed since add OR variant is OOS
 */

import Link from "next/link";
import Image from "next/image";
import { Loader2, Minus, Plus, ShoppingBag, Trash2, AlertCircle } from "lucide-react";

import { useCart } from "@/components/cart/use-cart";
import { useAuthStore } from "@/store/auth.store";
import { formatPrice } from "@/lib/utils/currency";
import { useSiteSettings } from "@/lib/context/site-settings-context";
import { ApplyCouponPanel } from "@/components/coupon/apply-coupon-panel";
import { useAppliedCoupon } from "@/components/coupon/use-applied-coupon";
import type { CartItem } from "@/types/cart.types";

export default function CartPage() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const isAuthed = !!accessToken;
  const { cart, loading, busy, add, updateQty, remove, clear } = useCart();
  const { showPriceWithTax, getDisplayPrice } = useSiteSettings();
  const { discountAmount: couponDiscount } = useAppliedCoupon({
    cartSignal: cart?.subtotal,
  });

  if (!isAuthed) {
    return (
      <CenteredEmpty
        title="Sign in to view your cart"
        body="Your cart is tied to your account so you can pick up where you left off on any device."
        cta={{ href: "/login?next=/cart", label: "Sign in" }}
        secondaryCta={{ href: "/register", label: "Create an account" }}
      />
    );
  }

  if (loading && !cart) {
    return <SkeletonView />;
  }

  const items = cart?.items ?? [];

  if (items.length === 0) {
    return (
      <CenteredEmpty
        title="Your cart is empty"
        body="Add something to your cart to get started."
        cta={{ href: "/shop", label: "Browse the shop" }}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 lg:py-14">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between border-b pb-5 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Shopping Cart
          </h1>
          <p className="mt-1 text-sm text-foreground/60">
            {cart?.itemCount} {cart?.itemCount === 1 ? "item" : "items"}
          </p>
        </div>
        <button
          type="button"
          onClick={() => clear()}
          disabled={busy}
          className="text-sm text-foreground/60 hover:text-destructive transition disabled:opacity-60"
        >
          Clear cart
        </button>
      </header>

      {cart?.needsReview && (
        <div className="mb-6 rounded-md border border-amber-300 bg-amber-50 px-4 py-3 flex items-start gap-3 text-sm">
          <AlertCircle className="h-4 w-4 text-feature mt-0.5 shrink-0" />
          <div>
            <strong className="font-semibold text-amber-900">
              Some items need your attention.
            </strong>{" "}
            <span className="text-amber-800">
              Prices may have changed or stock may be low. Review each line
              before checking out.
            </span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">
        {/* ---- Lines ---- */}
        <ul className="space-y-4">
          {items.map((item) => (
            <li key={item.id}>
              <CartLine
                item={item}
                busy={busy}
                onIncrement={() => add(item.variantId, 1, { silent: true })}
                onDecrement={() =>
                  updateQty(item.variantId, Math.max(1, item.quantity - 1))
                }
                onSetQty={(q) => updateQty(item.variantId, q)}
                onRemove={() => remove(item.variantId)}
              />
            </li>
          ))}
        </ul>

        {/* ---- Summary panel ---- */}
        <aside className="lg:sticky lg:top-24 self-start rounded-lg border bg-card p-6 space-y-5">
          <h2 className="text-lg font-semibold">Order summary</h2>

          {(() => {
            // Compute tax-inclusive subtotal if setting is ON
            const displaySubtotal = showPriceWithTax
              ? items.reduce((sum, item) => {
                  const unitPrice = getDisplayPrice(
                    item.unitPriceCurrent,
                    item.variant?.priceWithTax ?? null,
                  );
                  return sum + unitPrice * item.quantity;
                }, 0)
              : (cart?.subtotal ?? 0);

            const estimatedTotal = Math.max(0, displaySubtotal - couponDiscount);
            return (
              <>
                <div className="space-y-2 text-sm">
                  <SummaryRow
                    label={`Subtotal (${cart?.itemCount ?? 0} ${
                      cart?.itemCount === 1 ? "item" : "items"
                    })${showPriceWithTax ? " incl. tax" : ""}`}
                    value={formatPrice(displaySubtotal)}
                  />
                  <SummaryRow label="Shipping" value="Calculated at checkout" />
                  {!showPriceWithTax && (
                    <SummaryRow label="Tax" value="Calculated at checkout" />
                  )}
                  {couponDiscount > 0 && (
                    <SummaryRow
                      label="Coupon discount"
                      value={`− ${formatPrice(couponDiscount)}`}
                    />
                  )}
                </div>

                <ApplyCouponPanel cartSignal={cart?.subtotal} />

                <div className="border-t pt-4 flex items-baseline justify-between">
                  <span className="text-base font-semibold">Estimated total</span>
                  <span className="text-xl font-bold">
                    {formatPrice(estimatedTotal)}
                  </span>
                </div>
              </>
            );
          })()}

          <Link
            href="/checkout"
            aria-disabled={busy || cart?.needsReview}
            onClick={(e) => {
              if (busy || cart?.needsReview) e.preventDefault();
            }}
            className={`w-full inline-flex items-center justify-center rounded-md bg-brand text-white px-6 py-3 text-sm font-semibold shadow hover:bg-brand/90 transition ${
              busy || cart?.needsReview
                ? "opacity-60 pointer-events-none"
                : ""
            }`}
          >
            Proceed to Checkout
          </Link>
          {cart?.needsReview && (
            <p className="text-xs text-feature/90 text-center">
              Resolve flagged items above to continue.
            </p>
          )}
          <Link
            href="/shop"
            className="block text-center text-sm text-foreground/60 hover:text-foreground transition"
          >
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function CartLine({
  item,
  busy,
  onIncrement,
  onDecrement,
  onSetQty,
  onRemove,
}: {
  item: CartItem;
  busy: boolean;
  onIncrement: () => void;
  onDecrement: () => void;
  onSetQty: (q: number) => void;
  onRemove: () => void;
}) {
  const product = item.product;
  if (!product) return null;
  const primary =
    product.images?.find((i) => i.isPrimary) ?? product.images?.[0];
  const variantImage = item.variant?.imageUrl;
  const img = variantImage || primary?.imageUrl || null;
  const variantAxes = item.variant?.attributes ?? [];
  const oos = item.stockState === "OUT_OF_STOCK";
  const lowStock = item.stockState === "LOW_STOCK";

  return (
    <div className="flex gap-4 rounded-lg border bg-card p-4">
      <Link
        href={`/product/${product.slug}`}
        className="relative h-24 w-24 sm:h-28 sm:w-28 shrink-0 rounded-md overflow-hidden bg-muted"
      >
        {img ? (
          <Image
            src={img}
            alt={product.name}
            fill
            sizes="120px"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted-foreground/10" />
        )}
      </Link>

      <div className="flex-1 min-w-0 flex flex-col">
        <Link
          href={`/product/${product.slug}`}
          className="text-sm sm:text-base font-semibold tracking-tight hover:underline line-clamp-2"
        >
          {product.name}
        </Link>
        {variantAxes.length > 0 && (
          <p className="mt-0.5 text-xs text-foreground/60">
            {variantAxes.map((a) => `${a.attributeName}: ${a.value}`).join(" · ")}
          </p>
        )}

        {/* Per-line warnings */}
        <div className="mt-1 space-y-0.5 text-xs">
          {item.priceChanged && (
            <p className="text-feature/90">
              Price changed: was {formatPrice(item.unitPriceSnapshot)}, now{" "}
              <span className="font-semibold">
                {formatPrice(item.unitPriceCurrent)}
              </span>
            </p>
          )}
          {oos && (
            <p className="text-sale font-medium">
              Out of stock — remove or save for later.
            </p>
          )}
          {!oos && lowStock && (
            <p className="text-feature/90">
              Only {item.availableQuantity} left in stock.
            </p>
          )}
        </div>

        <div className="mt-auto pt-3 flex items-center justify-between gap-3 flex-wrap">
          {/* Qty stepper */}
          <div className="inline-flex items-center rounded-md border">
            <button
              type="button"
              onClick={onDecrement}
              disabled={busy || item.quantity <= 1}
              aria-label="Decrease quantity"
              className="h-9 w-9 inline-flex items-center justify-center text-foreground/70 hover:text-foreground disabled:opacity-40 transition"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <input
              type="number"
              min={1}
              max={99}
              value={item.quantity}
              onChange={(e) => {
                const q = Math.max(1, Math.min(99, Number(e.target.value) || 1));
                if (q !== item.quantity) onSetQty(q);
              }}
              className="h-9 w-12 text-center text-sm bg-transparent outline-none"
              aria-label="Quantity"
            />
            <button
              type="button"
              onClick={onIncrement}
              disabled={busy || item.quantity >= 99}
              aria-label="Increase quantity"
              className="h-9 w-9 inline-flex items-center justify-center text-foreground/70 hover:text-foreground disabled:opacity-40 transition"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-base sm:text-lg font-semibold">
              {formatPrice(item.lineTotal)}
            </span>
            <button
              type="button"
              onClick={onRemove}
              disabled={busy}
              aria-label="Remove from cart"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border text-foreground/60 hover:text-destructive hover:border-destructive transition disabled:opacity-60"
            >
              {busy ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
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
  secondaryCta,
}: {
  title: string;
  body: string;
  cta?: { href: string; label: string };
  secondaryCta?: { href: string; label: string };
}) {
  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
      <ShoppingBag className="mx-auto h-10 w-10 text-foreground/30" />
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      <p className="text-sm text-foreground/60">{body}</p>
      {(cta || secondaryCta) && (
        <div className="pt-3 flex flex-col sm:flex-row gap-3 justify-center">
          {cta && (
            <Link
              href={cta.href}
              className="inline-flex items-center justify-center rounded-md bg-brand px-6 py-3 text-sm font-semibold text-white shadow hover:bg-brand/90 transition"
            >
              {cta.label}
            </Link>
          )}
          {secondaryCta && (
            <Link
              href={secondaryCta.href}
              className="inline-flex items-center justify-center rounded-md border px-6 py-3 text-sm font-semibold text-foreground/80 hover:border-foreground/40 transition"
            >
              {secondaryCta.label}
            </Link>
          )}
        </div>
      )}
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
