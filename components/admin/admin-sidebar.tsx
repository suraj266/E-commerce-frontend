"use client";

/**
 * Admin Sidebar — thin wrapper over the shared <AppSidebar />.
 *
 * The actual sidebar implementation lives in components/shell/app-sidebar.tsx.
 * This file just binds the admin-specific brand info, nav config, and
 * post-logout destination so admin/(admin)/layout.tsx can render <AdminSidebar />
 * with no extra props — same call-site as before.
 *
 * "use client" is required: adminNavigation contains lucide-react icon
 * components (functions), which can't be serialized across the server →
 * client boundary. Importing the config here keeps it all client-side.
 */

import { AppSidebar } from "@/components/shell/app-sidebar";
import { adminNavigation } from "@/config/admin.nav";

export function AdminSidebar() {
  return (
    <AppSidebar
      brand={{
        name: "Ecommerce",
        subtitle: "Admin Panel",
        initials: "EC",
        homeHref: "/admin/dashboard",
      }}
      navigation={adminNavigation}
      logoutRedirect="/admin/login"
    />
  );
}
