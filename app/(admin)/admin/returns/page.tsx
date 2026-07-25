/**
 * Admin Returns — /admin/returns (P3-02)
 *
 * Server component: gates the returns oversight console. Reuses the refunds
 * route permission (`refund:read`) — returns are the refund-adjacent surface.
 * // CENTRAL-WIRING: a dedicated `return:read` slug is preferred; add it to
 * lib/auth/permission-slugs.ts (ROUTE_PERMISSIONS.returns) + seed it, then swap
 * the gate below. The P3-06 nav already links here.
 */
import { PermissionGate } from "@/components/admin/permission-gate";
import { ROUTE_PERMISSIONS } from "@/lib/auth/permission-slugs";
import ReturnsClient from "./returns-client";

export default function AdminReturnsPage() {
  return (
    <PermissionGate anyOf={ROUTE_PERMISSIONS.returns}>
      <ReturnsClient />
    </PermissionGate>
  );
}
