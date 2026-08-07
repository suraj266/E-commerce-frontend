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
  Wallet,
  BarChart3,
  Settings,
  Truck,
  PackageX,
  FolderTree,
  Building2,
  Ticket,
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
      {
        title: "Analytics",
        href: "/seller/analytics",
        icon: BarChart3,
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
      {
        // Read-only category browser (Phase 4).
        title: "Categories",
        href: "/seller/categories",
        icon: FolderTree,
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
      {
        title: "Returns",
        href: "/seller/returns",
        icon: PackageX,
      },
      {
        title: "Shipping",
        href: "/seller/shipping",
        icon: Truck,
      },
      {
        title: "Coupons",
        href: "/seller/coupons",
        icon: Ticket,
      },
      {
        title: "Payouts",
        href: "/seller/payouts",
        icon: Wallet,
      },
    ],
  },
  {
    label: "Account",
    items: [
      {
        // Standalone business-profile editor (Phase 4).
        title: "Profile",
        href: "/seller/profile",
        icon: Building2,
      },
      {
        title: "KYC",
        href: "/seller/onboarding",
        icon: ShieldCheck,
      },
      {
        title: "Settings",
        href: "/seller/settings",
        icon: Settings,
      },
    ],
  },
];
