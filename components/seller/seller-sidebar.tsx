"use client";

/**
 * Seller Sidebar — thin wrapper over the shared <AppSidebar />.
 *
 * Same component, different config: seller brand, seller nav, seller-side
 * logout redirect. The shell logic (active highlighting, theme tokens,
 * collapsing, dropdown) is in components/shell/app-sidebar.tsx.
 *
 * "use client" is required: sellerNavigation contains lucide-react icon
 * components (functions), which can't be serialized across the server →
 * client boundary. Importing the config here keeps everything on the
 * client side.
 */

import { AppSidebar } from "@/components/shell/app-sidebar";
import { sellerNavigation } from "@/config/seller.nav";

export function SellerSidebar() {
  return (
    <AppSidebar
      brand={{
        name: "MultiMart",
        subtitle: "Seller Portal",
        initials: "MM",
        homeHref: "/seller/dashboard",
      }}
      navigation={sellerNavigation}
      logoutRedirect="/seller/login"
    />
  );
}
