/**
 * Admin Users — /admin/users
 *
 * Server component: gates on user:read before rendering the client console
 * (server-side half of the P3-06 route gate). Lists all platform accounts with
 * their role; storefront shoppers also have a dedicated view under
 * /admin/customers.
 */
import { PermissionGate } from "@/components/admin/permission-gate";
import { ROUTE_PERMISSIONS } from "@/lib/auth/permission-slugs";
import UsersClient from "./users-client";

export default function AdminUsersPage() {
  return (
    <PermissionGate anyOf={ROUTE_PERMISSIONS.users}>
      <UsersClient />
    </PermissionGate>
  );
}
