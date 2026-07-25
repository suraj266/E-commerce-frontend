/**
 * Admin Refunds — /admin/refunds
 *
 * Server component: gates on refund:read (server-side half of the P3-06 route
 * gate) before rendering the client console.
 */
import { PermissionGate } from "@/components/admin/permission-gate";
import { ROUTE_PERMISSIONS } from "@/lib/auth/permission-slugs";
import RefundsClient from "./refunds-client";

export default function AdminRefundsPage() {
  return (
    <PermissionGate anyOf={ROUTE_PERMISSIONS.refunds}>
      <RefundsClient />
    </PermissionGate>
  );
}
