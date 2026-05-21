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

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:7000";

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

// Re-export so existing server-side imports (AuthProxy/ReverseAuthProxy)
// keep working. The actual definition lives in role-home.ts because it's
// also consumed by client components and must not pull in `next/headers`.
export { getRoleHome } from "./role-home";
