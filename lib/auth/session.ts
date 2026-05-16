/**
 * Server-side session reader.
 *
 * Reads the refreshToken cookie and asks the backend who the user is + which
 * role. Used by AuthProxy / ReverseAuthProxy in server components to enforce
 * role-based access across the (admin), (seller), and (customer) portals.
 */

import { cookies } from "next/headers";

export interface SessionUser {
  userId: string;
  email: string;
  name: string;
  role: { id: string; name: string } | null;
}

// Server-side fetches (this file only runs in a Node context) must reach
// the backend over the Docker network, NOT via the browser-facing URL.
// `localhost:7000` from inside the frontend container points to the
// frontend itself. Prefer the explicit internal URL when set; fall back
// to the public URL for non-Docker dev.
const API_URL =
  process.env.INTERNAL_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:7000";

export async function getServerSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken");
  if (!refreshToken) return null;

  try {
    const res = await fetch(`${API_URL}/auth/session`, {
      method: "GET",
      headers: {
        Cookie: `refreshToken=${refreshToken.value}`,
      },
      // Don't cache — always validate on each request
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    // Backend response interceptor wraps in { success, data, ... }
    return (data?.data ?? data) as SessionUser;
  } catch {
    return null;
  }
}

/**
 * Map a role name to the user's "home" portal URL.
 * Used to redirect users to the correct dashboard based on their role.
 */
export function getRoleHome(roleName: string | undefined | null): string {
  switch (roleName) {
    case "superAdmin":
    case "admin":
      return "/admin/dashboard";
    case "seller":
      return "/seller/dashboard";
    case "customer":
      return "/account";
    default:
      // No role / unknown role → send to public home
      return "/";
  }
}
