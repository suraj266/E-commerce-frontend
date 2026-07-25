import { getServerPermissions } from "@/lib/auth/permissions";
import { hasAnyPermission } from "@/lib/auth/permission-slugs";
import { NoAccess } from "./no-access";

/**
 * PermissionGate (P3-06) — the server-side half of the per-permission route
 * gate. An async Server Component: it resolves the caller's permissions on the
 * server (from the refreshToken cookie) BEFORE the protected client page is
 * sent, and renders <NoAccess> instead when the caller lacks the permission.
 *
 * Usage — wrap the client page inside a route's server `page.tsx`:
 *
 *   export default function Page() {
 *     return (
 *       <PermissionGate anyOf={ROUTE_PERMISSIONS.refunds}>
 *         <RefundsClient />
 *       </PermissionGate>
 *     );
 *   }
 *
 * Defense in depth: the admin (admin) layout already gates the whole group to
 * admin roles server-side, and every backend resolver enforces the same
 * permission via PermissionsGuard. This adds the missing per-permission layer
 * so limited admins get an honest page instead of a wall of query errors.
 */
export async function PermissionGate({
  anyOf,
  children,
}: {
  /** Caller passes if they hold ANY of these slugs (PermissionsGuard parity). */
  anyOf: readonly string[];
  children: React.ReactNode;
}) {
  const held = await getServerPermissions();
  if (!hasAnyPermission(held, anyOf)) {
    return <NoAccess required={anyOf} />;
  }
  return <>{children}</>;
}
