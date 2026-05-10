/**
 * Newsletter subscription types — mirror backend GraphQL NewsletterSubscription
 * entity. Used by the homepage signup block and the admin subscribers page.
 */

export const NEWSLETTER_STATUSES = ["ACTIVE", "UNSUBSCRIBED"] as const;
export type NewsletterStatus = (typeof NEWSLETTER_STATUSES)[number];

export const NEWSLETTER_STATUS_LABEL: Record<NewsletterStatus, string> = {
  ACTIVE: "Active",
  UNSUBSCRIBED: "Unsubscribed",
};

export interface NewsletterSubscription {
  id: string;
  email: string;
  source?: string | null;
  status: NewsletterStatus;
  unsubscribedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface NewsletterSubscribeResult {
  ok: boolean;
  /** "subscribed" | "resubscribed" | "already-subscribed" */
  message: string;
}

export interface PaginatedNewsletterSubscriptions {
  items: NewsletterSubscription[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface SubscribeNewsletterData {
  subscribeToNewsletter: NewsletterSubscribeResult;
}

export interface AdminNewsletterSubscriptionsData {
  adminNewsletterSubscriptions: PaginatedNewsletterSubscriptions;
}

export interface UnsubscribeNewsletterData {
  unsubscribeNewsletter: NewsletterSubscription;
}
