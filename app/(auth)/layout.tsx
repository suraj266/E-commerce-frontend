/**
 * =============================================================================
 * Auth Layout
 * =============================================================================
 * 
 * Layout for authentication pages (login, register, forgot password).
 * Centers the auth form in the middle of the screen.
 * 
 * REVERSE AUTH PROTECTION:
 * If a user is already logged in (has refreshToken cookie),
 * they will be automatically redirected to /admin/dashboard.
 * This prevents the confusing UX of seeing a login page
 * when you're already authenticated.
 * =============================================================================
 */

import { ReverseAuthProxy } from "@/components/providers/reverse-auth-proxy";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReverseAuthProxy>
      <div className="flex h-screen w-full items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </ReverseAuthProxy>
  );
}

