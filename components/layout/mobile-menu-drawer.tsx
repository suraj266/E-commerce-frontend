"use client";

/**
 * MobileMenuDrawer — slide-out panel mirroring HEADER_PRIMARY for <md
 * breakpoints. Same data as the desktop primary nav, just stacked
 * vertically with collapsible sections per top-level item.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { X, ChevronDown, ChevronRight } from "lucide-react";

import type { MenuItem } from "@/types/menu.types";
import { Button } from "@/components/ui/button";

function isExternal(url: string): boolean {
  return /^https?:\/\//i.test(url);
}

interface Props {
  open: boolean;
  onClose: () => void;
  items: MenuItem[];
  topItems?: MenuItem[];
}

export function MobileMenuDrawer({ open, onClose, items, topItems }: Props) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  // Lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  if (!open) return null;

  function toggle(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function renderLink(item: MenuItem, indent = false) {
    const ext = isExternal(item.url);
    const target = item.target ?? (ext ? "_blank" : "_self");
    const className = `block py-2.5 text-sm ${indent ? "pl-8" : ""} ${
      indent ? "text-muted-foreground" : "font-medium"
    } hover:bg-muted/30 px-4`;
    if (target === "_blank") {
      return (
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className={className}
          onClick={onClose}
        >
          {item.label}
        </a>
      );
    }
    return (
      <Link href={item.url} className={className} onClick={onClose}>
        {item.label}
      </Link>
    );
  }

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="absolute inset-y-0 left-0 w-[85%] max-w-sm bg-background shadow-xl flex flex-col animate-in slide-in-from-left">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <span className="font-bold text-lg">Menu</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto py-2">
          {items.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              Menu is empty.
            </div>
          )}

          {items.map((item) => {
            const visibleChildren = (item.children ?? []).filter(
              (c) => c.visible !== false,
            );
            const hasChildren = visibleChildren.length > 0;
            const isOpen = expanded.has(item.id);

            if (!hasChildren) return <div key={item.id}>{renderLink(item)}</div>;

            return (
              <div key={item.id}>
                <button
                  type="button"
                  onClick={() => toggle(item.id)}
                  className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium hover:bg-muted/30"
                >
                  <span>{item.label}</span>
                  {isOpen ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
                {isOpen && (
                  <div className="border-l-2 border-primary/20 ml-4">
                    {visibleChildren.map((child) => (
                      <div key={child.id}>{renderLink(child, true)}</div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* Top-strip items (Help, Track Order) tucked at the bottom on mobile */}
          {topItems && topItems.length > 0 && (
            <>
              <div className="my-2 mx-4 border-t" />
              {topItems.map((item) => renderLink(item))}
            </>
          )}
        </nav>
      </div>
    </div>
  );
}
