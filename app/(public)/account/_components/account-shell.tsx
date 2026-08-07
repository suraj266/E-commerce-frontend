"use client";

/**
 * AccountShell — shared chrome for every /account/* page.
 *
 * Two responsibilities:
 *   1. Gate the section behind authentication. Anonymous visitors see a
 *      "Sign in" CTA. Non-customer users (admin/seller logged in via the
 *      same auth surface) see a friendly "Wrong account type" message.
 *   2. Render the left sidebar nav with the active item highlighted.
 *
 * Using a wrapper component instead of a Next.js layout means we can
 * skip the layout entirely on routes that don't need it, and avoid
 * triggering the gate when the customer is mid-logout (the public layout
 * still renders header/footer as expected).
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "@apollo/client/react";
import {
  Loader2,
  MapPin,
  Package,
  PackageX,
  MessageSquareWarning,
  KeyRound,
  Star,
  User as UserIcon,
  LogOut,
} from "lucide-react";

import { GET_MY_PROFILE } from "@/lib/graphql/account";
import { MyProfileData } from "@/types/account.types";
import { useAuthStore } from "@/store/auth.store";
import { authApi } from "@/lib/api/auth.api";
import { refreshAccessToken } from "@/lib/auth/refresh-manager";
import { useRouter } from "next/navigation";

const NAV: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { href: "/account/profile", label: "Profile", icon: UserIcon },
  { href: "/account/addresses", label: "Addresses", icon: MapPin },
  { href: "/account/orders", label: "Orders", icon: Package },
  { href: "/account/returns", label: "Returns", icon: PackageX },
  { href: "/account/reviews", label: "Reviews", icon: Star },
  { href: "/account/grievances", label: "Complaints", icon: MessageSquareWarning },
  { href: "/account/password", label: "Password", icon: KeyRound },
];

export function AccountShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const accessToken = useAuthStore((s) => s.accessToken);
  const user = useAuthStore((s) => s.user);
  const logoutStore = useAuthStore((s) => s.logout);
  // Drive UI gating off `user` (persisted) rather than `accessToken`
  // (memory-only) so a hard reload doesn't flash the "Sign in" CTA before
  // the token rehydrates from the refresh cookie.
  const isAuthed = !!user;

  // Probe the customer-only `myProfile` to detect role mismatch (admin/
  // seller token would 403 here). The query is skipped when not authed
  // so we don't burn a network call on the public landing.
  const { data, loading, error } = useQuery<MyProfileData>(GET_MY_PROFILE, {
    skip: !isAuthed,
    fetchPolicy: "cache-and-network",
    errorPolicy: "all",
  });

  async function handleLogout() {
    // Token may be null on a fresh tab (memory-only). Pull one from the
    // refresh cookie first so the backend can actually revoke the session
    // and clear the refreshToken cookie — otherwise the next visit to a
    // gated page bounces the user straight back in.
    const token = accessToken ?? (await refreshAccessToken());
    if (token) {
      try {
        await authApi.logout(token);
      } catch {
        /* ignore — clear local state regardless */
      }
    }
    logoutStore();
    router.push("/");
  }

  if (!isAuthed) {
    return (
      <CenteredCard
        title="Sign in to your account"
        body="Manage your profile, saved addresses, and order history once you're signed in."
        primaryCta={{ href: "/login?next=/account/profile", label: "Sign in" }}
        secondaryCta={{ href: "/register", label: "Create an account" }}
      />
    );
  }

  // 403 surfaces as a graphql error here. We use a forgiving check on the
  // top-level message so we don't bounce the user on an unrelated transient
  // error. The customer-only guard's text is "Profile is only available to
  // customer accounts." — the word "customer" is the stable signal.
  const isForbidden =
    !!error &&
    String(error.message ?? "").toLowerCase().includes("customer");
  if (isForbidden) {
    return (
      <CenteredCard
        title="Account section is for customers"
        body="You're signed in to an admin or seller account. Switch to a customer account to view this page."
        primaryCta={{ href: "/", label: "Back to storefront" }}
      />
    );
  }

  if (loading && !data) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 flex justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 lg:py-14 grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-10">
      <aside className="space-y-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight">My Account</h2>
          {data?.myProfile && (
            <p className="text-sm text-foreground/60 mt-1 truncate">
              {data.myProfile.email}
            </p>
          )}
        </div>
        <nav className="space-y-1">
          {NAV.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition ${
                  active
                    ? "bg-brand text-white font-semibold"
                    : "text-foreground/80 hover:bg-muted/40"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-foreground/70 hover:bg-muted/40 transition"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </nav>
      </aside>

      <main>{children}</main>
    </div>
  );
}

function CenteredCard({
  title,
  body,
  primaryCta,
  secondaryCta,
}: {
  title: string;
  body: string;
  primaryCta?: { href: string; label: string };
  secondaryCta?: { href: string; label: string };
}) {
  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      <p className="text-sm text-foreground/60">{body}</p>
      {(primaryCta || secondaryCta) && (
        <div className="pt-3 flex flex-col sm:flex-row gap-3 justify-center">
          {primaryCta && (
            <Link
              href={primaryCta.href}
              className="inline-flex items-center justify-center rounded-md bg-brand px-6 py-3 text-sm font-semibold text-white shadow hover:bg-brand/90 transition"
            >
              {primaryCta.label}
            </Link>
          )}
          {secondaryCta && (
            <Link
              href={secondaryCta.href}
              className="inline-flex items-center justify-center rounded-md border px-6 py-3 text-sm font-semibold text-foreground/80 hover:border-foreground/40 transition"
            >
              {secondaryCta.label}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
