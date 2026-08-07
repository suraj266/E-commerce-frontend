/**
 * Admin grievance console (P4-01) — consumes GrievanceAdminResolver:
 *   Query    adminGrievances(filter): PaginatedGrievances          [grievance:read]
 *   Query    adminGrievance(id): GrievanceEntity                    [grievance:read]
 *   Query    grievanceComplianceReport(period): GrievanceComplianceReport [grievance:read]
 *   Query    grievanceComplianceReportJson(period): String          [grievance:read]
 *   Mutation assignGrievance / respondToGrievance / resolveGrievance /
 *            escalateGrievance / closeGrievance                     [grievance:manage]
 *
 * Gated server-side by the grievance route permission (grievance:read /
 * grievance:manage — see the report; seeded in rolePermission.seed.ts).
 */
import { gql } from "@apollo/client";
import { GRIEVANCE_FIELDS, GRIEVANCE_DETAIL_FIELDS } from "./grievances";

export {
  GRIEVANCE_STATUSES,
  GRIEVANCE_CATEGORIES,
  GRIEVANCE_PRIORITIES,
  GRIEVANCE_STATUS_LABEL,
  GRIEVANCE_STATUS_BADGE,
  GRIEVANCE_CATEGORY_LABEL,
  GRIEVANCE_PRIORITY_BADGE,
  type GrievanceStatus,
  type GrievanceCategory,
  type GrievancePriority,
  type Grievance,
  type PaginatedGrievances,
} from "./grievances";

export const GET_ADMIN_GRIEVANCES = gql`
  ${GRIEVANCE_FIELDS}
  query GetAdminGrievances($filter: GrievanceFilterInput) {
    adminGrievances(filter: $filter) {
      items {
        ...GrievanceFields
      }
      totalCount
      totalPages
      currentPage
      pageSize
    }
  }
`;

export const GET_ADMIN_GRIEVANCE = gql`
  ${GRIEVANCE_DETAIL_FIELDS}
  query GetAdminGrievance($id: ID!) {
    adminGrievance(id: $id) {
      ...GrievanceDetailFields
    }
  }
`;

export const GET_GRIEVANCE_COMPLIANCE_REPORT = gql`
  query GetGrievanceComplianceReport($period: String!) {
    grievanceComplianceReport(period: $period) {
      period
      disclaimer
      officerName
      officerEmail
      officerPhone
      openingBacklog
      received
      resolved
      closed
      escalated
      pending
      slaBreached
      slaComplianceRate
      avgResolutionHours
      byCategory {
        key
        count
      }
      byStatus {
        key
        count
      }
    }
  }
`;

export const GET_GRIEVANCE_COMPLIANCE_REPORT_JSON = gql`
  query GetGrievanceComplianceReportJson($period: String!) {
    grievanceComplianceReportJson(period: $period)
  }
`;

export const ASSIGN_GRIEVANCE = gql`
  ${GRIEVANCE_DETAIL_FIELDS}
  mutation AssignGrievance($input: AssignGrievanceInput!) {
    assignGrievance(input: $input) {
      ...GrievanceDetailFields
    }
  }
`;

export const RESPOND_TO_GRIEVANCE = gql`
  ${GRIEVANCE_DETAIL_FIELDS}
  mutation RespondToGrievance($input: GrievanceMessageInput!) {
    respondToGrievance(input: $input) {
      ...GrievanceDetailFields
    }
  }
`;

export const RESOLVE_GRIEVANCE = gql`
  ${GRIEVANCE_DETAIL_FIELDS}
  mutation ResolveGrievance($input: ResolveGrievanceInput!) {
    resolveGrievance(input: $input) {
      ...GrievanceDetailFields
    }
  }
`;

export const ESCALATE_GRIEVANCE = gql`
  ${GRIEVANCE_DETAIL_FIELDS}
  mutation EscalateGrievance($id: ID!, $note: String) {
    escalateGrievance(id: $id, note: $note) {
      ...GrievanceDetailFields
    }
  }
`;

export const CLOSE_GRIEVANCE = gql`
  ${GRIEVANCE_DETAIL_FIELDS}
  mutation CloseGrievance($id: ID!) {
    closeGrievance(id: $id) {
      ...GrievanceDetailFields
    }
  }
`;

// --------------------------- Types ------------------------------------------

import type {
  Grievance,
  PaginatedGrievances,
  GrievanceStatus,
  GrievanceCategory,
  GrievancePriority,
} from "./grievances";

export interface GrievanceCountBucket {
  key: string;
  count: number;
}

export interface GrievanceComplianceReport {
  period: string;
  disclaimer: string;
  officerName?: string | null;
  officerEmail?: string | null;
  officerPhone?: string | null;
  openingBacklog: number;
  received: number;
  resolved: number;
  closed: number;
  escalated: number;
  pending: number;
  slaBreached: number;
  slaComplianceRate?: number | null;
  avgResolutionHours?: number | null;
  byCategory: GrievanceCountBucket[];
  byStatus: GrievanceCountBucket[];
}

export interface AdminGrievancesData {
  adminGrievances: PaginatedGrievances;
}
export interface AdminGrievanceData {
  adminGrievance: Grievance;
}
export interface GrievanceComplianceReportData {
  grievanceComplianceReport: GrievanceComplianceReport;
}
export interface GrievanceComplianceReportJsonData {
  grievanceComplianceReportJson: string;
}

export interface GrievanceFilterVars {
  status?: GrievanceStatus | null;
  category?: GrievanceCategory | null;
  priority?: GrievancePriority | null;
  assignedToUserId?: string | null;
  breachedOnly?: boolean | null;
  page?: number;
  pageSize?: number;
}
