/**
 * =============================================================================
 * Seller (authenticated) Layout
 * =============================================================================
 * Wraps every page under /seller/* (except auth pages in (seller-auth) group).
 *  - AuthProxy → redirects unauthenticated users to /seller/login
 *  - Same sidebar+header shell as the admin panel, configured with the
 *    seller-side brand and nav (config/seller.nav.ts).
 *  - Inherits the platform-wide dynamic theme: the SSR <style> block, the
 *    [data-admin-theme] wrapper, and the dark mode cookie are all shared
 *    with the admin panel, so brand changes apply uniformly across both
 *    portals and the dark/light toggle persists between them.
 * =============================================================================
 */

import type { Metadata } from "next";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SellerSidebar } from "@/components/seller/seller-sidebar";
import { SellerHeader } from "@/components/seller/seller-header";
import { PageTitleProvider } from "@/components/shell/page-title-context";
import { AuthProxy } from "@/components/providers/auth-proxy";
import { getAdminTheme } from "@/lib/theme/get-admin-theme";
import { buildThemeCss } from "@/lib/theme/build-theme-css";
import { getAppThemeMode } from "@/lib/theme/mode";

export const metadata: Metadata = {
  title: "Seller Portal | Ecommerce",
  description: "Manage your seller profile, products, orders, and payouts.",
};

export default async function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Same SSR fetch as the admin layout — single source of truth for theme.
  const [theme, mode] = await Promise.all([
    getAdminTheme(),
    getAppThemeMode(),
  ]);
  const themeCss = buildThemeCss(theme);

  return (
    <AuthProxy redirectTo="/seller/login" allowedRoles={["seller"]}>
      <style
        id="admin-theme-vars"
        dangerouslySetInnerHTML={{ __html: themeCss }}
      />
      <div
        data-admin-theme
        className={`min-h-svh bg-background text-foreground font-sans ${
          mode === "dark" ? "dark" : ""
        }`}
      >
        <TooltipProvider>
          <SidebarProvider>
            <PageTitleProvider>
              <SellerSidebar />
              {/* min-w-0 — see admin layout for the rationale; without it
                  wide page content pushes the body horizontally instead of
                  scrolling inside <main>. */}
              <SidebarInset className="min-w-0">
                <SellerHeader />
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
