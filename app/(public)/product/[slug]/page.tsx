/**
 * Public Product Detail Page — /product/[slug]
 *
 * Phase A scope:
 *   - Image gallery (main + thumbnails, click to swap)
 *   - Brand chip linking to /brand/[slug]
 *   - Category breadcrumb
 *   - Price block with comparePrice strikethrough + discount %
 *   - Short + full description
 *   - Tag chips → /tag/[slug]
 *   - Specifications grouped table
 *   - Add-to-Cart + Buy Now stubs (toast "Coming in Sprint 3")
 *   - 404 if not ACTIVE
 *
 * SEO meta via document.title (matches existing /store /brand /tag pattern).
 * Server-component metadata generation deferred.
 */

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useQuery } from "@apollo/client/react";
import { toast } from "sonner";
import {
  Box,
  ChevronRight,
  ShoppingCart,
  Zap,
} from "lucide-react";

import { GET_PUBLIC_PRODUCT } from "@/lib/graphql/products";
import {
  GetPublicProductData,
  parseSpecifications,
  Product,
} from "@/types/product.types";
import { discountPercent, formatPrice } from "@/lib/utils/currency";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/components/cart/use-cart";
import { useSiteSettings } from "@/lib/context/site-settings-context";

export default function PublicProductPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const { data, loading, error } = useQuery<GetPublicProductData>(
    GET_PUBLIC_PRODUCT,
    { variables: { slug }, errorPolicy: "all" },
  );

  const product = data?.publicProduct;

  // SEO meta
  useEffect(() => {
    if (product && typeof document !== "undefined") {
      document.title = `${product.seoTitle || product.name} | MultiMart`;
      const desc = product.seoDescription || product.shortDescription;
      if (desc) {
        let meta = document.querySelector('meta[name="description"]');
        if (!meta) {
          meta = document.createElement("meta");
          meta.setAttribute("name", "description");
          document.head.appendChild(meta);
        }
        meta.setAttribute("content", desc);
      }
    }
  }, [product]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-4 sm:p-8 grid md:grid-cols-2 gap-8">
        <div className="aspect-square animate-pulse rounded-lg bg-muted" />
        <div className="space-y-4">
          <div className="h-6 w-32 animate-pulse rounded bg-muted" />
          <div className="h-10 w-full animate-pulse rounded bg-muted" />
          <div className="h-8 w-40 animate-pulse rounded bg-muted" />
          <div className="h-24 w-full animate-pulse rounded bg-muted" />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-3xl mx-auto p-8">
        <Card>
          <CardContent className="py-12 text-center space-y-3">
            <Box className="h-12 w-12 mx-auto text-muted-foreground/50" />
            <h1 className="text-xl font-semibold">Product not found</h1>
            <p className="text-sm text-muted-foreground">
              &ldquo;{slug}&rdquo; doesn&apos;t exist or is no longer available.
            </p>
            <Button asChild variant="outline">
              <Link href="/">Back to home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <ProductDetail product={product} />;
}

