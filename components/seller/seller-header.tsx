/**
 * Seller Header — thin wrapper over the shared <AppHeader />.
 *
 * Pre-binds the breadcrumb root to "Seller".
 */

import { AppHeader } from "@/components/shell/app-header";

export function SellerHeader() {
  return <AppHeader breadcrumbRoot="Seller" />;
}
