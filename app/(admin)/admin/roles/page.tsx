/**
 * Admin Roles & Permissions — /admin/roles
 *
 * Server component: gates on role:read / permission:read before rendering the
 * client matrix (server-side half of the P3-06 route gate).
 */
import { PermissionGate } from "@/components/admin/permission-gate";
import { ROUTE_PERMISSIONS } from "@/lib/auth/permission-slugs";
import RolesClient from "./roles-client";

export default function AdminRolesPage() {
  return (
    <PermissionGate anyOf={ROUTE_PERMISSIONS.roles}>
      <RolesClient />
    </PermissionGate>
  );
}
