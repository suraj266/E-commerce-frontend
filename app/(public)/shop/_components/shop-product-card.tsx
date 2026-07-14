"use client";

/**
 * ShopProductCard — single card style for the shop / category grids.
 *
 * Visual style:
 *   - Tall card, rounded corners, resting shadow that lifts on hover
 *   - Image fills the upper portion against a soft cool token gradient
 *   - Centered title (display font) + "From ₹…" price below, brand-colored
 *   - Heart wishlist toggle in the top-right; auto-derived "Sale" /
 *     "New" badge top-left
 *
 * Interaction:
 *   - Item NOT in cart yet → "Add to cart" button (always visible on touch,
 *     slides up on hover for mouse) over the image bottom (only shows when
 *     SIMPLE; VARIABLE swaps to "View options" → routes to PDP).
 *   - Item IN cart → always-visible stepper [− qty +] at the bottom of
 *     the image, so the customer can adjust quantity right from the
 *     grid without opening the PDP. Decrementing to 0 removes the line.
 *
 * The image + title areas are wrapped in their own <Link> elements
 * (NOT a card-level wrapper), so clicks on the Add button or stepper
 * never accidentally trigger navigation to the PDP.
 */
import Link from "next/link";
import Image from "next/image";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Minus, Plus, ShoppingCart, SlidersHorizontal } from "lucide-react";
import { formatPrice } from "@/lib/utils/currency";
import { WishlistHeartButton } from "@/components/wishlist/wishlist-heart-button";
import { ProductLabels } from "@/components/products/product-labels";
import { VariantPickerDialog } from "@/components/products/variant-picker-dialog";
import { useCart } from "@/components/cart/use-cart";
import { useSiteSettings } from "@/lib/context/site-settings-context";
import type { Product } from "@/types/product.types";

interface CardProps {
  product: Product;
}

