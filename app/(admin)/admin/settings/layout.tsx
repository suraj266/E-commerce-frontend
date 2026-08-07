"use client";

/**
 * Settings layout — wraps every /admin/settings/* page.
 *
 * Since the settings sections were moved out of the main sidebar onto the
 * /admin/settings hub, sub-pages need a way back. This renders a shared
 * "← Back to Settings" link above each sub-page's content, and hides it on the
 * hub itself so the hub doesn't link to itself. One place instead of a button
 * copied into all five pages.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHub = pathname === "/admin/settings";

  return (
    <div className="space-y-4">
      {!isHub && (
        <Link
          href="/admin/settings"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Settings
        </Link>
      )}
      {children}
    </div>
  );
}
