/**
 * =============================================================================
 * ReverseAuthProxy — sends already-logged-in users away from auth pages
 * =============================================================================
 *
 * BEHAVIOR:
 *   1. Reads the refreshToken cookie
 *   2. Calls backend /auth/session → resolves user + role
 *   3. If session is valid, redirects to the user's role home (admin →
 *      /admin/dashboard, seller → /seller/dashboard, etc.)
 *   4. If `redirectTo` is provided, it overrides role-based redirect — useful
 *      when one auth page should always redirect somewhere specific.
 * =============================================================================
 */

import { redirect } from "next/navigation";
import { getRoleHome, getServerSession } from "@/lib/auth/session";

interface ReverseAuthProxyProps {
  children: React.ReactNode;
  /** Optional override. If omitted, redirects to the user's role home. */
  redirectTo?: string;
}

export async function ReverseAuthProxy({
  children,
  redirectTo,
}: ReverseAuthProxyProps) {
  const session = await getServerSession();

  if (session) {
    redirect(redirectTo ?? getRoleHome(session.role?.name));
  }

  return <>{children}</>;
}
