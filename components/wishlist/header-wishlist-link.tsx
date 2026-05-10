"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlist } from "./use-wishlist";

/**
 * Header heart icon with a small count badge when the customer has saved
 * items. The count comes from the same `useWishlist` hook the cards use,
 * so adding from anywhere updates the badge live (no page reload).
 *
 * For anonymous users the badge is suppressed (the hook returns count=0).
 */
export function HeaderWishlistLink() {
  const { count } = useWishlist();
  return (
    <Button variant="ghost" size="icon" aria-label="Wishlist" asChild>
      <Link href="/wishlist" className="relative">
        <Heart className="h-5 w-5" />
        {count > 0 && (
          <span
            aria-hidden="true"
            className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-sale text-white text-[10px] font-bold flex items-center justify-center"
          >
            {count > 99 ? "99+" : count}
          </span>
        )}
      </Link>
    </Button>
  );
}
