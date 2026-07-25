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
  FileText,
  ListTree,
  GalleryHorizontal,
  Users,
  CreditCard,
  ScrollText,
  Wallet,
  Settings,
  Mail,
  BadgePercent,
  Star,
  FileBadge,
  ImagePlus,
  Boxes,
  ShoppingBag,
  Undo2,
  HandCoins,
  PackageX,
  UserCog,
  ShieldCheck,
  History,
  KeyRound,
} from "lucide-react";

import type { NavItem } from "./nav.types";
import { ROUTE_PERMISSIONS } from "@/lib/auth/permission-slugs";

// Re-export so existing imports `from "@/config/admin.nav"` keep working.
export type { NavItem, NavGroup } from "./nav.types";

/**
 * Admin nav item that may carry a per-permission gate (P3-06). `permission` is
 * a set of slugs the viewer needs ANY of to see the item (PermissionsGuard
 * parity); omit it for items every admin may see. Extends the shared NavItem so
 * these groups still satisfy AppSidebar's `NavGroup[]` prop — the extra field
 * is simply ignored by the shared sidebar and read only by <AdminSidebar>'s
 * client-side hidden-nav filter.
 */
export interface AdminNavItem extends NavItem {
  permission?: readonly string[];
}

export interface AdminNavGroup {
  label: string;
  items: AdminNavItem[];
}

// ---------------------------------------------------------------------------
// Navigation Config
// NOTE: Only add items here when the page is fully built and working.
// ---------------------------------------------------------------------------

export const adminNavigation: AdminNavGroup[] = [
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
        title: "Labels",
        href: "/admin/labels",
        icon: BadgePercent,
      },
      {
        title: "Collections",
        href: "/admin/collections",
        icon: Boxes,
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
      {
        title: "Coupons",
        href: "/admin/coupons",
        icon: BadgePercent,
      },
    ],
  },
  {
    label: "Marketplace",
    items: [
      {
        title: "Customers",
        href: "/admin/customers",
        icon: Users,
      },
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
    label: "Operations",
    items: [
      {
        title: "Orders",
        href: "/admin/orders",
        icon: ShoppingBag,
        permission: ROUTE_PERMISSIONS.orders,
      },
      {
        title: "Refunds",
        href: "/admin/refunds",
        icon: Undo2,
        permission: ROUTE_PERMISSIONS.refunds,
      },
      {
        title: "Payouts",
        href: "/admin/payouts",
        icon: HandCoins,
        permission: ROUTE_PERMISSIONS.payouts,
      },
      {
        // Page built by P3-02 (Returns/RMA). P3-06 only wires the nav link.
        title: "Returns",
        href: "/admin/returns",
        icon: PackageX,
        permission: ROUTE_PERMISSIONS.returns,
      },
    ],
  },
  {
    label: "Marketing",
    items: [
      {
        title: "Coupons",
        href: "/admin/coupons",
        icon: Tag,
      },
      {
        title: "Reviews",
        href: "/admin/reviews",
        icon: Star,
      },
      {
        // Consent-gated broadcast campaigns (Phase 3 Wave 4).
        title: "Newsletter",
        href: "/admin/newsletter",
        icon: Mail,
        permission: ROUTE_PERMISSIONS.newsletter,
      },
    ],
  },
  {
    label: "Content",
    items: [
      {
        title: "Pages",
        href: "/admin/pages",
        icon: FileText,
      },
      {
        title: "Menus",
        href: "/admin/menus",
        icon: ListTree,
      },
      {
        title: "Sliders",
        href: "/admin/sliders",
        icon: GalleryHorizontal,
      },
    ],
  },
  {
    label: "Payments",
    items: [
      {
        title: "Transactions",
        href: "/admin/payments/transactions",
        icon: ScrollText,
      },
      {
        title: "Payment Methods",
        href: "/admin/payments/methods",
        icon: CreditCard,
      },
      {
        title: "Payment Logs",
        href: "/admin/payments/logs",
        icon: Wallet,
      },
      {
        title: "Tax Invoices",
        href: "/admin/invoices",
        icon: FileBadge,
      },
    ],
  },
  {
    label: "Access & Security",
    items: [
      {
        title: "Users",
        href: "/admin/users",
        icon: UserCog,
        permission: ROUTE_PERMISSIONS.users,
      },
      {
        title: "Roles & Permissions",
        href: "/admin/roles",
        icon: ShieldCheck,
        permission: ROUTE_PERMISSIONS.roles,
      },
      {
        title: "Audit Log",
        href: "/admin/audit-logs",
        icon: History,
        permission: ROUTE_PERMISSIONS.auditLogs,
      },
      {
        title: "API Keys",
        href: "/admin/api-keys",
        icon: KeyRound,
      },
    ],
  },
  {
    label: "Settings",
    items: [
      {
        title: "General",
        href: "/admin/settings/general",
        icon: Settings,
      },
      {
        title: "Appearance",
        href: "/admin/settings/appearance",
        icon: Palette,
      },
      {
        title: "Branding",
        href: "/admin/settings/branding",
        icon: ImagePlus,
      },
      {
        title: "Email",
        href: "/admin/settings/email",
        icon: Mail,
      },
      {
        title: "Invoice Template",
        href: "/admin/settings/invoices",
        icon: FileBadge,
      },
    ],
  },
];

