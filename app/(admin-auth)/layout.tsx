/**
 * =============================================================================
 * Admin Auth Layout
 * =============================================================================
 * 
 * Layout for admin authentication pages (/admin/login, /admin/forgot-password).
 * This is a SEPARATE route group from (admin) because:
 * - (admin) has AuthProxy → redirects unauthenticated users
 * - (admin-auth) has ReverseAuthProxy → redirects authenticated users
 * 
 * Both share the /admin/* URL prefix, but have different security behavior:
 * - /admin/login    → (admin-auth) → ReverseAuthProxy → Show login form
 * - /admin/dashboard → (admin)     → AuthProxy        → Show dashboard
 * =============================================================================
 */

import { ReverseAuthProxy } from "@/components/providers/reverse-auth-proxy";

export default function AdminAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReverseAuthProxy>
      <div className="flex min-h-screen w-full items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </ReverseAuthProxy>
  );
}
