/**
 * =============================================================================
 * Admin Sidebar Navigation Configuration
 * =============================================================================
 *
 * This file defines the complete navigation structure for the Admin Panel.
 * All sidebar menu items, their icons, routes, and grouping are configured here.
 *
 * WHY SEPARATE FILE?
 * - Single source of truth for all admin navigation
 * - Easy to add new menu items as pages are built
 * - Can be filtered by permissions later (e.g., hide "Roles" from sub-admins)
 * - New developers can instantly see all available admin routes
 *
 * HOW TO ADD A NEW MENU ITEM:
 * 1. Build the page at `app/(admin)/admin/<page>/page.tsx`
 * 2. Add the item to the relevant group below
 * 3. Import the icon from lucide-react
 * =============================================================================
 */

import {
  LayoutDashboard,
  FolderTree,
  Store,
  Tag,
  Hash,
  Layers,
  Box,
  Palette,
  Receipt,
} from "lucide-react";

import type { NavGroup } from "./nav.types";

// Re-export so existing imports `from "@/config/admin.nav"` keep working.
export type { NavItem, NavGroup } from "./nav.types";

// ---------------------------------------------------------------------------
// Navigation Config
// NOTE: Only add items here when the page is fully built and working.
// ---------------------------------------------------------------------------

export const adminNavigation: NavGroup[] = [
  {
    label: "Main",
    items: [
      {
        title: "Dashboard",
        href: "/admin/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: "Catalog",
    items: [
      {
        title: "Categories",
        href: "/admin/categories",
        icon: FolderTree,
      },
      {
        title: "Brands",
        href: "/admin/brands",
        icon: Tag,
      },
      {
        title: "Tags",
        href: "/admin/tags",
        icon: Hash,
      },
      {
        title: "Attributes",
        href: "/admin/attributes",
        icon: Layers,
      },
      {
        title: "Taxes",
        href: "/admin/taxes",
        icon: Receipt,
      },
    ],
  },
  {
    label: "Marketplace",
    items: [
      {
        title: "Sellers",
        href: "/admin/sellers",
        icon: Store,
      },
      {
        title: "Stores",
        href: "/admin/stores",
        icon: Store,
      },
      {
        title: "Products",
        href: "/admin/products",
        icon: Box,
      },
    ],
  },
  {
    label: "Settings",
    items: [
      {
        title: "Appearance",
        href: "/admin/settings/appearance",
        icon: Palette,
      },
    ],
  },
];

