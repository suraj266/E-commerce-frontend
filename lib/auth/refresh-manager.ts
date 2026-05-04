/**
 * =============================================================================
 * Refresh Token Manager
 * =============================================================================
 *
 * Single source of truth for "I need a fresh access token". Multiple callers
 * (Apollo errorLink + REST apiClient + boot rehydration) can all invoke this
 * concurrently — only ONE actual `/auth/refresh` HTTP call fires; the rest
 * await the same in-flight promise. This avoids 5x-refresh thrash when a page
 * fires several queries that all hit a 401 simultaneously.
 *
 * Public API:
 *   - refreshAccessToken(): Promise<string | null>
 *       Returns the new access token, or null if the refresh failed (cookie
 *       expired/invalid). Never throws.
 *   - handleAuthFailure(): void
 *       Wipes Zustand auth state and bounces the user to the correct login
 *       page based on their previous role.
 *   - decodeJwtExp(token): seconds-since-epoch | null
 *       Cheap helper for the boot rehydration check — avoids round-tripping
 *       to the server when the locally-stored token is already valid.
 * =============================================================================
 */

import { useAuthStore } from "@/store/auth.store";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:7000";

let inFlight: Promise<string | null> | null = null;

/**
 * One-way latch: flipped to true the moment we know the refresh cookie is
 * dead (refresh returned 401, or handleAuthFailure was triggered). Every
 * subsequent refreshAccessToken() short-circuits to null without hitting the
 * network. Prevents the "graphql 200 (UNAUTHENTICATED) → refresh 401" loop
 * where a stale Bearer triggers Apollo's errorLink, which calls refresh,
 * which fails — and meanwhile other queries fire, triggering more refresh
 * attempts before the window.location redirect completes.
 *
 * Reset to false naturally on the next page load (module re-init).
 */
let authIsDead = false;

export function isAuthDead(): boolean {
  return authIsDead;
}

export function markAuthDead(): void {
  authIsDead = true;
}

export async function refreshAccessToken(): Promise<string | null> {
  if (authIsDead) return null;
  if (inFlight) return inFlight;

  inFlight = (async () => {
    try {
      const res = await fetch(`${BASE_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        // 401 here means the refresh cookie itself is gone or expired.
        // No point trying again until the user logs back in.
        if (res.status === 401) authIsDead = true;
        return null;
      }

      const body = await res.json();
      const accessToken: string | undefined =
        body?.data?.accessToken ?? body?.accessToken;

      if (!accessToken) return null;

      // Re-hydrate Zustand. We keep the existing `user` snippet — backend's
      // refresh endpoint doesn't return user data, only a fresh access token.
      const existingUser = useAuthStore.getState().user;
      if (existingUser) {
        useAuthStore.getState().setAuth(accessToken, existingUser);
      }

      return accessToken;
    } catch {
      return null;
    } finally {
      // Clear the slot so future expiries can trigger a fresh refresh.
      inFlight = null;
    }
  })();

  return inFlight;
}

/**
 * Final fallback when refresh fails — clear local state and send the user
 * back to the login page that matches their previous role. We read the role
 * BEFORE calling logout() since logout() wipes user info.
 */
export function handleAuthFailure(): void {
  if (typeof window === "undefined") return;

  // Latch first so any in-flight Apollo retries short-circuit instead of
  // making another /auth/refresh request before the redirect lands.
  authIsDead = true;

  const role = useAuthStore.getState().user?.role?.name;
  useAuthStore.getState().logout();

  const redirectTo =
    role === "seller"
      ? "/seller/login"
      : role === "superAdmin" || role === "admin"
        ? "/admin/login"
        : "/login";

  // Avoid a redirect loop if we're already on the login page
  if (!window.location.pathname.startsWith(redirectTo)) {
    window.location.href = redirectTo;
  }
}

/** Returns the JWT `exp` claim (seconds since epoch), or null if undecodable. */
export function decodeJwtExp(token: string): number | null {
  try {
    const middle = token.split(".")[1];
    if (!middle) return null;
    // base64url → base64 (replace -_ and pad)
    const b64 = middle.replace(/-/g, "+").replace(/_/g, "/");
    const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
    const json = atob(padded);
    const payload = JSON.parse(json) as { exp?: number };
    return typeof payload.exp === "number" ? payload.exp : null;
  } catch {
    return null;
  }
}

/** True if the token is missing, expired, or expiring within `bufferSeconds`. */
export function isTokenStale(token: string | null, bufferSeconds = 60): boolean {
  if (!token) return true;
  const exp = decodeJwtExp(token);
  if (exp == null) return true;
  const nowSec = Math.floor(Date.now() / 1000);
  return exp - nowSec <= bufferSeconds;
}
