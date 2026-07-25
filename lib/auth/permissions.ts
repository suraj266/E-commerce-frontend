import "server-only";

/**
 * Server-side permission reader (P3-06) — the server half of the per-permission
 * route gate.
 *
 * Mirrors `lib/auth/session.ts`: reads the httpOnly refreshToken cookie and
 * asks the backend which permission slugs the caller holds, via the
 * cookie-authenticated `GET /roles/me/permissions` endpoint (RoleController).
 * That endpoint verifies the refresh token WITHOUT rotating it, so this is
 * safe to call on every protected page render.
 *
 * Never throws — on any transport error / non-2xx / malformed body it returns
 * an empty list, so <PermissionGate> fails CLOSED (renders "no access") rather
 * than crashing the render. The authoritative enforcement still lives on each
 * resolver's PermissionsGuard; this only lets the shell render honestly.
 */

import { cookies } from "next/headers";
import { hasAnyPermission } from "./permission-slugs";

const API_URL = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL;

export async function getServerPermissions(): Promise<string[]> {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken");
  if (!refreshToken) return [];

  try {
    const res = await fetch(`${API_URL}/roles/me/permissions`, {
      method: "GET",
      headers: { Cookie: `refreshToken=${refreshToken.value}` },
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return [];
    const json = await res.json();
    // Response interceptor wraps REST payloads in { success, data, ... }.
    const permissions = (json?.data ?? json)?.permissions;
    return Array.isArray(permissions) ? (permissions as string[]) : [];
  } catch {
    return [];
  }
}

/** True when the current session holds ANY of the required slugs. */
export async function serverHasPermission(
  required: readonly string[],
): Promise<boolean> {
  const held = await getServerPermissions();
  return hasAnyPermission(held, required);
}
