/**
 * Root layout for the `(admin)` route group — wraps every /admin/* page in the
 * sidebar, header, and AuthProxy. The AuthProxy runs on the server before any
 * page content renders: without a valid refreshToken cookie the request is
 * redirected to /admin/login and no admin HTML is ever sent.
 */

import type { Metadata } from "next";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";
import { PageTitleProvider } from "@/components/shell/page-title-context";
import { AuthProxy } from "@/components/providers/auth-proxy";
import { getAdminTheme } from "@/lib/theme/get-admin-theme";
import { buildThemeCss } from "@/lib/theme/build-theme-css";
import { getAppThemeMode } from "@/lib/theme/mode";

// The admin panel is authenticated + per-request (it server-fetches the live
// theme and gates on the session), so there is nothing to statically prerender.
// force-dynamic keeps it out of build-time static generation — otherwise every
// admin page tries to prerender against a backend that isn't up at build time
// and stalls the build. Runtime behavior is unchanged (these routes are dynamic).
export const dynamic = "force-dynamic";

// ---------------------------------------------------------------------------
// SEO Metadata for Admin Panel
// ---------------------------------------------------------------------------
export const metadata: Metadata = {
  title: "Admin Panel | Ecommerce",
  description: "Manage your ecommerce platform - orders, products, users and more.",
};

// ===========================================================================
// Layout Component
// ===========================================================================

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch the admin theme on the server so the CSS variables are present
  // on the very first paint — no flash of default theme. Falls back to
  // safe defaults if the backend is unreachable.
  const [theme, mode] = await Promise.all([
    getAdminTheme(),
    getAppThemeMode(),
  ]);
  const themeCss = buildThemeCss(theme);

  return (
    <AuthProxy
      redirectTo="/admin/login"
      allowedRoles={["superAdmin", "admin"]}
    >
      {/* Scoped CSS variables — only apply inside [data-admin-theme]. */}
      <style
        id="admin-theme-vars"
        dangerouslySetInnerHTML={{ __html: themeCss }}
      />
      {/*
        The wrapper has to be a real box (not display:contents) AND must
        re-apply bg-background + text-foreground. Reason: those tokens are
        set on <body> outside [data-admin-theme], so their *computed* values
        come from :root (the light theme). Without re-applying them inside
        the wrapper, redefining --foreground/--background on the wrapper has
        no visible effect — descendants would inherit body's resolved color.
      */}
      <div
        data-admin-theme
        className={`min-h-svh bg-background text-foreground font-sans ${
          mode === "dark" ? "dark" : ""
        }`}
      >
        <TooltipProvider>
          <SidebarProvider>
            <PageTitleProvider>
              <AdminSidebar />

              {/* Main Content Area (right of sidebar).
                  `min-w-0` is critical: SidebarInset is a flex-1 child of the
                  Sidebar's row container, and without it the default
                  `min-width: auto` would let inner pages with wide content
                  (tables, fixed-width column rows) push the body horizontally
                  instead of scrolling within the page. */}
              <SidebarInset className="min-w-0">
                <AdminHeader />

                <main className="flex-1 overflow-auto p-4 md:p-6">
                  {children}
                </main>
              </SidebarInset>
            </PageTitleProvider>
          </SidebarProvider>
        </TooltipProvider>
      </div>
    </AuthProxy>
  );
}

