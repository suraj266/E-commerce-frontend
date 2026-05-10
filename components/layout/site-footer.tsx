"use client";

/**
 * SiteFooter — public storefront footer.
 *
 * Renders 4 link columns + a social icon row, all admin-managed:
 *   - FOOTER_SHOP / FOOTER_HELP / FOOTER_COMPANY / FOOTER_LEGAL → 4 columns
 *   - FOOTER_SOCIAL → icon row at the bottom
 *
 * Each column fetches independently. A missing/inactive menu shows as an
 * empty column (no error, no fallback) — admin sees the empty state in
 * /admin/menus.
 */

import Link from "next/link";
import { useQuery } from "@apollo/client/react";
import * as LucideIcons from "lucide-react";

import { GET_PUBLIC_MENU } from "@/lib/graphql/menus";
import {
  GetPublicMenuData,
  parseMenuItems,
  type MenuItem,
  type MenuLocation,
} from "@/types/menu.types";

function isExternal(url: string): boolean {
  return /^https?:\/\//i.test(url);
}

function FooterLink({ item }: { item: MenuItem }) {
  const ext = isExternal(item.url);
  const target = item.target ?? (ext ? "_blank" : "_self");
  const className =
    "text-sm text-muted-foreground hover:text-foreground transition";
  if (target === "_blank") {
    return (
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {item.label}
      </a>
    );
  }
  return (
    <Link href={item.url} className={className}>
      {item.label}
    </Link>
  );
}

function FooterColumn({
  location,
  fallbackTitle,
}: {
  location: MenuLocation;
  fallbackTitle: string;
}) {
  const { data } = useQuery<GetPublicMenuData>(GET_PUBLIC_MENU, {
    variables: { location },
    fetchPolicy: "cache-first",
    errorPolicy: "ignore",
  });
  const menu = data?.publicMenu;
  const items = parseMenuItems(menu?.items).filter(
    (i) => i.visible !== false,
  );
  if (items.length === 0) return null;

  // Use the menu's `name` minus any "Footer — " prefix as the column heading,
  // falling back to the parameter if the menu name doesn't start with that.
  const heading =
    menu?.name?.replace(/^Footer\s*[—-]\s*/i, "") ?? fallbackTitle;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold tracking-wide uppercase">
        {heading}
      </h3>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id}>
            <FooterLink item={item} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialRow() {
  const { data } = useQuery<GetPublicMenuData>(GET_PUBLIC_MENU, {
    variables: { location: "FOOTER_SOCIAL" as MenuLocation },
    fetchPolicy: "cache-first",
    errorPolicy: "ignore",
  });
  const items = parseMenuItems(data?.publicMenu?.items).filter(
    (i) => i.visible !== false,
  );
  if (items.length === 0) return null;

  return (
    <div className="flex items-center gap-2">
      {items.map((item) => {
        // Lucide icon by name (case-sensitive). Fallback to a generic link
        // glyph if the admin typed an unknown name.
        const iconName = item.icon ?? "";
        const Icon =
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ((LucideIcons as any)[iconName] as
            | LucideIcons.LucideIcon
            | undefined) ?? LucideIcons.Link;
        const ext = isExternal(item.url);
        return (
          <a
            key={item.id}
            href={item.url}
            target={ext ? "_blank" : "_self"}
            rel={ext ? "noopener noreferrer" : undefined}
            className="h-9 w-9 rounded-full border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/30 transition"
            aria-label={item.label}
            title={item.label}
          >
            <Icon className="h-4 w-4" />
          </a>
        );
      })}
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t bg-muted/20 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <FooterColumn location="FOOTER_SHOP" fallbackTitle="Shop" />
          <FooterColumn location="FOOTER_HELP" fallbackTitle="Help" />
          <FooterColumn location="FOOTER_COMPANY" fallbackTitle="Company" />
          <FooterColumn location="FOOTER_LEGAL" fallbackTitle="Legal" />
        </div>

        <div className="border-t pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Ecommerce Platform. All rights
            reserved.
          </div>
          <SocialRow />
        </div>
      </div>
    </footer>
  );
}
