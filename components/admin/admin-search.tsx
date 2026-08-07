"use client";

/**
 * =============================================================================
 * AdminSearch — global command palette for the admin panel
 * =============================================================================
 *
 * Replaces the old non-functional header <input> stub. Renders the header
 * search trigger (styled like the field it replaces) plus a command-palette
 * dialog that opens on click or ⌘K / Ctrl-K.
 *
 * Two kinds of results:
 *   1. Quick navigation — the admin nav (config/admin.nav.ts), filtered live and
 *      gated by the viewer's held permissions (same `can()` the sidebar uses).
 *   2. Live entity search — products, orders and customers, each backed by an
 *      EXISTING resolver that already accepts a text arg (see lib/graphql/
 *      admin-search.ts). Each source runs only when the viewer holds its
 *      permission, so we never fire a query that would 403.
 *
 * Entities with a detail/edit route deep-link straight to it (products →
 * /admin/products/[id]/edit). List-only entities (orders, customers) navigate
 * to their list with `?search=<term>`; those clients seed their filter from the
 * URL so the result lands pre-filtered.
 *
 * Hand-rolled on components/ui/dialog.tsx (Radix) rather than pulling in `cmdk`
 * — adding a dependency would force a Docker image rebuild, and the palette is
 * small enough to own.
 * =============================================================================
 */

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@apollo/client/react";
import {
  Search,
  Box,
  ShoppingBag,
  Users,
  CornerDownLeft,
  Loader2,
  ArrowUp,
  ArrowDown,
  type LucideIcon,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { adminNavigation, settingsSections } from "@/config/admin.nav";
import { ROUTE_PERMISSIONS } from "@/lib/auth/permission-slugs";
import { useAdminPermissions } from "@/hooks/use-admin-permissions";
import {
  ADMIN_SEARCH_PRODUCTS,
  ADMIN_SEARCH_ORDERS,
  ADMIN_SEARCH_CUSTOMERS,
  type AdminSearchProductsData,
  type AdminSearchOrdersData,
  type AdminSearchCustomersData,
} from "@/lib/graphql/admin-search";

const DEBOUNCE_MS = 200;
const MIN_ENTITY_CHARS = 2;
const PER_SOURCE = 5;

/** A single selectable row in the palette. */
interface FlatItem {
  key: string;
  href: string;
  title: string;
  subtitle?: string;
  badge?: string;
  icon: LucideIcon;
}

interface Section {
  key: string;
  heading: string;
  loading: boolean;
  items: FlatItem[];
}

// `isMac` via useSyncExternalStore: reads a browser-only value with a stable
// server snapshot (false), so there's no hydration mismatch and no setState in
// an effect. The platform never changes, so the store never emits.
const noopSubscribe = () => () => {};
const getIsMac = () =>
  typeof navigator !== "undefined" && /mac/i.test(navigator.platform);
const getIsMacServer = () => false;

function money(amount: number, currency = "INR"): string {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount}`;
  }
}

export function AdminSearch() {
  const router = useRouter();
  const { can } = useAdminPermissions();

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [active, setActive] = useState(0);

  const activeRef = useRef<HTMLButtonElement | null>(null);

  // Platform-aware shortcut hint (⌘K on macOS, Ctrl K elsewhere).
  const isMac = useSyncExternalStore(noopSubscribe, getIsMac, getIsMacServer);

  // ⌘K / Ctrl-K toggles the palette from anywhere.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Debounce the raw input into the value the queries actually use.
  useEffect(() => {
    const id = setTimeout(() => setDebounced(query.trim()), DEBOUNCE_MS);
    return () => clearTimeout(id);
  }, [query]);

  // ---- Permission gates (mirror each resolver's guard) ----
  const canProducts = can(["product:read"]);
  const canOrders = can(ROUTE_PERMISSIONS.orders);
  const canCustomers = can(["customer:read"]);

  const entityActive = debounced.length >= MIN_ENTITY_CHARS;

  // ---- Live entity queries (skipped until there's a real term + permission) ----
  const { data: productData, loading: productLoading } =
    useQuery<AdminSearchProductsData>(ADMIN_SEARCH_PRODUCTS, {
      variables: { query: debounced, pageSize: PER_SOURCE },
      skip: !open || !entityActive || !canProducts,
      errorPolicy: "all",
    });

  const { data: orderData, loading: orderLoading } =
    useQuery<AdminSearchOrdersData>(ADMIN_SEARCH_ORDERS, {
      variables: { search: debounced, pageSize: PER_SOURCE },
      skip: !open || !entityActive || !canOrders,
      errorPolicy: "all",
    });

  const { data: customerData, loading: customerLoading } =
    useQuery<AdminSearchCustomersData>(ADMIN_SEARCH_CUSTOMERS, {
      variables: { search: debounced, pageSize: PER_SOURCE },
      skip: !open || !entityActive || !canCustomers,
      errorPolicy: "all",
    });

  // ---- Build the sections ----
  const sections = useMemo<Section[]>(() => {
    const q = debounced.toLowerCase();
    const out: Section[] = [];

    // 1. Navigation — the main sidebar groups PLUS the settings sections (which
    // were moved out of the sidebar to the /admin/settings hub but must stay
    // searchable). Normalized to one flat shape. When empty, show a curated
    // "Jump to".
    const navSource: {
      title: string;
      href: string;
      icon: LucideIcon;
      permission?: readonly string[];
      group: string;
    }[] = [
      ...adminNavigation.flatMap((group) =>
        group.items.map((item) => ({
          title: item.title,
          href: item.href,
          icon: item.icon,
          permission: item.permission,
          group: group.label,
        })),
      ),
      ...settingsSections.map((s) => ({
        title: s.title,
        href: s.href,
        icon: s.icon,
        group: "Settings",
      })),
    ];

    const navItems = navSource
      .filter((n) => can(n.permission ?? []))
      .filter((n) =>
        q ? `${n.title} ${n.group}`.toLowerCase().includes(q) : true,
      )
      .slice(0, q ? 6 : 7)
      .map<FlatItem>((n) => ({
        key: `nav:${n.href}`,
        href: n.href,
        title: n.title,
        subtitle: n.group,
        icon: n.icon,
      }));

    if (navItems.length > 0) {
      out.push({
        key: "nav",
        heading: q ? "Navigation" : "Jump to",
        loading: false,
        items: navItems,
      });
    }

    // Entity sources only contribute once a term is being searched.
    if (entityActive) {
      if (canProducts) {
        out.push({
          key: "products",
          heading: "Products",
          loading: productLoading,
          items: (productData?.searchProducts.items ?? []).map<FlatItem>(
            (p) => ({
              key: `product:${p.id}`,
              href: `/admin/products/${p.id}/edit`,
              title: p.name,
              subtitle: money(p.price),
              badge: p.status,
              icon: Box,
            }),
          ),
        });
      }

      if (canOrders) {
        out.push({
          key: "orders",
          heading: "Orders",
          loading: orderLoading,
          items: (orderData?.adminOrders.items ?? []).map<FlatItem>((o) => ({
            key: `order:${o.id}`,
            href: `/admin/orders?search=${encodeURIComponent(o.orderNumber)}`,
            title: o.orderNumber,
            subtitle: money(o.totalAmount, o.currencyCode),
            badge: o.status,
            icon: ShoppingBag,
          })),
        });
      }

      if (canCustomers) {
        out.push({
          key: "customers",
          heading: "Customers",
          loading: customerLoading,
          items: (customerData?.adminCustomers.items ?? []).map<FlatItem>(
            (c) => ({
              key: `customer:${c.id}`,
              href: `/admin/customers?search=${encodeURIComponent(
                c.email || c.name || "",
              )}`,
              title: c.name || c.email || "Unnamed customer",
              subtitle: c.name ? c.email ?? c.phone ?? undefined : c.phone ?? undefined,
              badge: c.status,
              icon: Users,
            }),
          ),
        });
      }
    }

    return out;
  }, [
    debounced,
    entityActive,
    can,
    canProducts,
    canOrders,
    canCustomers,
    productData,
    productLoading,
    orderData,
    orderLoading,
    customerData,
    customerLoading,
  ]);

  // Flat list (in render order) for keyboard navigation.
  const flat = useMemo(() => sections.flatMap((s) => s.items), [sections]);
  const anyLoading = sections.some((s) => s.loading);

  // Clamp the highlight at read time rather than storing an out-of-range index
  // (results shrink as the user types). `active` is reset to 0 on each keystroke
  // in the input's onChange, so this only guards the transient shrink.
  const safeActive = flat.length > 0 ? Math.min(active, flat.length - 1) : 0;

  // Scroll the highlighted row into view (DOM sync — no state).
  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "nearest" });
  }, [safeActive]);

  const go = useCallback(
    (href: string) => {
      setOpen(false);
      setQuery("");
      setDebounced("");
      router.push(href);
    },
    [router],
  );

  function onInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive(Math.min(safeActive + 1, flat.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive(Math.max(safeActive - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = flat[safeActive];
      if (item) go(item.href);
    }
  }

  function onOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setQuery("");
      setDebounced("");
      setActive(0);
    }
  }

  const showEmpty =
    entityActive && !anyLoading && flat.length === 0;

  // Running index so each row knows its position in the flat list.
  let cursor = -1;

  return (
    <>
      {/* Header trigger — visually replaces the old search field. */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search"
        className="relative hidden h-9 w-[200px] items-center gap-2 rounded-md border bg-background pr-2 pl-8 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none md:flex lg:w-[280px]"
      >
        <Search className="absolute top-2.5 left-2.5 h-4 w-4" />
        <span className="flex-1 text-left">Search…</span>
        <kbd className="pointer-events-none hidden select-none rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px] font-medium lg:inline-block">
          {isMac ? "⌘K" : "Ctrl K"}
        </kbd>
      </button>

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          showCloseButton={false}
          className="top-[12%] max-w-xl translate-y-0 gap-0 overflow-hidden p-0 sm:max-w-xl"
        >
          <DialogTitle className="sr-only">Search the admin panel</DialogTitle>
          <DialogDescription className="sr-only">
            Search products, orders and customers, or jump to any admin page.
          </DialogDescription>

          {/* Search input */}
          <div className="flex items-center gap-2 border-b px-3">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              autoFocus
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActive(0);
              }}
              onKeyDown={onInputKeyDown}
              placeholder="Search products, orders, customers, or jump to a page…"
              className="h-11 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            {anyLoading && (
              <Loader2 className="h-4 w-4 shrink-0 animate-spin text-muted-foreground" />
            )}
          </div>

          {/* Results */}
          <div className="max-h-[60vh] overflow-y-auto p-2">
            {sections.map((section) => (
              <div key={section.key} className="mb-1 last:mb-0">
                <div className="flex items-center gap-2 px-2 py-1.5 text-xs font-medium text-muted-foreground">
                  {section.heading}
                  {section.loading && (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  )}
                </div>
                {section.items.length === 0 && section.loading && (
                  <div className="px-2 py-1.5 text-sm text-muted-foreground">
                    Searching…
                  </div>
                )}
                {section.items.map((item) => {
                  cursor += 1;
                  const idx = cursor;
                  const isActive = idx === safeActive;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.key}
                      ref={isActive ? activeRef : undefined}
                      type="button"
                      onClick={() => go(item.href)}
                      onMouseMove={() => setActive(idx)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-md px-2 py-2 text-left text-sm",
                        isActive
                          ? "bg-accent text-accent-foreground"
                          : "text-foreground",
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate">{item.title}</span>
                        {item.subtitle && (
                          <span className="block truncate text-xs text-muted-foreground">
                            {item.subtitle}
                          </span>
                        )}
                      </span>
                      {item.badge && (
                        <span className="shrink-0 rounded border px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}

            {showEmpty && (
              <div className="px-2 py-8 text-center text-sm text-muted-foreground">
                No results for &ldquo;{debounced}&rdquo;
              </div>
            )}

            {!entityActive && sections.length === 0 && (
              <div className="px-2 py-8 text-center text-sm text-muted-foreground">
                Type to search products, orders and customers.
              </div>
            )}
          </div>

          {/* Footer hint */}
          <div className="flex items-center gap-4 border-t px-3 py-2 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <ArrowUp className="h-3 w-3" />
              <ArrowDown className="h-3 w-3" />
              navigate
            </span>
            <span className="flex items-center gap-1">
              <CornerDownLeft className="h-3 w-3" />
              open
            </span>
            <span className="ml-auto">esc to close</span>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
