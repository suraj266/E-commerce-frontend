/**
 * Notification types — mirror the backend GraphQL `Notification` entity
 * (Phase 3 Wave 2c). Consumed by the header notification bell across the
 * storefront, seller, and admin portals.
 *
 * NOTE: `data` is a JSON-encoded string (or null) — the backend serializes the
 * per-type payload so the GraphQL field can stay a single scalar. Callers that
 * need the structured payload parse it with `JSON.parse` defensively.
 */

/** Notification.type string values emitted by this wave. */
export const NOTIFICATION_TYPES = [
  "order_placed",
  "order_refunded",
  "seller_new_order",
  "seller_kyc_approved",
  "seller_kyc_rejected",
  "courier_alert",
] as const;
export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

export interface Notification {
  id: string;
  /** One of NOTIFICATION_TYPES, but kept as a plain string to tolerate new
   *  types the backend may add before the frontend enum catches up. */
  type: string;
  title: string;
  body: string;
  /** JSON-encoded payload string, or null. */
  data?: string | null;
  read: boolean;
  createdAt: string;
}

export interface MyNotificationsData {
  myNotifications: Notification[];
}

export interface UnreadNotificationCountData {
  unreadNotificationCount: number;
}

export interface MarkNotificationReadData {
  markNotificationRead: Notification;
}

export interface MarkAllNotificationsReadData {
  markAllNotificationsRead: number;
}
