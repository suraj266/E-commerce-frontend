/**
 * Admin Header — thin wrapper over the shared <AppHeader />.
 *
 * Pre-binds the breadcrumb root to "Admin". Existing layout file imports
 * <AdminHeader /> with no props, so the call-site is unchanged.
 */

import { AppHeader } from "@/components/shell/app-header";
import { AdminSearch } from "@/components/admin/admin-search";

export function AdminHeader() {
  return <AppHeader breadcrumbRoot="Admin" search={<AdminSearch />} />;
}
