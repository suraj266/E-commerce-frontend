/**
 * Admin Payouts — /admin/payouts
 *
 * Server component: gates on payout:read / payout:preview before rendering the
 * client console (server-side half of the P3-06 route gate).
 */
import { PermissionGate } from "@/components/admin/permission-gate";
import { ROUTE_PERMISSIONS } from "@/lib/auth/permission-slugs";
import PayoutsClient from "./payouts-client";

export default function AdminPayoutsPage() {
  return (
    <PermissionGate anyOf={ROUTE_PERMISSIONS.payouts}>
      <PayoutsClient />
    </PermissionGate>
  );
}