export function ShopProductCard({ product }: CardProps) {
  const router = useRouter();
  const { cart, add, updateQty, busy } = useCart();
  const { getDisplayPrice } = useSiteSettings();
  const [pickerOpen, setPickerOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  // One-shot celebratory "pop" on add — via the Web Animations API so it
  // replays on every add without remounting the image. Skips when the user
  // prefers reduced motion.
  function celebrate() {
    const el = cardRef.current;
    if (!el || typeof el.animate !== "function") return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    el.animate(
      [
        { transform: "scale(1)" },
        { transform: "scale(1.04)", offset: 0.4 },
        { transform: "scale(1)" },
      ],
      { duration: 400, easing: "ease-out" },
    );
  }
  const primary = product.images?.find((i) => i.isPrimary) ?? product.images?.[0];
  const onSale = isOnSale(product);
  const defaultVariant = product.variants?.[0];
  // Multiple variants → open a chooser popup. A single variant (even on a
  // VARIABLE product) adds straight to the cart.
  const hasMultipleVariants = (product.variants?.length ?? 0) > 1;
  const pdpHref = `/product/${product.slug}`;

  // For single-variant products, look up whether that variant is already in
  // the cart so we can render a stepper instead of the Add button. Multi-variant
  // cards show "View options" — we can't tell which variant is in the cart.
  const inCartItem = !hasMultipleVariants && defaultVariant
    ? cart?.items.find((i) => i.variantId === defaultVariant.id)
    : undefined;
  const inCartQty = inCartItem?.quantity ?? 0;

  async function handleAdd() {
    if (hasMultipleVariants) {
      setPickerOpen(true);
      return;
    }
    if (!defaultVariant) {
      router.push(pdpHref);
      return;
    }
    await add(defaultVariant.id, 1);
    celebrate();
  }

  async function handleIncrement() {
    if (!defaultVariant) return;
    await add(defaultVariant.id, 1, { silent: true });
    celebrate();
  }

  async function handleDecrement() {
    if (!defaultVariant || inCartQty === 0) return;
    // updateQty(0) deletes the line — see CartService.updateQty.
    await updateQty(defaultVariant.id, inCartQty - 1);
  }

  return (
    <article className="flex flex-col group transition-transform duration-300 ease-out hover:-translate-y-1">
      {/* ---------- Image area (the link target) ----------
          Rounded card with a resting shadow that lifts on hover for depth.
          Rest background is the token-driven cool gradient (icy blue →
          lavender) so a brand reskin stays coherent. The whole card also
          pops once on add-to-cart (see `popKey`). */}
      <div
        ref={cardRef}
        className="relative aspect-[4/5] overflow-hidden rounded-xl bg-gradient-to-br from-[var(--gradient-card-from)] via-[var(--gradient-card-via)] to-[var(--gradient-card-to)] shadow-sm transition-shadow duration-300 group-hover:shadow-xl dark:border dark:border-border-strong dark:shadow-none dark:group-hover:glow-accent"
      >
        {/* Whole image clickable as a link to PDP */}
        <Link
          href={pdpHref}
          aria-label={product.name}
          className="absolute inset-0 z-0"
        >
          {primary ? (
            <Image
              src={primary.imageUrl}
              alt={primary.altText ?? product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-foreground/30 text-xs">
              No image
            </div>
          )}
        </Link>

        <ProductLabels
          labels={product.labels}
          className="absolute top-3 left-3 z-10"
        />

        <WishlistHeartButton productId={product.id} />

        {/* Bottom scrim — lifts the Add/stepper controls off busy imagery.
            Mirrors control visibility: always on touch, on hover for mouse. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24 bg-gradient-to-t from-black/35 to-transparent opacity-100 transition-opacity duration-200 pointer-fine:opacity-0 pointer-fine:group-hover:opacity-100" />

        {/* ---------- Stepper (in cart) OR Add button (not in cart) ----------
            Both sit absolute on top of the image, above the link layer
            (z-20). Clicks here never reach the underlying link. */}
        <div className="absolute inset-x-3 bottom-3 z-20">
          {inCartQty > 0 ? (
            <CartStepper
              qty={inCartQty}
              busy={busy}
              onIncrement={handleIncrement}
              onDecrement={handleDecrement}
            />
          ) : (
            <HoverAddButton
              hasOptions={hasMultipleVariants}
              busy={busy}
              onClick={handleAdd}
            />
          )}
        </div>
      </div>

      {/* ---------- Title + price (centered, brand-colored) ---------- */}
      <div className="px-2 pt-4 pb-1 text-center space-y-1.5">
        <Link href={pdpHref}>
          <h3 className="font-heading text-sm sm:text-base font-bold tracking-tight text-brand line-clamp-2 min-h-[2.5em] hover:underline">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm sm:text-base font-semibold tracking-tight text-brand">
          {onSale && product.compareAtPrice != null ? (
            <>
              <span className="text-sale">{formatPrice(getDisplayPrice(product.price, product.priceWithTax))}</span>
              <span className="ml-2 font-normal text-foreground/40 line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            </>
          ) : (
            <>
              <span className="text-foreground/60 font-normal mr-1">From</span>
              {formatPrice(getDisplayPrice(product.price, product.priceWithTax))}
            </>
          )}
        </p>
      </div>

      {hasMultipleVariants && (
        <VariantPickerDialog
          product={product}
          open={pickerOpen}
          onOpenChange={setPickerOpen}
        />
      )}
    </article>
  );
}

/**
 * @deprecated Use `ShopProductCard` directly. Kept for backwards compat
 * with existing imports — renders identically.
 */
export const ShopFeatureCard = ShopProductCard;

/* -------------------------------------------------------------------------- */
/*  In-card stepper — replaces the Add button once the item is in the cart    */
/* -------------------------------------------------------------------------- */

function CartStepper({
  qty,
  busy,
  onIncrement,
  onDecrement,
}: {
  qty: number;
  busy: boolean;
  onIncrement: () => void;
  onDecrement: () => void;
}) {
  return (
    <div className="flex items-stretch overflow-hidden bg-brand text-brand-foreground shadow-lg">
      <button
        type="button"
        aria-label={qty === 1 ? "Remove from cart" : "Decrease quantity"}
        onClick={onDecrement}
        disabled={busy}
        className="flex-1 inline-flex items-center justify-center py-2.5 hover:bg-brand/90 transition disabled:opacity-60"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="px-4 py-2.5 text-sm sm:text-base font-semibold tabular-nums min-w-[3ch] text-center">
        {qty}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={onIncrement}
        disabled={busy || qty >= 99}
        className="flex-1 inline-flex items-center justify-center py-2.5 hover:bg-brand/90 transition disabled:opacity-60"
      >
        {busy ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Plus className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  "Add to cart" button. Always visible on touch (no hover there); on        */
/*  fine-pointer/mouse it slides up on hover. The primary conversion control  */
/*  must never be invisible on the device most shoppers actually use.         */
/*                                                                            */
/*  IMPORTANT: hide-on-rest uses opacity ONLY — never `pointer-events-none`   */
/*  + `group-hover:pointer-events-auto`. That trick is fragile: during the    */
/*  hover transition clicks can fall through to the Link layer under the      */
/*  image and trigger an unwanted PDP navigation. Keeping the button always   */
/*  interactive (just visually hidden) means clicks always land on the        */
/*  button, never on the Link sitting behind it.                              */
/* -------------------------------------------------------------------------- */

function HoverAddButton({
  hasOptions,
  busy,
  onClick,
}: {
  hasOptions: boolean;
  busy: boolean;
  onClick: () => void;
}) {
    // Visible by default (so touch devices — which have no hover — always see
    // it), and on fine-pointer (mouse) devices it slides up on hover only.
    // opacity/transform only — never pointer-events — so clicks always land on
    // the button, never the Link layer behind the image (see note above).
    return (
    <div className="opacity-100 translate-y-0 transition-all duration-200 pointer-fine:opacity-0 pointer-fine:translate-y-2 pointer-fine:group-hover:opacity-100 pointer-fine:group-hover:translate-y-0">
      <button
        type="button"
        onClick={onClick}
        disabled={busy}
        className="w-full min-h-11 inline-flex items-center justify-center gap-2 rounded-lg bg-cta text-cta-foreground px-4 py-2.5 text-xs sm:text-sm font-semibold shadow-lg hover:bg-cta/90 transition disabled:opacity-60"
        aria-label={hasOptions ? "View options" : "Add to cart"}
      >
        {hasOptions ? (
          <>
            <SlidersHorizontal className="h-3.5 w-3.5" />
            View options
          </>
        ) : (
          <>
            <ShoppingCart className="h-3.5 w-3.5" />
            {busy ? "Adding..." : "Add to cart"}
          </>
        )}
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

/** Drives the strike-through original price display (not the badge). */
function isOnSale(product: Product): boolean {
  return (
    product.compareAtPrice != null &&
    Number(product.compareAtPrice) > Number(product.price)
  );
}
