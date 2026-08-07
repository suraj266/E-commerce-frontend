/**
 * Grievance / CP-EC complaint operations (Phase 4, P4-01) — customer surface.
 *
 * Consumes GrievanceResolver:
 *   Mutation fileGrievance(input): GrievanceEntity
 *   Query    myGrievances: [GrievanceEntity]
 *   Query    myGrievance(id): GrievanceEntity
 *   Mutation replyToGrievance(id, body): GrievanceEntity
 *
 * Hand-written gql (matches the returns/orders convention). Ownership is enforced
 * server-side (scoped to the logged-in user); internal officer notes never cross
 * the customer boundary.
 */
import { gql } from "@apollo/client";

export const GRIEVANCE_FIELDS = gql`
  fragment GrievanceFields on GrievanceEntity {
    id
    ticketNumber
    orderId
    sellerOrderId
    category
    subject
    description
    status
    priority
    slaDueAt
    slaBreached
    assignedToUserId
    resolutionNote
    firstResponseAt
    escalatedAt
    resolvedAt
    closedAt
    createdAt
    updatedAt
  }
`;

export const GRIEVANCE_DETAIL_FIELDS = gql`
  ${GRIEVANCE_FIELDS}
  fragment GrievanceDetailFields on GrievanceEntity {
    ...GrievanceFields
    contactName
    contactEmail
    messages {
      id
      authorRole
      authorUserId
      body
      internal
      createdAt
    }
  }
`;

// --------------------------- Customer ---------------------------------------

export const FILE_GRIEVANCE = gql`
  ${GRIEVANCE_FIELDS}
  mutation FileGrievance($input: FileGrievanceInput!) {
    fileGrievance(input: $input) {
      ...GrievanceFields
    }
  }
`;

export const GET_MY_GRIEVANCES = gql`
  ${GRIEVANCE_FIELDS}
  query GetMyGrievances {
    myGrievances {
      ...GrievanceFields
    }
  }
`;

export const GET_MY_GRIEVANCE = gql`
  ${GRIEVANCE_DETAIL_FIELDS}
  query GetMyGrievance($id: ID!) {
    myGrievance(id: $id) {
      ...GrievanceDetailFields
    }
  }
`;

export const REPLY_TO_GRIEVANCE = gql`
  ${GRIEVANCE_DETAIL_FIELDS}
  mutation ReplyToGrievance($id: ID!, $body: String!) {
    replyToGrievance(id: $id, body: $body) {
      ...GrievanceDetailFields
    }
  }
`;

// --------------------------- Types ------------------------------------------

export const GRIEVANCE_STATUSES = [
  "OPEN",
  "IN_PROGRESS",
  "RESOLVED",
  "CLOSED",
  "ESCALATED",
] as const;
export type GrievanceStatus = (typeof GRIEVANCE_STATUSES)[number];

export const GRIEVANCE_CATEGORIES = [
  "ORDER_ISSUE",
  "DELIVERY",
  "PAYMENT",
  "REFUND",
  "PRODUCT_QUALITY",
  "SELLER_CONDUCT",
  "DATA_PRIVACY",
  "OTHER",
] as const;
export type GrievanceCategory = (typeof GRIEVANCE_CATEGORIES)[number];

export const GRIEVANCE_PRIORITIES = ["LOW", "NORMAL", "HIGH", "URGENT"] as const;
export type GrievancePriority = (typeof GRIEVANCE_PRIORITIES)[number];

export type GrievanceAuthorRole = "CUSTOMER" | "OFFICER" | "SYSTEM";

export interface GrievanceMessage {
  id: string;
  authorRole: GrievanceAuthorRole;
  authorUserId?: string | null;
  body: string;
  internal: boolean;
  createdAt: string;
}

export interface Grievance {
  id: string;
  ticketNumber: string;
  raisedByUserId?: string | null;
  contactName?: string | null;
  contactEmail?: string | null;
  orderId?: string | null;
  sellerOrderId?: string | null;
  category: GrievanceCategory;
  subject: string;
  description: string;
  status: GrievanceStatus;
  priority: GrievancePriority;
  slaDueAt: string;
  slaBreached: boolean;
  assignedToUserId?: string | null;
  resolutionNote?: string | null;
  firstResponseAt?: string | null;
  escalatedAt?: string | null;
  resolvedAt?: string | null;
  closedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  messages?: GrievanceMessage[];
}

export interface PaginatedGrievances {
  items: Grievance[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface MyGrievancesData {
  myGrievances: Grievance[];
}
export interface MyGrievanceData {
  myGrievance: Grievance;
}
export interface FileGrievanceData {
  fileGrievance: Grievance;
}
export interface ReplyToGrievanceData {
  replyToGrievance: Grievance;
}

// --------------------------- Display maps -----------------------------------
// Plain data (no JSX) so the customer + admin pages render an inline <Badge>
// with the shared design tokens. Tailwind utility classes mirror the palette
// return-status-badge.tsx already uses — no invented colors.

export const GRIEVANCE_STATUS_LABEL: Record<GrievanceStatus, string> = {
  OPEN: "Open",
  IN_PROGRESS: "In progress",
  RESOLVED: "Resolved",
  CLOSED: "Closed",
  ESCALATED: "Escalated",
};

export const GRIEVANCE_STATUS_BADGE: Record<GrievanceStatus, string> = {
  OPEN: "bg-amber-100 text-amber-800 border-amber-300",
  IN_PROGRESS: "bg-blue-100 text-blue-800 border-blue-300",
  RESOLVED: "bg-emerald-100 text-emerald-800 border-emerald-300",
  CLOSED: "bg-slate-100 text-slate-700 border-slate-300",
  ESCALATED: "bg-rose-100 text-rose-800 border-rose-300",
};

export const GRIEVANCE_CATEGORY_LABEL: Record<GrievanceCategory, string> = {
  ORDER_ISSUE: "Order issue",
  DELIVERY: "Delivery",
  PAYMENT: "Payment",
  REFUND: "Refund",
  PRODUCT_QUALITY: "Product quality",
  SELLER_CONDUCT: "Seller conduct",
  DATA_PRIVACY: "Data privacy",
  OTHER: "Other",
};

export const GRIEVANCE_PRIORITY_BADGE: Record<GrievancePriority, string> = {
  LOW: "bg-slate-100 text-slate-700 border-slate-300",
  NORMAL: "bg-blue-100 text-blue-800 border-blue-300",
  HIGH: "bg-amber-100 text-amber-800 border-amber-300",
  URGENT: "bg-rose-100 text-rose-800 border-rose-300",
};
