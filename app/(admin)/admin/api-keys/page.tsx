/**
 * Admin API Keys — /admin/api-keys
 *
 * Server component: gates on `apikey:read` before rendering the client console
 * (server-side half of the route gate). Mirrors the audit-logs / payouts pages.
 *
 * CENTRAL-WIRING TODO (required before build): add
 *   apiKeys: ["apikey:read"]
 * to ROUTE_PERMISSIONS in lib/auth/permission-slugs.ts. The nav item already
 * exists; the `apikey:read` / `apikey:manage` slugs must be seeded in
 * rolePermission.seed.ts (backend report).
 */
import { PermissionGate } from "@/components/admin/permission-gate";
import { ROUTE_PERMISSIONS } from "@/lib/auth/permission-slugs";
import ApiKeysClient from "./api-keys-client";

export default function AdminApiKeysPage() {
  return (
    <PermissionGate anyOf={ROUTE_PERMISSIONS.apiKeys}>
      <ApiKeysClient />
    </PermissionGate>
  );
}
