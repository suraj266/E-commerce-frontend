"use client";

/**
 * useNotifications — data layer for the header notification bell.
 *
 * AUTH-GATED: every query is skipped unless the viewer is signed in (the
 * bell reads `user` from the persisted auth store, mirroring the cart/wishlist
 * badges so it doesn't flash or fire an unauthenticated request on reload).
 *
 * LIGHTWEIGHT POLLING: the unread count polls on a slow interval so the badge
 * stays roughly live without websockets. The (heavier) list query only runs
 * when the dropdown is open — `open` toggles its `skip`, so opening the panel
 * triggers the fetch/refetch and closing it stops the network churn.
 */

import { useCallback } from "react";
import { useMutation, useQuery } from "@apollo/client/react";

import {
  MARK_ALL_NOTIFICATIONS_READ,
  MARK_NOTIFICATION_READ,
  MY_NOTIFICATIONS,
  UNREAD_NOTIFICATION_COUNT,
} from "@/lib/graphql/notifications";
import type {
  MarkAllNotificationsReadData,
  MarkNotificationReadData,
  MyNotificationsData,
  Notification,
  UnreadNotificationCountData,
} from "@/types/notification.types";
import { useAuthStore } from "@/store/auth.store";

/** How many notifications the dropdown loads. */
const LIST_LIMIT = 20;
/** Unread-count refresh cadence (ms). Kept slow — it's a passive badge. */
const POLL_INTERVAL = 60_000;

export function useNotifications(open: boolean) {
  // `user` is persisted; `accessToken` is memory-only and briefly null between
  // reload and boot-rehydration. Use `user` so the bell doesn't skip its
  // queries for a frame post-reload (same rationale as useCartCount).
  const user = useAuthStore((s) => s.user);
  const isAuthed = !!user;

  const { data: countData } = useQuery<UnreadNotificationCountData>(
    UNREAD_NOTIFICATION_COUNT,
    {
      skip: !isAuthed,
      fetchPolicy: "cache-and-network",
      errorPolicy: "ignore",
      pollInterval: POLL_INTERVAL,
    },
  );

  const {
    data: listData,
    loading: listLoading,
    refetch: refetchList,
  } = useQuery<MyNotificationsData>(MY_NOTIFICATIONS, {
    // Only load the list while the panel is open — keeps the closed bell to a
    // single tiny count query.
    skip: !isAuthed || !open,
    variables: { limit: LIST_LIMIT, offset: 0 },
    fetchPolicy: "cache-and-network",
    errorPolicy: "ignore",
    notifyOnNetworkStatusChange: true,
  });

  // markNotificationRead returns the updated Notification, so Apollo reconciles
  // that item's `read` flag in the cache by id automatically. We still refetch
  // the count query so the badge drops immediately.
  const [markReadMutation] = useMutation<MarkNotificationReadData>(
    MARK_NOTIFICATION_READ,
    { refetchQueries: [{ query: UNREAD_NOTIFICATION_COUNT }] },
  );

  // markAllNotificationsRead returns Int (count marked) — it can't update the
  // list items by itself, so refetch both the list and the count.
  const [markAllMutation, { loading: markingAll }] =
    useMutation<MarkAllNotificationsReadData>(MARK_ALL_NOTIFICATIONS_READ, {
      refetchQueries: [
        { query: UNREAD_NOTIFICATION_COUNT },
        {
          query: MY_NOTIFICATIONS,
          variables: { limit: LIST_LIMIT, offset: 0 },
        },
      ],
    });

  const notifications: Notification[] = listData?.myNotifications ?? [];
  const unreadCount = countData?.unreadNotificationCount ?? 0;

  const markRead = useCallback(
    async (id: string) => {
      try {
        await markReadMutation({ variables: { id } });
      } catch {
        // Non-blocking — a failed mark-read just leaves the item unread.
      }
    },
    [markReadMutation],
  );

  const markAll = useCallback(async () => {
    try {
      await markAllMutation();
    } catch {
      // Non-blocking — the badge stays until the next successful sync.
    }
  }, [markAllMutation]);

  return {
    isAuthed,
    unreadCount,
    notifications,
    // Only show the loading state on the very first open (no cached rows yet).
    listLoading: listLoading && notifications.length === 0,
    markingAll,
    markRead,
    markAll,
    refetchList,
  };
}
