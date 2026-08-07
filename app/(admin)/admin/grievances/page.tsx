/**
 * Admin Grievances — /admin/grievances (P4-01, CP-EC)
 *
 * Server component: gates the grievance console behind the grievances route
 * permission. // CENTRAL-WIRING: ROUTE_PERMISSIONS.grievances (["grievance:read"])
 * must be added to lib/auth/permission-slugs.ts and the slugs seeded in
 * rolePermission.seed.ts — see the report. The admin nav link is wired centrally
 * in config/admin.nav.ts.
 */
import { PermissionGate } from "@/components/admin/permission-gate";
import { ROUTE_PERMISSIONS } from "@/lib/auth/permission-slugs";
import GrievancesClient from "./grievances-client";

export default function AdminGrievancesPage() {
  return (
    <PermissionGate anyOf={ROUTE_PERMISSIONS.grievances}>
      <GrievancesClient />
    </PermissionGate>
  );
}
