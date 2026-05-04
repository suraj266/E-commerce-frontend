/**
 * =============================================================================
 * Seller Auth Layout — public pages for seller registration & login
 * =============================================================================
 * Route group: /seller/register, /seller/login, /seller/verify-email
 *
 * Uses ReverseAuthProxy: if the user already has a refreshToken cookie they're
 * redirected to /seller/dashboard so they don't see login screens after auth.
 * =============================================================================
 */

import { ReverseAuthProxy } from "@/components/providers/reverse-auth-proxy";

export default function SellerAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReverseAuthProxy>
      <div className="flex min-h-screen w-full items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4 py-10">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </ReverseAuthProxy>
  );
}
