/**
 * Admin newsletter BROADCAST (P3 Wave 4) — consumes NewsletterCampaignResolver:
 *   Query    adminNewsletterCampaigns(status, page, pageSize, search): PaginatedNewsletterCampaigns   [newsletter:read]
 *   Query    adminNewsletterCampaign(id): NewsletterCampaign                                            [newsletter:read]
 *   Mutation createNewsletterCampaign(input): NewsletterCampaign                                        [newsletter:send]
 *   Mutation sendNewsletterCampaign(id): NewsletterCampaign                                             [newsletter:send]
 *
 * The send is consent-gated + durable server-side: it flips the campaign to
 * SENDING and fans out via the outbox (registered users who revoked marketing
 * consent are dropped; email-only double-opt-in subscribers are kept).
 */
import { gql } from "@apollo/client";

export const NEWSLETTER_CAMPAIGN_STATUSES = ["DRAFT", "SENDING", "SENT"] as const;
export type NewsletterCampaignStatus =
  (typeof NEWSLETTER_CAMPAIGN_STATUSES)[number];

export interface NewsletterCampaign {
  id: string;
  subject: string;
  htmlBody: string;
  audience: string;
  status: NewsletterCampaignStatus;
  recipientCount: number;
  sentCount: number;
  skippedCount: number;
  sendStartedAt: string | null;
  sentAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedNewsletterCampaigns {
  items: NewsletterCampaign[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export const NEWSLETTER_CAMPAIGN_FIELDS = gql`
  fragment NewsletterCampaignFields on NewsletterCampaign {
    id
    subject
    htmlBody
    audience
    status
    recipientCount
    sentCount
    skippedCount
    sendStartedAt
    sentAt
    createdAt
    updatedAt
  }
`;

export const GET_ADMIN_NEWSLETTER_CAMPAIGNS = gql`
  ${NEWSLETTER_CAMPAIGN_FIELDS}
  query GetAdminNewsletterCampaigns(
    $status: NewsletterCampaignStatus
    $page: Int
    $pageSize: Int
    $search: String
  ) {
    adminNewsletterCampaigns(
      status: $status
      page: $page
      pageSize: $pageSize
      search: $search
    ) {
      items {
        ...NewsletterCampaignFields
      }
      totalCount
      totalPages
      currentPage
      pageSize
    }
  }
`;

export const GET_ADMIN_NEWSLETTER_CAMPAIGN = gql`
  ${NEWSLETTER_CAMPAIGN_FIELDS}
  query GetAdminNewsletterCampaign($id: ID!) {
    adminNewsletterCampaign(id: $id) {
      ...NewsletterCampaignFields
    }
  }
`;

export const CREATE_NEWSLETTER_CAMPAIGN = gql`
  ${NEWSLETTER_CAMPAIGN_FIELDS}
  mutation CreateNewsletterCampaign($input: CreateNewsletterCampaignInput!) {
    createNewsletterCampaign(input: $input) {
      ...NewsletterCampaignFields
    }
  }
`;

export const SEND_NEWSLETTER_CAMPAIGN = gql`
  ${NEWSLETTER_CAMPAIGN_FIELDS}
  mutation SendNewsletterCampaign($id: ID!) {
    sendNewsletterCampaign(id: $id) {
      ...NewsletterCampaignFields
    }
  }
`;

export interface AdminNewsletterCampaignsData {
  adminNewsletterCampaigns: PaginatedNewsletterCampaigns;
}
export interface AdminNewsletterCampaignData {
  adminNewsletterCampaign: NewsletterCampaign;
}
