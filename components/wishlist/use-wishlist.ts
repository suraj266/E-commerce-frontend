"use client";

/**
 * useWishlist — single hook used by every "heart" button across the
 * storefront (shop cards, PDP, featured product cards, etc).
 *
 * Responsibilities:
 *   - keep an in-memory Set of wishlisted productIds for O(1) lookup
 *   - expose `toggle(productId)` with optimistic UI: flips local state
 *     immediately, then fires the mutation; rolls back on failure
 *   - skip the GraphQL queries entirely when the user isn't logged in
 *     (no UNAUTHENTICATED noise in the network tab)
 *   - redirect anonymous heart clicks to /login?next=<current>
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useMutation, useQuery } from "@apollo/client/react";
import { toast } from "sonner";

import {
  ADD_TO_WISHLIST,
  GET_MY_WISHLIST_PRODUCT_IDS,
  REMOVE_FROM_WISHLIST,
} from "@/lib/graphql/wishlist";
import {
  AddToWishlistData,
  MyWishlistProductIdsData,
  RemoveFromWishlistData,
} from "@/types/wishlist.types";
import { useAuthStore } from "@/store/auth.store";

export function useWishlist() {
  const router = useRouter();
  const pathname = usePathname();
  const accessToken = useAuthStore((s) => s.accessToken);
  const isAuthed = !!accessToken;

  // Local Set kept in sync with the GraphQL fetch. We mutate the Set
  // optimistically and fall back to whatever the server reports next time
  // the query refetches.
  const [ids, setIds] = useState<Set<string>>(new Set());

  const { data, refetch } = useQuery<MyWishlistProductIdsData>(
    GET_MY_WISHLIST_PRODUCT_IDS,
    {
      skip: !isAuthed,
      fetchPolicy: "cache-and-network",
      // Don't blow up the page if the user is mid-session-expiry; just
      // treat it as logged-out for wishlist purposes.
      errorPolicy: "ignore",
    },
  );

  // Reconcile server state into local state on every fetch. If the user
  // clicked twice quickly, the optimistic state may briefly disagree with
  // the server — we trust the server as the source of truth on each round.
  useEffect(() => {
    if (data?.myWishlistProductIds) {
      setIds(new Set(data.myWishlistProductIds));
    }
  }, [data?.myWishlistProductIds]);

  // Wipe local state on logout so a stale heart-fill doesn't linger across
  // account switches.
  useEffect(() => {
    if (!isAuthed) setIds(new Set());
  }, [isAuthed]);

  const [add] = useMutation<AddToWishlistData>(ADD_TO_WISHLIST);
  const [remove] = useMutation<RemoveFromWishlistData>(REMOVE_FROM_WISHLIST);

  const has = useCallback((productId: string) => ids.has(productId), [ids]);
  const count = ids.size;

  const toggle = useCallback(
    async (productId: string) => {
      if (!isAuthed) {
        const next = encodeURIComponent(pathname || "/");
        router.push(`/login?next=${next}`);
        return;
      }

      const wasIn = ids.has(productId);
      // Optimistic: flip local state immediately
      setIds((prev) => {
        const copy = new Set(prev);
        if (wasIn) copy.delete(productId);
        else copy.add(productId);
        return copy;
      });

      try {
        if (wasIn) {
          await remove({ variables: { input: { productId } } });
        } else {
          await add({ variables: { input: { productId } } });
        }
        // Refetch to reconcile (covers race conditions, multi-tab edits)
        void refetch();
      } catch (err) {
        // Rollback on failure
        setIds((prev) => {
          const copy = new Set(prev);
          if (wasIn) copy.add(productId);
          else copy.delete(productId);
          return copy;
        });
        toast.error(
          err instanceof Error
            ? err.message
            : "Could not update your wishlist. Please try again.",
        );
      }
    },
    [isAuthed, ids, add, remove, refetch, router, pathname],
  );

  return useMemo(
    () => ({ has, toggle, count, isAuthed }),
    [has, toggle, count, isAuthed],
  );
}
