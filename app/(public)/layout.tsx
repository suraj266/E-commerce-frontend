/**
 * Public storefront layout.
 *
 * Wraps every page under (public)/* with the admin-managed site header
 * and footer. Both pull their content from the Menu module — see
 * `/admin/menus` to edit the navigation tree.
 */

import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { getAppThemeMode } from "@/lib/theme/mode";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Light default, dark via the header toggle. Read the shared platform theme
  // cookie server-side and apply `.dark` on this wrapper so the correct mode
  // paints on first load (no flash). `bg-background` on the wrapper means the
  // dark surface fills the viewport even though <body> stays light.
  const mode = await getAppThemeMode();
  return (
    <div
      data-store-theme
      className={`${mode === "dark" ? "dark " : ""}min-h-svh flex flex-col bg-background text-foreground`}
    >
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
