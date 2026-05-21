"use client";

/**
 * useCart — single hook used by every "Add to cart" surface (PDP, shop
 * cards, mini-cart drawer in the future).
 *
 * The header badge uses a dedicated lightweight hook (`useCartCount`)
 * that only fetches the count, so navbar renders never trigger a full
 * cart hydration.
 *
 * Optimistic UX: each mutation calls `refetch()` after success — Apollo
 * cache reconciles the full cart shape (subtotals, stock, price drift)
 * which would be tedious to keep in sync manually.
 */

import { useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useMutation, useQuery } from "@apollo/client/react";
import { toast } from "sonner";

import {
  ADD_TO_CART,
  CLEAR_CART,
  GET_MY_CART,
  GET_MY_CART_ITEM_COUNT,
  REMOVE_FROM_CART,
  UPDATE_CART_ITEM_QTY,
} from "@/lib/graphql/cart";
import {
  AddToCartData,
  ClearCartData,
  MyCartData,
  MyCartItemCountData,
  RemoveFromCartData,
  UpdateCartItemQtyData,
} from "@/types/cart.types";
import { useAuthStore } from "@/store/auth.store";

const CART_REFETCH = [
  { query: GET_MY_CART },
  { query: GET_MY_CART_ITEM_COUNT },
];

/**
 * Lightweight count hook for the header badge. Skips the full cart
 * hydration and only pulls the integer count.
 */
export function useCartCount() {
  // `user` is persisted; `accessToken` is memory-only and briefly null
  // between reload and boot-rehydration. Use user so we don't skip the
  // count query for a frame post-reload.
  const user = useAuthStore((s) => s.user);
  const isAuthed = !!user;
  const { data } = useQuery<MyCartItemCountData>(GET_MY_CART_ITEM_COUNT, {
    skip: !isAuthed,
    fetchPolicy: "cache-and-network",
    errorPolicy: "ignore",
  });
  return isAuthed ? (data?.myCartItemCount ?? 0) : 0;
}

export function useCart() {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const isAuthed = !!user;

  const { data, loading, refetch } = useQuery<MyCartData>(GET_MY_CART, {
    skip: !isAuthed,
    fetchPolicy: "cache-and-network",
    errorPolicy: "ignore",
  });

  const [addMutation, { loading: adding }] = useMutation<AddToCartData>(
    ADD_TO_CART,
    { refetchQueries: CART_REFETCH },
  );
  const [updateQtyMutation, { loading: updating }] =
    useMutation<UpdateCartItemQtyData>(UPDATE_CART_ITEM_QTY, {
      refetchQueries: CART_REFETCH,
    });
  const [removeMutation, { loading: removing }] =
    useMutation<RemoveFromCartData>(REMOVE_FROM_CART, {
      refetchQueries: CART_REFETCH,
    });
  const [clearMutation, { loading: clearing }] = useMutation<ClearCartData>(
    CLEAR_CART,
    { refetchQueries: CART_REFETCH },
  );

  const requireAuth = useCallback(() => {
    if (!isAuthed) {
      const next = encodeURIComponent(pathname || "/");
      router.push(`/login?next=${next}`);
      return false;
    }
    return true;
  }, [isAuthed, router, pathname]);

  const add = useCallback(
    async (variantId: string, quantity = 1, opts?: { silent?: boolean }) => {
      if (!requireAuth()) return false;
      try {
        await addMutation({ variables: { input: { variantId, quantity } } });
        if (!opts?.silent) toast.success("Added to cart");
        void refetch();
        return true;
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Could not add to cart.",
        );
        return false;
      }
    },
    [addMutation, refetch, requireAuth],
  );

  const updateQty = useCallback(
    async (variantId: string, quantity: number) => {
      if (!requireAuth()) return false;
      try {
        await updateQtyMutation({
          variables: { input: { variantId, quantity } },
        });
        void refetch();
        return true;
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Could not update quantity.",
        );
        return false;
      }
    },
    [updateQtyMutation, refetch, requireAuth],
  );

  const remove = useCallback(
    async (variantId: string) => {
      if (!requireAuth()) return false;
      try {
        await removeMutation({ variables: { input: { variantId } } });
        void refetch();
        return true;
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Could not remove item.",
        );
        return false;
      }
    },
    [removeMutation, refetch, requireAuth],
  );

  const clear = useCallback(async () => {
    if (!requireAuth()) return false;
    try {
      await clearMutation();
      toast.success("Cart cleared");
      void refetch();
      return true;
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not clear cart.",
      );
      return false;
    }
  }, [clearMutation, refetch, requireAuth]);

  return {
    cart: data?.myCart ?? null,
    loading,
    busy: adding || updating || removing || clearing,
    isAuthed,
    add,
    updateQty,
    remove,
    clear,
  };
}
