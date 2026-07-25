/**
 * Admin Orders — /admin/orders
 *
 * Server component: gates on invoice:manage (the permission the existing
 * cross-seller admin order resolver requires) before rendering the client
 * console. Server-side half of the P3-06 route gate.
 */
import { PermissionGate } from "@/components/admin/permission-gate";
import { ROUTE_PERMISSIONS } from "@/lib/auth/permission-slugs";
import OrdersClient from "./orders-client";

export default function AdminOrdersPage() {
  return (
    <PermissionGate anyOf={ROUTE_PERMISSIONS.orders}>
      <OrdersClient />
    </PermissionGate>
  );
}
