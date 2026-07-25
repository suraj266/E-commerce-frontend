import { gql } from "@apollo/client";

/**
 * Notification operations (Phase 3 Wave 2c).
 *
 * Field names match the SHARED GRAPHQL CONTRACT exactly — the backend
 * implements this same shape:
 *   type Notification { id, type, title, body, data, read, createdAt }
 *   myNotifications(limit, offset), unreadNotificationCount,
 *   markNotificationRead(id), markAllNotificationsRead
 */

export const NOTIFICATION_FIELDS = gql`
  fragment NotificationFields on Notification {
    id
    type
    title
    body
    data
    read
    createdAt
  }
`;

export const MY_NOTIFICATIONS = gql`
  ${NOTIFICATION_FIELDS}
  query MyNotifications($limit: Int = 20, $offset: Int = 0) {
    myNotifications(limit: $limit, offset: $offset) {
      ...NotificationFields
    }
  }
`;

export const UNREAD_NOTIFICATION_COUNT = gql`
  query UnreadNotificationCount {
    unreadNotificationCount
  }
`;

export const MARK_NOTIFICATION_READ = gql`
  ${NOTIFICATION_FIELDS}
  mutation MarkNotificationRead($id: ID!) {
    markNotificationRead(id: $id) {
      ...NotificationFields
    }
  }
`;

export const MARK_ALL_NOTIFICATIONS_READ = gql`
  mutation MarkAllNotificationsRead {
    markAllNotificationsRead
  }
`;
