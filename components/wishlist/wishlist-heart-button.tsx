"use client";

import { Heart } from "lucide-react";
import { useWishlist } from "./use-wishlist";

interface WishlistHeartButtonProps {
  productId: string;
  /** Visual style — round white pill on top of an image (cards) vs. inline. */
  variant?: "overlay" | "inline";
  className?: string;
}

/**
 * The shared heart-toggle. Live state (filled vs outline) reflects whether
 * the product is in the current customer's wishlist. Anonymous users get
 * bounced to /login with a `next=` param so they return to the same page.
 */
export function WishlistHeartButton({
  productId,
  variant = "overlay",
  className = "",
}: WishlistHeartButtonProps) {
  const { has, toggle } = useWishlist();
  const active = has(productId);

  const baseClass =
    variant === "overlay"
      ? "absolute top-3 right-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur shadow hover:bg-white transition"
      : "inline-flex h-9 w-9 items-center justify-center rounded-full border hover:border-foreground/40 transition";

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void toggle(productId);
      }}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={active}
      className={`${baseClass} ${className}`}
    >
      <Heart
        // Re-mount on toggle so the fill state pops once when favorited.
        key={active ? "on" : "off"}
        className={`h-4 w-4 transition ${
          active
            ? "fill-sale text-sale animate-pop"
            : "text-foreground/70"
        }`}
      />
    </button>
  );
}
