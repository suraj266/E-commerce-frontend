"use client";

/**
 * useCart — single hook used by every "Add to cart" surface (PDP, shop
 * cards, mini-cart drawer in the future).
 *
 * GUEST-AWARE: when the visitor is signed in it drives the authenticated
 * `myCart` + cart mutations; when they're anonymous it drives the cookie-scoped
 * `guestCart` + guest mutations (the server mints an httpOnly guestCartToken
 * cookie on the first guest write, and merges the guest cart into the customer
 * cart on login). Callers use the same `add/updateQty/remove/clear` API either
 * way — no auth gate, no login redirect.
 *
 * The header badge uses a dedicated lightweight hook (`useCartCount`).
 *
 * Optimistic UX: each mutation refetches the active cart on success — Apollo
 * cache reconciles the full cart shape (subtotals, stock, price drift) which
 * would be tedious to keep in sync manually.
 */

import { useCallback } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { toast } from "sonner";

import {
  ADD_TO_CART,
  ADD_TO_GUEST_CART,
  CLEAR_CART,
  GET_GUEST_CART,
  GET_MY_CART,
  GET_MY_CART_ITEM_COUNT,
  REMOVE_FROM_CART,
  REMOVE_FROM_GUEST_CART,
  UPDATE_CART_ITEM_QTY,
  UPDATE_GUEST_CART_ITEM_QTY,
} from "@/lib/graphql/cart";
import {
  AddToCartData,
  AddToGuestCartData,
  ClearCartData,
  GuestCartData,
  MyCartData,
  MyCartItemCountData,
  RemoveFromCartData,
  RemoveFromGuestCartData,
  UpdateCartItemQtyData,
  UpdateGuestCartItemQtyData,
} from "@/types/cart.types";
import { useAuthStore } from "@/store/auth.store";

const CART_REFETCH = [
  { query: GET_MY_CART },
  { query: GET_MY_CART_ITEM_COUNT },
];

/**
 * Lightweight count hook for the header badge. Signed-in users pull the
 * integer count; guests read the (small) cookie cart's itemCount.
 */
export function useCartCount() {
  // `user` is persisted; `accessToken` is memory-only and briefly null
  // between reload and boot-rehydration. Use user so we don't skip the
  // count query for a frame post-reload.
  const user = useAuthStore((s) => s.user);
  const isAuthed = !!user;

  const { data: authedData } = useQuery<MyCartItemCountData>(
    GET_MY_CART_ITEM_COUNT,
    {
      skip: !isAuthed,
      fetchPolicy: "cache-and-network",
      errorPolicy: "ignore",
    },
  );

  const { data: guestData } = useQuery<GuestCartData>(GET_GUEST_CART, {
    skip: isAuthed,
    fetchPolicy: "cache-and-network",
    errorPolicy: "ignore",
  });

  if (isAuthed) return authedData?.myCartItemCount ?? 0;
  return guestData?.guestCart?.itemCount ?? 0;
}

export function useCart() {
  const user = useAuthStore((s) => s.user);
  const isAuthed = !!user;

  const {
    data: authedData,
    loading: authedLoading,
    refetch: refetchAuthed,
  } = useQuery<MyCartData>(GET_MY_CART, {
    skip: !isAuthed,
    fetchPolicy: "cache-and-network",
    errorPolicy: "ignore",
  });

  const {
    data: guestData,
    loading: guestLoading,
    refetch: refetchGuest,
  } = useQuery<GuestCartData>(GET_GUEST_CART, {
    skip: isAuthed,
    fetchPolicy: "cache-and-network",
    errorPolicy: "ignore",
  });

  const refetch = useCallback(() => {
    if (isAuthed) void refetchAuthed();
    else void refetchGuest();
  }, [isAuthed, refetchAuthed, refetchGuest]);

  // ---- Authenticated mutations ----
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

  // ---- Guest mutations ----
  const [addGuestMutation, { loading: addingGuest }] =
    useMutation<AddToGuestCartData>(ADD_TO_GUEST_CART, {
      refetchQueries: [{ query: GET_GUEST_CART }],
    });
  const [updateQtyGuestMutation, { loading: updatingGuest }] =
    useMutation<UpdateGuestCartItemQtyData>(UPDATE_GUEST_CART_ITEM_QTY, {
      refetchQueries: [{ query: GET_GUEST_CART }],
    });
  const [removeGuestMutation, { loading: removingGuest }] =
    useMutation<RemoveFromGuestCartData>(REMOVE_FROM_GUEST_CART, {
      refetchQueries: [{ query: GET_GUEST_CART }],
    });

  const cart = isAuthed
    ? (authedData?.myCart ?? null)
    : (guestData?.guestCart ?? null);
  const loading = isAuthed ? authedLoading : guestLoading;

  const add = useCallback(
    async (variantId: string, quantity = 1, opts?: { silent?: boolean }) => {
      try {
        if (isAuthed) {
          await addMutation({ variables: { input: { variantId, quantity } } });
        } else {
          await addGuestMutation({
            variables: { input: { variantId, quantity } },
          });
        }
        if (!opts?.silent) toast.success("Added to cart");
        refetch();
        return true;
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Could not add to cart.",
        );
        return false;
      }
    },
    [isAuthed, addMutation, addGuestMutation, refetch],
  );

  const updateQty = useCallback(
    async (variantId: string, quantity: number) => {
      try {
        if (isAuthed) {
          await updateQtyMutation({
            variables: { input: { variantId, quantity } },
          });
        } else {
          await updateQtyGuestMutation({
            variables: { input: { variantId, quantity } },
          });
        }
        refetch();
        return true;
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Could not update quantity.",
        );
        return false;
      }
    },
    [isAuthed, updateQtyMutation, updateQtyGuestMutation, refetch],
  );

  const remove = useCallback(
    async (variantId: string) => {
      try {
        if (isAuthed) {
          await removeMutation({ variables: { input: { variantId } } });
        } else {
          await removeGuestMutation({ variables: { input: { variantId } } });
        }
        refetch();
        return true;
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Could not remove item.",
        );
        return false;
      }
    },
    [isAuthed, removeMutation, removeGuestMutation, refetch],
  );

  const clear = useCallback(async () => {
    try {
      if (isAuthed) {
        await clearMutation();
      } else {
        // No dedicated guest-clear mutation — remove each line in turn.
        const items = guestData?.guestCart?.items ?? [];
        for (const it of items) {
          await removeGuestMutation({
            variables: { input: { variantId: it.variantId } },
          });
        }
      }
      toast.success("Cart cleared");
      refetch();
      return true;
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not clear cart.",
      );
      return false;
    }
  }, [isAuthed, clearMutation, removeGuestMutation, guestData, refetch]);

  return {
    cart,
    loading,
    busy:
      adding ||
      updating ||
      removing ||
      clearing ||
      addingGuest ||
      updatingGuest ||
      removingGuest,
    isAuthed,
    add,
    updateQty,
    remove,
    clear,
  };
}
