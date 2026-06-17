"use client";

/**
 * VariantPickerDialog — quick variant chooser shown from a product card when a
 * product has MORE THAN ONE variant. Two-column layout: large product image on
 * the left; title, description, option tiles, quantity + Add to cart on the
 * right. Single-variant products add directly from the card and never open this.
 */

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ArrowRight, Loader2, Minus, Plus, ShoppingCart } from "lucide-react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils/currency";
import { useCart } from "@/components/cart/use-cart";
import { useSiteSettings } from "@/lib/context/site-settings-context";
import type { Product, ProductVariant } from "@/types/product.types";

/** The single attribute value for a 1-axis product, else the full combo / name. */
function variantTileLabel(v: ProductVariant, singleAxis: boolean): string {
  if (v.attributes?.length) {
    if (singleAxis) return v.attributes[0].value;
    return v.attributes.map((a) => a.value).join(" / ");
  }
  return v.name || v.sku;
}

function isOutOfStock(v: ProductVariant): boolean {
  return v.stockState === "OUT_OF_STOCK" || v.availableQuantity === 0;
}

export function VariantPickerDialog({
  product,
  open,
  onOpenChange,
}: {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const { add, busy } = useCart();
  const { getDisplayPrice } = useSiteSettings();
  const primary = product.images?.find((i) => i.isPrimary) ?? product.images?.[0];
  const variants = product.variants ?? [];
  const pdpHref = `/product/${product.slug}`;

  // Too many options to fit comfortably → show the first few + a "View more"
  // tile that routes to the full product page.
  const MAX_TILES = 6;
  const overflow = variants.length > MAX_TILES;
  const visibleVariants = overflow ? variants.slice(0, MAX_TILES - 1) : variants;

  // Distinct attribute axes across the variants (e.g. ["Print Finish"]).
  const axes = useMemo(() => {
    const names = new Set<string>();
    for (const v of variants) for (const a of v.attributes ?? []) names.add(a.attributeName);
    return [...names];
  }, [variants]);
  const singleAxis = axes.length === 1;
  const heading = singleAxis ? axes[0] : "Options";

  const firstAvailable = useMemo(
    () =>
      visibleVariants.find((v) => !isOutOfStock(v))?.id ??
      visibleVariants[0]?.id ??
      "",
    [visibleVariants],
  );
  const [selectedId, setSelectedId] = useState<string>(firstAvailable);
  const [qty, setQty] = useState(1);
  const selected =
    variants.find((v) => v.id === selectedId) ?? variants.find((v) => v.id === firstAvailable);
  const maxQty = selected?.availableQuantity ?? 99;

  async function handleAdd() {
    if (!selected) return;
    const ok = await add(selected.id, qty);
    if (ok) onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl p-0 overflow-hidden">
        <DialogTitle className="sr-only">{product.name} — choose options</DialogTitle>
        <div className="grid sm:grid-cols-2 sm:items-stretch">
          {/* ---------- Image (fills the column height) ---------- */}
          <div className="relative bg-muted overflow-hidden aspect-square sm:aspect-auto sm:rounded-l-xl">
            {primary ? (
              <Image
                src={primary.imageUrl}
                alt={primary.altText ?? product.name}
                fill
                sizes="(max-width: 640px) 100vw, 384px"
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-xs text-foreground/30">
                No image
              </div>
            )}
          </div>

          {/* ---------- Details ---------- */}
          <div className="flex flex-col p-6">
            <h2 className="text-2xl font-bold tracking-tight leading-tight pr-8">
              {product.name}
            </h2>

            {/* Option tiles */}
            <div className="mt-5">
              <p className="text-sm font-medium mb-2">{heading}</p>
              <div className="grid grid-cols-3 gap-2">
                {visibleVariants.map((v) => {
                  const oos = isOutOfStock(v);
                  const sel = selected?.id === v.id;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      disabled={oos}
                      onClick={() => {
                        setSelectedId(v.id);
                        setQty(1);
                      }}
                      className={`rounded-lg border px-3 py-2.5 text-left transition disabled:opacity-50 disabled:cursor-not-allowed ${
                        sel
                          ? "border-foreground ring-1 ring-foreground"
                          : "hover:border-foreground/40"
                      }`}
                    >
                      <div className="text-sm font-semibold leading-tight">
                        {variantTileLabel(v, singleAxis)}
                      </div>
                      <div className="text-sm font-bold mt-0.5">
                        {formatPrice(getDisplayPrice(v.price, v.priceWithTax))}
                      </div>
                      <div className="text-[11px] mt-0.5">
                        {oos ? (
                          <span className="text-destructive">Out of stock</span>
                        ) : v.stockState === "LOW_STOCK" ? (
                          <span className="text-amber-600">Only {v.availableQuantity} left</span>
                        ) : (
                          <span className="text-green-600">In stock</span>
                        )}
                      </div>
                    </button>
                  );
                })}

                {overflow && (
                  <button
                    type="button"
                    onClick={() => {
                      onOpenChange(false);
                      router.push(pdpHref);
                    }}
                    className="rounded-lg border border-dashed flex flex-col items-center justify-center text-center px-3 py-2.5 hover:border-foreground/50 hover:bg-muted/40 transition"
                  >
                    <span className="inline-flex items-center gap-1 text-sm font-semibold">
                      View more <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                    <span className="text-[11px] text-muted-foreground mt-0.5">
                      +{variants.length - (MAX_TILES - 1)} options
                    </span>
                  </button>
                )}
              </div>
            </div>

            {/* Quantity + Add to cart */}
            <div className="mt-6 flex items-center gap-3">
              <div className="flex items-center rounded-lg border shrink-0">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  disabled={qty <= 1}
                  className="px-3 py-3 hover:bg-muted transition disabled:opacity-40"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-3 text-sm font-semibold tabular-nums min-w-[2.5ch] text-center">
                  {qty}
                </span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
                  disabled={qty >= maxQty}
                  className="px-3 py-3 hover:bg-muted transition disabled:opacity-40"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <Button
                size="lg"
                className="flex-1"
                onClick={handleAdd}
                disabled={busy || !selected || isOutOfStock(selected)}
              >
                {busy ? (
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                ) : (
                  <ShoppingCart className="h-5 w-5 mr-2" />
                )}
                Add to Cart
              </Button>
            </div>

            <Link
              href={`/product/${product.slug}`}
              className="mt-3 text-sm font-medium underline underline-offset-4 self-end hover:text-brand transition"
            >
              Full details
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
