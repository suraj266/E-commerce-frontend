"use client";

/**
 * =============================================================================
 * App Header — shared between admin and seller portals
 * =============================================================================
 *
 * Sticky top bar with sidebar trigger, breadcrumb, search stub, theme toggle,
 * and notification bell. Role-specific bits (the breadcrumb root label) come
 * in as props so AdminHeader / SellerHeader can pre-bind them.
 * =============================================================================
 */

import { usePathname } from "next/navigation";
import { Search } from "lucide-react";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/shell/theme-toggle";
import { usePageTitle } from "@/components/shell/page-title-context";
import { NotificationBell } from "@/components/notifications/notification-bell";

interface AppHeaderProps {
  /** Leftmost breadcrumb segment, e.g. "Admin" or "Seller". */
  breadcrumbRoot: string;
  /**
   * Optional search slot. When provided (e.g. the admin command palette) it
   * replaces the default placeholder field. Left undefined for portals that
   * don't wire a search yet, which keep the inert stub.
   */
  search?: React.ReactNode;
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function titleCase(segment: string): string {
  return segment
    .split("-")
    .map((p) => (p.length > 0 ? p[0].toUpperCase() + p.slice(1) : p))
    .join(" ");
}

export function AppHeader({ breadcrumbRoot, search }: AppHeaderProps) {
  const pathname = usePathname();
  const overrideTitle = usePageTitle();

  // Skip raw UUID segments so dynamic detail routes don't render IDs.
  // Pages with a meaningful name should set it via useSetPageTitle().
  const segments = pathname.split("/").filter((s) => s && !UUID_RE.test(s));
  const fallback = segments[segments.length - 1] || "Dashboard";
  const formattedPage = overrideTitle ?? titleCase(fallback);

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:bg-surface-2/55 dark:supports-[backdrop-filter]:bg-surface-2/40 dark:border-border-strong">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 !h-4" />
        <nav className="flex items-center gap-1.5 text-sm">
          <span className="text-muted-foreground">{breadcrumbRoot}</span>
          <span className="text-muted-foreground">/</span>
          <span className="font-medium">{formattedPage}</span>
        </nav>
      </div>

      <div className="ml-auto flex items-center gap-3">
        {search ?? (
          <div className="relative hidden md:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-[200px] lg:w-[280px] pl-8 h-9"
            />
          </div>
        )}

        <ThemeToggle />

        <NotificationBell />
      </div>
    </header>
  );
}
