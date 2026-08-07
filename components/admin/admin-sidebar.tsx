"use client";

/**
 * Admin Sidebar — thin wrapper over the shared <AppSidebar />.
 *
 * The actual sidebar implementation lives in components/shell/app-sidebar.tsx.
 * This file binds the admin-specific brand info, nav config, and post-logout
 * destination, AND applies the client-side hidden-nav half of the P3-06
 * per-permission route gate: items carrying a `permission` set are dropped when
 * the current session doesn't hold any of those slugs, and groups that end up
 * empty are pruned. The authoritative gate is still server-side
 * (<PermissionGate>) + each resolver's PermissionsGuard — this only tidies the
 * nav so admins don't see links they can't open.
 *
 * "use client" is required: adminNavigation contains lucide-react icon
 * components (functions), which can't be serialized across the server →
 * client boundary. Importing the config here keeps it all client-side.
 */

import { useMemo } from "react";
import { AppSidebar } from "@/components/shell/app-sidebar";
import { adminNavigation, type AdminNavGroup } from "@/config/admin.nav";
import { useSiteSettings } from "@/lib/context/site-settings-context";
import { useAdminPermissions } from "@/hooks/use-admin-permissions";
import { hasAnyPermission } from "@/lib/auth/permission-slugs";

export function AdminSidebar() {
  const { logoUrl, brandName, logoHeight } = useSiteSettings();
  const { permissions } = useAdminPermissions();

  const navigation = useMemo(() => {
    return (adminNavigation as AdminNavGroup[])
      .map((group) => ({
        ...group,
        items: group.items.filter(
          (item) =>
            !item.permission ||
            // Unknown set (still loading) → keep the item; enforce once known.
            permissions === null ||
            hasAnyPermission(permissions, item.permission),
        ),
      }))
      .filter((group) => group.items.length > 0);
  }, [permissions]);

  return (
    <AppSidebar
      brand={{
        name: brandName,
        subtitle: "Admin Panel",
        initials: "EC",
        homeHref: "/admin/dashboard",
        logoUrl,
        logoHeight,
      }}
      navigation={navigation}
      logoutRedirect="/admin/login"
      settingsHref="/admin/settings"
    />
  );
}
