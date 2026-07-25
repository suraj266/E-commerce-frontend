/**
 * Admin audit-log operations (P3-06) — consumes the existing AuditResolver
 * (gated by audit:read):
 *   Query auditLogs(filter: AuditLogFilterInput): PaginatedAuditLogs
 *
 * `before` / `after` cross the wire as JSON STRINGS (the backend registers no
 * JSON scalar). The diff viewer JSON.parses them client-side — see
 * lib/audit/diff.ts.
 */
import { gql } from "@apollo/client";

export const AUDIT_LOG_FIELDS = gql`
  fragment AuditLogFields on AuditLogEntity {
    id
    actorUserId
    actorEmail
    action
    entityType
    entityId
    before
    after
    ip
    userAgent
    requestId
    createdAt
  }
`;

export const GET_AUDIT_LOGS = gql`
  ${AUDIT_LOG_FIELDS}
  query GetAuditLogs($filter: AuditLogFilterInput) {
    auditLogs(filter: $filter) {
      items {
        ...AuditLogFields
      }
      totalCount
      totalPages
      currentPage
      pageSize
    }
  }
`;

export interface AuditLog {
  id: string;
  actorUserId?: string | null;
  actorEmail?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  /** JSON string of the entity snapshot before the action (secrets redacted). */
  before?: string | null;
  /** JSON string of the entity snapshot after the action (secrets redacted). */
  after?: string | null;
  ip?: string | null;
  userAgent?: string | null;
  requestId?: string | null;
  createdAt: string;
}

export interface PaginatedAuditLogs {
  items: AuditLog[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface AuditLogFilterInput {
  actorUserId?: string | null;
  entityType?: string | null;
  entityId?: string | null;
  action?: string | null;
  from?: string | null;
  to?: string | null;
  page?: number;
  pageSize?: number;
}

export interface AuditLogsData {
  auditLogs: PaginatedAuditLogs;
}