// ---------------------------------------------------------------------------
function ProductDetail({ product }: { product: Product }) {
  const { add: addToCart, busy: cartBusy } = useCart();
  const { getDisplayPrice } = useSiteSettings();

  const currency =
    (product as unknown as { metadata?: { currencyCode?: string } }).metadata
      ?.currencyCode ?? "INR";

  const images = product.images ?? [];
  const sortedImages = useMemo(
    () =>
      [...images].sort((a, b) => {
        if (a.isPrimary !== b.isPrimary) return a.isPrimary ? -1 : 1;
        return a.displayOrder - b.displayOrder;
      }),
    [images],
  );

  const [activeImage, setActiveImage] = useState(sortedImages[0]);
  useEffect(() => {
    setActiveImage(sortedImages[0]);
  }, [sortedImages]);

  // -- Variant selection (VARIABLE products) --
  const isVariable = product.productType === "VARIABLE";
  const variants = (product.variants ?? []).filter(
    (v) => v.status !== "INACTIVE",
  );

  // Build axis → values map from the available variants
  const variantAxes = useMemo(() => {
    if (!isVariable) return [];
    const seen = new Map<
      string,
      { attributeId: string; attributeName: string; values: Map<string, string> }
    >();
    for (const v of variants) {
      for (const a of v.attributes) {
        if (!seen.has(a.attributeId)) {
          seen.set(a.attributeId, {
            attributeId: a.attributeId,
            attributeName: a.attributeName,
            values: new Map(),
          });
        }
        seen.get(a.attributeId)!.values.set(a.attributeValueId, a.value);
      }
    }
    return Array.from(seen.values()).map((axis) => ({
      attributeId: axis.attributeId,
      attributeName: axis.attributeName,
      values: Array.from(axis.values.entries()).map(([id, label]) => ({
        id,
        label,
      })),
    }));
  }, [variants, isVariable]);

  // User's chosen value per axis (only for VARIABLE)
  const [selectedValues, setSelectedValues] = useState<Record<string, string>>({});

  // Auto-pick the first available combination on load
  useEffect(() => {
    if (!isVariable || variants.length === 0) return;
    const first = variants[0];
    const initial: Record<string, string> = {};
    for (const a of first.attributes) {
      initial[a.attributeId] = a.attributeValueId;
    }
    setSelectedValues(initial);
  }, [isVariable, variants.length]); // eslint-disable-line react-hooks/exhaustive-deps

  // Find the variant matching ALL selected axis values
  const selectedVariant = useMemo(() => {
    if (!isVariable) return variants[0];
    if (Object.keys(selectedValues).length === 0) return null;
    return variants.find((v) =>
      v.attributes.every(
        (a) => selectedValues[a.attributeId] === a.attributeValueId,
      ),
    );
  }, [variants, selectedValues, isVariable]);

  // When variant changes and has its own image, swap the active image
  useEffect(() => {
    if (selectedVariant?.imageUrl) {
      const variantImg = sortedImages.find(
        (i) => i.imageUrl === selectedVariant.imageUrl,
      );
      if (variantImg) setActiveImage(variantImg);
    }
  }, [selectedVariant, sortedImages]);

  // Display price — selected variant if VARIABLE, else product (which equals
  // the default-variant price for SIMPLE products)
  const displayPrice = isVariable
    ? selectedVariant?.price ?? product.price
    : product.price;
  const displayPriceWithTax = isVariable
    ? selectedVariant?.priceWithTax ?? product.priceWithTax
    : product.priceWithTax;
  const displayCompareAt = isVariable
    ? selectedVariant?.compareAtPrice ?? null
    : product.compareAtPrice;
  const displaySku = isVariable ? selectedVariant?.sku : product.sku;

  const pct = discountPercent(displayPrice, displayCompareAt);
  const specs = parseSpecifications(product.specifications);

  // ---- Stock awareness (Sprint 2.6 M3) ----
  // For SIMPLE products the default variant is the only one. For VARIABLE,
  // the selectedVariant decides; without a selection we fall back to the
  // aggregate "any variant has stock?" check used to gate the whole listing.
  const stockReferenceVariant = isVariable ? selectedVariant : variants[0];
  const stockAvailable = stockReferenceVariant?.availableQuantity ?? null;
  const stockState = stockReferenceVariant?.stockState ?? null;
  const anyVariantInStock = variants.some(
    (v) => (v.availableQuantity ?? 0) > 0,
  );
  const outOfStock = isVariable
    ? selectedVariant
      ? (stockAvailable ?? 0) <= 0
      : !anyVariantInStock
    : (stockAvailable ?? 0) <= 0;
  const lowStockBadge =
    !outOfStock &&
    stockReferenceVariant != null &&
    typeof stockAvailable === "number" &&
    stockAvailable > 0 &&
    stockAvailable <= 5;

  // The variant we'll send to the cart. For SIMPLE products that's the
  // auto-created default; for VARIABLE the user must have picked all axes.
  const cartTargetVariant = isVariable ? selectedVariant : variants[0];

  async function handleAddToCart() {
    if (isVariable && !selectedVariant) {
      toast.error("Pick all options first");
      return;
    }
    if (outOfStock) {
      toast.error("Out of stock");
      return;
    }
    if (!cartTargetVariant) return;
    await addToCart(cartTargetVariant.id, 1);
  }
  async function handleBuyNow() {
    if (isVariable && !selectedVariant) {
      toast.error("Pick all options first");
      return;
    }
    if (outOfStock) {
      toast.error("Out of stock");
      return;
    }
    if (!cartTargetVariant) return;
    // Add to cart, then bounce to /cart. Phase 5 (checkout) will jump
    // straight to a checkout flow with this single item.
    const ok = await addToCart(cartTargetVariant.id, 1, { silent: true });
    if (ok) window.location.href = "/cart";
  }

  return (
    <div className="bg-muted/20 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-muted-foreground flex items-center gap-1 flex-wrap">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          {product.category && (
            <>
              <ChevronRight className="h-3 w-3" />
              <Link
                href={`/category/${product.category.slug}`}
                className="hover:text-foreground"
              >
                {product.category.name}
              </Link>
            </>
          )}
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium truncate">
            {product.name}
          </span>
        </nav>

        {/* Hero — image gallery + buy block */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-10">
          {/* Gallery */}
          <div className="space-y-3">
            <div className="relative aspect-square rounded-lg bg-card border overflow-hidden flex items-center justify-center">
              {activeImage ? (
                <Image
                  src={activeImage.imageUrl}
                  alt={activeImage.altText ?? product.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              ) : (
                <Box className="h-16 w-16 text-muted-foreground/40" />
              )}
            </div>
            {sortedImages.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {sortedImages.map((img) => (
                  <button
                    type="button"
                    key={img.id}
                    onClick={() => setActiveImage(img)}
                    className={`relative aspect-square rounded-md border overflow-hidden transition ${
                      activeImage?.id === img.id
                        ? "border-primary ring-2 ring-primary"
                        : "border-border hover:border-foreground/40"
                    }`}
                  >
                    <Image
                      src={img.imageUrl}
                      alt=""
                      fill
                      sizes="20vw"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Buy block */}
          <div className="space-y-4">
            {product.brand && (
              <Link
                href={`/brand/${product.brand.slug}`}
                className="inline-flex items-center gap-2"
              >
                <Badge variant="outline" className="text-xs">
                  {product.brand.name}
                </Badge>
              </Link>
            )}

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {product.name}
            </h1>

            {product.shortDescription && (
              <p className="text-muted-foreground">{product.shortDescription}</p>
            )}

            {/* Variant selectors (VARIABLE products) */}
            {isVariable && variantAxes.length > 0 && (
              <div className="space-y-3 pt-2">
                {variantAxes.map((axis) => (
                  <div key={axis.attributeId} className="space-y-1.5">
                    <div className="text-sm font-medium">
                      {axis.attributeName}:{" "}
                      <span className="text-muted-foreground font-normal">
                        {axis.values.find(
                          (v) => v.id === selectedValues[axis.attributeId],
                        )?.label ?? "—"}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {axis.values.map((v) => {
                        const selected = selectedValues[axis.attributeId] === v.id;
                        // Disable if no available variant exists with this combo
                        const hypothetical = {
                          ...selectedValues,
                          [axis.attributeId]: v.id,
                        };
                        const matchedVariant = variants.find((variant) =>
                          variant.attributes.every(
                            (a) =>
                              hypothetical[a.attributeId] ===
                              a.attributeValueId,
                          ),
                        );
                        const exists = matchedVariant != null;
                        const variantOos =
                          matchedVariant != null &&
                          (matchedVariant.availableQuantity ?? 0) <= 0;
                        const disabled = !exists || variantOos;
                        return (
                          <button
                            key={v.id}
                            type="button"
                            disabled={disabled}
                            title={
                              !exists
                                ? "Combination unavailable"
                                : variantOos
                                  ? "Out of stock"
                                  : undefined
                            }
                            onClick={() =>
                              setSelectedValues((prev) => ({
                                ...prev,
                                [axis.attributeId]: v.id,
                              }))
                            }
                            className={`px-3 py-1.5 rounded-md text-sm border transition ${
                              selected
                                ? "bg-primary text-primary-foreground border-primary"
                                : disabled
                                  ? "bg-muted text-muted-foreground border-border opacity-50 cursor-not-allowed line-through"
                                  : "bg-background text-foreground border-border hover:border-foreground"
                            }`}
                          >
                            {v.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
                {selectedVariant && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-xs text-muted-foreground font-mono">
                      SKU: {displaySku}
                    </p>
                    {stockState === "OUT_OF_STOCK" && (
                      <Badge variant="destructive" className="text-[10px]">
                        Out of stock
                      </Badge>
                    )}
                    {lowStockBadge && (
                      <Badge
                        variant="secondary"
                        className="text-[10px] bg-amber-100 text-amber-900 dark:bg-amber-900/30 dark:text-amber-300 border-amber-300/50"
                      >
                        Only {stockAvailable} left
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Price block */}
            <div className="flex items-baseline gap-3 flex-wrap pt-2">
              {isVariable && !selectedVariant ? (
                <span className="text-2xl font-bold text-muted-foreground">
                  Starting from {formatPrice(getDisplayPrice(product.price, product.priceWithTax), currency)}
                </span>
              ) : (
                <>
                  <span className="text-3xl font-bold">
                    {formatPrice(getDisplayPrice(displayPrice, displayPriceWithTax), currency)}
                  </span>
                  {displayCompareAt != null && pct != null && (
                    <>
                      <span className="text-lg text-muted-foreground line-through">
                        {formatPrice(displayCompareAt, currency)}
                      </span>
                      <Badge variant="destructive" className="text-sm">
                        -{pct}% OFF
                      </Badge>
                    </>
                  )}
                </>
              )}
            </div>

            {/* Stock state — SIMPLE products show it here; VARIABLE shows it
                next to the SKU once a variant is picked. */}
            {!isVariable && (outOfStock || lowStockBadge) && (
              <div>
                {outOfStock ? (
                  <Badge variant="destructive" className="text-xs">
                    Out of stock
                  </Badge>
                ) : (
                  <Badge
                    variant="secondary"
                    className="text-xs bg-amber-100 text-amber-900 dark:bg-amber-900/30 dark:text-amber-300 border-amber-300/50"
                  >
                    Only {stockAvailable} left
                  </Badge>
                )}
              </div>
            )}

            {/* Tags */}
            {(product.tags?.length ?? 0) > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {product.tags?.map((tag) => (
                  <Link
                    key={tag.id}
                    href={`/tag/${tag.slug}`}
                    className="text-xs px-2.5 py-1 rounded-full bg-muted hover:bg-muted/80 transition"
                  >
                    #{tag.name}
                  </Link>
                ))}
              </div>
            )}

            <Separator />

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                onClick={handleAddToCart}
                disabled={outOfStock || cartBusy}
                className="flex-1"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {outOfStock
                  ? "Out of stock"
                  : cartBusy
                    ? "Adding..."
                    : "Add to Cart"}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleBuyNow}
                disabled={outOfStock || cartBusy}
                className="flex-1"
              >
                <Zap className="mr-2 h-5 w-5" />
                Buy Now
              </Button>
            </div>
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <Card>
            <CardContent className="py-6 space-y-2">
              <h2 className="font-semibold text-lg">Description</h2>
              <p className="text-sm whitespace-pre-line text-muted-foreground">
                {product.description}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Specifications */}
        {specs.length > 0 && (
          <Card>
            <CardContent className="py-6 space-y-4">
              <h2 className="font-semibold text-lg">Specifications</h2>
              <div className="space-y-4">
                {specs
                  .slice()
                  .sort((a, b) => a.order - b.order)
                  .map((group, gi) => (
                    <div key={gi} className="space-y-2">
                      <h3 className="font-medium text-sm">{group.name}</h3>
                      <div className="border rounded-md overflow-hidden">
                        {group.items
                          .slice()
                          .sort((a, b) => a.order - b.order)
                          .map((item, ii) => (
                            <div
                              key={ii}
                              className={`grid grid-cols-1 sm:grid-cols-3 gap-2 px-4 py-2 text-sm ${
                                ii % 2 === 0 ? "bg-muted/30" : ""
                              }`}
                            >
                              <dt className="text-muted-foreground">
                                {item.label}
                              </dt>
                              <dd className="sm:col-span-2 font-medium">
                                {item.value}
                              </dd>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
