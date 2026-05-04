/**
 * =============================================================================
 * AuthProxy - Server-Side Role-Aware Route Guard
 * =============================================================================
 *
 * Server Component that runs before any protected page renders.
 *
 * BEHAVIOR:
 *   1. Reads the refreshToken cookie from the request
 *   2. Calls backend /auth/session → resolves user + role
 *   3. If unauthenticated → redirects to `redirectTo` (a login page)
 *   4. If `allowedRoles` is provided AND the user's role is not in the list →
 *      redirects to the user's own role home (e.g. admin lands on
 *      /admin/dashboard instead of /seller/dashboard)
 *
 * Without `allowedRoles`, any authenticated user passes through.
 *
 * USAGE:
 *   <AuthProxy redirectTo="/admin/login" allowedRoles={["superAdmin", "admin"]}>
 *     {children}
 *   </AuthProxy>
 * =============================================================================
 */

import { redirect } from "next/navigation";
import { getRoleHome, getServerSession } from "@/lib/auth/session";

interface AuthProxyProps {
  children: React.ReactNode;
  /** Where to send unauthenticated visitors. Defaults to "/login". */
  redirectTo?: string;
  /** If set, users without one of these role names are sent to their own role home. */
  allowedRoles?: string[];
}

export async function AuthProxy({
  children,
  redirectTo = "/login",
  allowedRoles,
}: AuthProxyProps) {
  const session = await getServerSession();

  if (!session) {
    redirect(redirectTo);
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const roleName = session.role?.name;
    if (!roleName || !allowedRoles.includes(roleName)) {
      // User is authenticated but on the wrong portal — bounce them to their own home
      redirect(getRoleHome(roleName));
    }
  }

  return <>{children}</>;
}
