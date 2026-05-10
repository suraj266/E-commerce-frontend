/**
 * Public storefront layout.
 *
 * Wraps every page under (public)/* with the admin-managed site header
 * and footer. Both pull their content from the Menu module — see
 * `/admin/menus` to edit the navigation tree.
 */

import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-svh flex flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
