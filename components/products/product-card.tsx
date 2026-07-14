"use client";

/**
 * Public product card — used in store pages, brand pages, tag pages, and
 * later category/search results. Click anywhere → /product/[slug].
 */

import Link from "next/link";
import Image from "next/image";
import { Box } from "lucide-react";

import { Product } from "@/types/product.types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { discountPercent, formatPrice } from "@/lib/utils/currency";
import { useSiteSettings } from "@/lib/context/site-settings-context";
import { WishlistHeartButton } from "@/components/wishlist/wishlist-heart-button";

interface ProductCardProps {
  product: Product;
  /** Currency code from the parent context (store/store-of-product). Defaults to INR. */
  currency?: string;
}

export function ProductCard({ product, currency = "INR" }: ProductCardProps) {
  const { getDisplayPrice } = useSiteSettings();
  const primaryImage =
    product.images?.find((i) => i.isPrimary) ?? product.images?.[0];
  const pct = discountPercent(product.price, product.compareAtPrice);

  const pdpHref = `/product/${product.slug}`;

  return (
    // Image + title areas each get their own <Link>. We can't wrap the whole
    // card in one <Link> because the wishlist heart is a <button> and
    // <button> inside <a> is invalid HTML. Same pattern as shop-product-card.
    <div className="group relative transition-transform duration-300 ease-out hover:-translate-y-1">
      <Card className="overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 h-full dark:border-border-strong dark:shadow-none dark:group-hover:glow-accent">
        <Link
          href={pdpHref}
          className="relative aspect-square bg-muted block"
          aria-label={product.name}
        >
          {primaryImage ? (
            <Image
              src={primaryImage.imageUrl}
              alt={primaryImage.altText ?? product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <Box className="h-12 w-12 text-muted-foreground/40" />
            </div>
          )}
          {pct != null && (
            <Badge
              variant="destructive"
              className="absolute top-2 left-2 text-xs"
            >
              -{pct}% OFF
            </Badge>
          )}
        </Link>
        {/* Heart sits outside any <Link>, on top of the image via absolute pos. */}
        <WishlistHeartButton productId={product.id} />
        <div className="p-3 space-y-1">
          {product.brand && (
            <div className="text-xs text-muted-foreground truncate">
              {product.brand.name}
            </div>
          )}
          <Link href={pdpHref}>
            <div className="font-heading font-semibold text-sm line-clamp-2 min-h-[2.5rem] hover:underline">
              {product.name}
            </div>
          </Link>
          <div className="flex items-baseline gap-2 pt-1">
            <span className="font-semibold text-foreground">
              {formatPrice(getDisplayPrice(product.price, product.priceWithTax), currency)}
            </span>
            {product.compareAtPrice != null && pct != null && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(product.compareAtPrice, currency)}
              </span>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
