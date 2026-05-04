/**
 * Shared types for any role-specific sidebar navigation config (admin, seller,
 * future customer/staff). Lives outside admin.nav.ts so seller.nav.ts and
 * other future configs don't have to import across role boundaries.
 */

import type { LucideIcon } from "lucide-react";

/** Single navigation item rendered as a sidebar link. */
export interface NavItem {
  /** Display label in the sidebar. */
  title: string;
  /** Full route path. */
  href: string;
  /** Lucide icon component. */
  icon: LucideIcon;
  /** Optional notification badge count. */
  badge?: number;
}

/** A group of navigation items under a section heading. */
export interface NavGroup {
  /** Section heading label, e.g. "Main", "Catalog". */
  label: string;
  /** Items within this group. */
  items: NavItem[];
}
