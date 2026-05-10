/**
 * =============================================================================
 * Seller Sidebar Navigation Configuration
 * =============================================================================
 *
 * Mirror of admin.nav.ts but for the seller portal. Same shape so both can
 * be passed to the shared <AppSidebar /> component without modification.
 *
 * NOTE: Only add items here once the page is built.
 * =============================================================================
 */

import {
  LayoutDashboard,
  Store,
  Box,
  Boxes,
  ShieldCheck,
  Package,
} from "lucide-react";

import type { NavGroup } from "./nav.types";

export const sellerNavigation: NavGroup[] = [
  {
    label: "Main",
    items: [
      {
        title: "Dashboard",
        href: "/seller/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: "Catalog",
    items: [
      {
        title: "Stores",
        href: "/seller/stores",
        icon: Store,
      },
      {
        title: "Products",
        href: "/seller/products",
        icon: Box,
      },
      {
        title: "Inventory",
        href: "/seller/inventory",
        icon: Boxes,
      },
    ],
  },
  {
    label: "Sales",
    items: [
      {
        title: "Orders",
        href: "/seller/orders",
        icon: Package,
      },
    ],
  },
  {
    label: "Account",
    items: [
      {
        title: "KYC",
        href: "/seller/onboarding",
        icon: ShieldCheck,
      },
    ],
  },
];
