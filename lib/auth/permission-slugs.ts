/**
 * =============================================================================
 * Admin permission slugs (P3-06) — single source of truth for the route gate
 * =============================================================================
 *
 * Slugs are `module:action`, exactly as PermissionsGuard derives them on the
 * backend and as `myPermissions` returns them. Each admin ops page requires
 * ONE of a small set (matching how the backend resolver is gated with
 * `.some()` semantics). Both halves of the gate — the client-side hidden nav
 * and the server-side <PermissionGate> — read these constants so they can
 * never drift apart.
 *
 * No `permission:*` slug is NEW: every one below is already seeded in
 * rolePermission.seed.ts (verified against the Phase-2 backend). This file only
 * centralises which existing slugs each new admin route needs.
 */

/** Required-permission sets, keyed by admin route. `.some()` semantics. */
export const ROUTE_PERMISSIONS = {
  refunds: ["refund:read"],
  payouts: ["payout:read", "payout:preview"],
  // Wave 4: the admin order console now has a dedicated cross-seller resolver
  // gated on order:read (the old invoice-audit view used invoice:manage).
  orders: ["order:read", "invoice:manage"],
  users: ["user:read"],
  roles: ["role:read", "permission:read"],
  auditLogs: ["audit:read"],
  // Returns admin oversight (P3-02) — matches the adminReturns resolver gate.
  returns: ["return:read"],
  // Programmatic API keys (Wave 4).
  apiKeys: ["apikey:read"],
  // Newsletter broadcast (Wave 4).
  newsletter: ["newsletter:send"],
  // CP-EC grievance redressal + compliance report (Phase 4).
  grievances: ["grievance:read"],
  // /api-keys is a skeleton (no backend yet); gate on a plausible future slug
  // OR fall back to super-admin visibility. Kept out of the strict gate for now.
} as const;

export type AdminRouteKey = keyof typeof ROUTE_PERMISSIONS;

/**
 * PermissionsGuard parity: the caller passes IF THEY HOLD ANY of `required`.
 * An empty `required` list means "no permission needed" (always allowed).
 */
export function hasAnyPermission(
  held: readonly string[] | null | undefined,
  required: readonly string[],
): boolean {
  if (required.length === 0) return true;
  if (!held) return false;
  const set = new Set(held);
  return required.some((slug) => set.has(slug));
}
