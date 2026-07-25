"use client";

/**
 * useAdminPermissions (P3-06) — client-side access to the current session's
 * permission slugs, for the hidden-nav half of the per-permission route gate.
 *
 * Returns `permissions: null` while the query is in flight or errored (the set
 * is UNKNOWN) and an array once resolved. Callers treat `null` as "don't hide
 * yet" so the sidebar never flickers items away for a super-admin during the
 * boot refresh; once the array arrives, filtering is enforced.
 *
 * The authoritative gate is server-side (<PermissionGate>) + each resolver's
 * PermissionsGuard — this is purely a UX affordance.
 */

import { useQuery } from "@apollo/client/react";
import {
  GET_MY_PERMISSIONS,
  type MyPermissionsData,
} from "@/lib/graphql/admin-permissions";
import { hasAnyPermission } from "@/lib/auth/permission-slugs";

export interface UseAdminPermissions {
  /** Held slugs, or `null` while unknown (loading/errored). */
  permissions: string[] | null;
  loading: boolean;
  /** True if the session holds ANY of `required`; `null` (unknown) ⇒ true. */
  can: (required: readonly string[]) => boolean;
}

export function useAdminPermissions(): UseAdminPermissions {
  const { data, loading } = useQuery<MyPermissionsData>(GET_MY_PERMISSIONS, {
    fetchPolicy: "cache-first",
    errorPolicy: "all",
  });

  const permissions = data?.myPermissions ?? null;

  return {
    permissions,
    loading,
    // Unknown set → allow (avoid hiding nav for authorized users mid-load).
    can: (required) =>
      permissions === null ? true : hasAnyPermission(permissions, required),
  };
}
