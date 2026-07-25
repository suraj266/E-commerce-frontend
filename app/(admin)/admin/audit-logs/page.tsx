/**
 * Admin Audit Log — /admin/audit-logs
 *
 * Server component: gates on audit:read before rendering the client viewer
 * (server-side half of the P3-06 route gate).
 */
import { PermissionGate } from "@/components/admin/permission-gate";
import { ROUTE_PERMISSIONS } from "@/lib/auth/permission-slugs";
import AuditLogsClient from "./audit-logs-client";

export default function AdminAuditLogsPage() {
  return (
    <PermissionGate anyOf={ROUTE_PERMISSIONS.auditLogs}>
      <AuditLogsClient />
    </PermissionGate>
  );
}
