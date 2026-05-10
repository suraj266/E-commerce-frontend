/**
 * Menu types — mirror backend Menu entity. Items live in a JSON-encoded
 * tree on the wire; use parseMenuItems() to read.
 */

export const MENU_LOCATIONS = [
  "HEADER_PRIMARY",
  "HEADER_TOP",
  "FOOTER_SHOP",
  "FOOTER_HELP",
  "FOOTER_COMPANY",
  "FOOTER_LEGAL",
  "FOOTER_SOCIAL",
] as const;
export type MenuLocation = (typeof MENU_LOCATIONS)[number];

export const MENU_LOCATION_LABEL: Record<MenuLocation, string> = {
  HEADER_PRIMARY: "Header — primary navigation",
  HEADER_TOP: "Header — top strip",
  FOOTER_SHOP: "Footer — Shop",
  FOOTER_HELP: "Footer — Help & Support",
  FOOTER_COMPANY: "Footer — Company",
  FOOTER_LEGAL: "Footer — Legal",
  FOOTER_SOCIAL: "Footer — Social",
};

export const MENU_LOCATION_HINT: Record<MenuLocation, string> = {
  HEADER_PRIMARY: "Main top nav. Supports 1-level dropdowns.",
  HEADER_TOP: "Thin strip above the header (Help, Track Order).",
  FOOTER_SHOP: "Footer column 1 — typically catalog links.",
  FOOTER_HELP: "Footer column 2 — typically help / support links.",
  FOOTER_COMPANY: "Footer column 3 — typically about / careers / press.",
  FOOTER_LEGAL: "Footer column 4 — terms / privacy / refund policy.",
  FOOTER_SOCIAL: "Social icons row. Use lucide icon names (Twitter, Instagram, ...).",
};

export interface MenuItem {
  id: string;
  label: string;
  url: string;
  target?: "_self" | "_blank";
  /** Lucide icon name (used by FOOTER_SOCIAL). */
  icon?: string;
  visible: boolean;
  children: MenuItem[];
}

export interface Menu {
  id: string;
  name: string;
  location: MenuLocation;
  isActive: boolean;
  /** JSON-encoded MenuItem[] tree. Use parseMenuItems() to read. */
  items: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

// ---------------------------------------------------------------------------
// Tree helpers
// ---------------------------------------------------------------------------

/**
 * Parse + sanitize the item tree from JSON. Drops malformed nodes; never
 * throws. Children are recursively cleaned. Missing fields fall back to
 * sensible defaults so legacy items keep working.
 */
export function parseMenuItems(json: string | null | undefined): MenuItem[] {
  if (!json) return [];
  try {
    const parsed = JSON.parse(json);
    if (!Array.isArray(parsed)) return [];
    return sanitize(parsed);
  } catch {
    return [];
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function sanitize(arr: any[]): MenuItem[] {
  return arr
    .filter((n) => n && typeof n === "object" && typeof n.label === "string")
    .map((n) => ({
      id: typeof n.id === "string" ? n.id : crypto.randomUUID?.() ?? Math.random().toString(36).slice(2),
      label: n.label,
      url: typeof n.url === "string" ? n.url : "",
      target: n.target === "_blank" ? "_blank" : "_self",
      icon: typeof n.icon === "string" ? n.icon : undefined,
      visible: n.visible !== false,
      children: Array.isArray(n.children) ? sanitize(n.children) : [],
    }));
}

export function serializeMenuItems(items: MenuItem[]): string {
  return JSON.stringify(items);
}

// ---------------------------------------------------------------------------
// GraphQL response shapes
// ---------------------------------------------------------------------------

export interface GetPublicMenuData {
  publicMenu: Menu;
}

export interface GetAdminMenusData {
  adminMenus: Menu[];
}

export interface GetAdminMenuData {
  adminMenu: Menu;
}

export interface UpsertMenuData {
  upsertMenu: Menu;
}

export interface SetMenuActiveData {
  setMenuActive: Menu;
}

export interface RemoveMenuData {
  removeMenu: Menu;
}
