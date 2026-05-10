"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartCount } from "./use-cart";

/**
 * Header cart icon with a small count badge when the customer has items.
 * Count comes from the lightweight `myCartItemCount` query — fetching the
 * full cart on every navbar render would be wasteful.
 *
 * For anonymous users the badge is suppressed (the hook returns 0).
 */
export function HeaderCartLink() {
  const count = useCartCount();
  return (
    <Button variant="ghost" size="icon" aria-label="Cart" asChild>
      <Link href="/cart" className="relative">
        <ShoppingCart className="h-5 w-5" />
        {count > 0 && (
          <span
            aria-hidden="true"
            className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-brand text-white text-[10px] font-bold flex items-center justify-center"
          >
            {count > 99 ? "99+" : count}
          </span>
        )}
      </Link>
    </Button>
  );
}
