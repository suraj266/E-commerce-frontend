"use client";

/**
 * Header search — inline, anchored in the header itself.
 *
 * Desktop: a permanent input lives in the header strip between the primary
 * nav and the right-side icons. The suggestions dropdown is absolutely
 * positioned just below the input.
 *
 * Mobile: a single icon button toggles a full-width input that drops down
 * from the header (overlay, not a centered modal). Tapping the icon again
 * (or pressing Escape) closes it.
 *
 * Keyboard:
 *   ↑ / ↓        move highlight
 *   Enter        navigate to highlighted suggestion or run a full search
 *   Esc          close
 *   Ctrl/Cmd+K   focus the input (desktop) / open the overlay (mobile)
 */

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@apollo/client/react";
import { Box, FolderTree, Loader2, Search, X } from "lucide-react";

import { SEARCH_SUGGESTIONS } from "@/lib/graphql/products";
import type {
  CategorySuggestion,
  SearchSuggestion,
  SearchSuggestionsData,
} from "@/types/product.types";
import { formatPrice } from "@/lib/utils/currency";
import { Button } from "@/components/ui/button";

const DEBOUNCE_MS = 250;

/**
 * Exported as `SearchTrigger` so the site header's existing import keeps
 * working. The implementation is now an inline header search, not a
 * centered dialog.
 */
export function SearchTrigger() {
  return (
    <>
      <SearchBox variant="desktop" />
      <SearchBox variant="mobile" />
    </>
  );
}

function SearchBox({ variant }: { variant: "desktop" | "mobile" }) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [input, setInput] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [focused, setFocused] = useState(false);
  const [highlight, setHighlight] = useState(-1);

  // Debounce input → server query
  useEffect(() => {
    const id = setTimeout(() => setDebouncedTerm(input.trim()), DEBOUNCE_MS);
    return () => clearTimeout(id);
  }, [input]);

  // Server ignores 1-char queries; mirror that to avoid noisy fetches
  const enabled = debouncedTerm.length >= 2;
  const { data, loading } = useQuery<SearchSuggestionsData>(SEARCH_SUGGESTIONS, {
    variables: { q: debouncedTerm, limit: 8 },
    skip: !enabled,
    fetchPolicy: "cache-and-network",
  });
  const categories: CategorySuggestion[] =
    data?.searchSuggestions?.categories ?? [];
  const products: SearchSuggestion[] =
    data?.searchSuggestions?.products ?? [];

  // Build a flat selectable list (categories first, then products) so
  // ↑/↓ walks across both sections in the order they're rendered. The
  // discriminator drives Enter's dispatch + the row's visual style.
  type Selectable =
    | { type: "category"; data: CategorySuggestion }
    | { type: "product"; data: SearchSuggestion };
  const selectables: Selectable[] = [
    ...categories.map((c) => ({ type: "category" as const, data: c })),
    ...products.map((p) => ({ type: "product" as const, data: p })),
  ];
  const total = selectables.length;

  // Reset highlight whenever the result set changes
  useEffect(() => {
    setHighlight(total > 0 ? 0 : -1);
  }, [total]);

  // Outside click → close dropdown / mobile overlay
  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) {
        setFocused(false);
        if (variant === "mobile") setMobileOpen(false);
      }
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [variant]);

  // Cmd/Ctrl+K → focus the input (desktop) or open the overlay (mobile)
  useEffect(() => {
    function onKey(e: globalThis.KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (variant === "mobile") {
          setMobileOpen(true);
          setTimeout(() => inputRef.current?.focus(), 0);
        } else {
          inputRef.current?.focus();
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [variant]);

  // Focus the input when the mobile overlay opens
  useEffect(() => {
    if (variant === "mobile" && mobileOpen) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [mobileOpen, variant]);

  const navigateToSearch = useCallback(
    (term: string) => {
      const t = term.trim();
      if (!t) return;
      router.push(`/search?q=${encodeURIComponent(t)}`);
      setFocused(false);
      setMobileOpen(false);
    },
    [router],
  );

  const navigateToProduct = useCallback(
    (slug: string) => {
      router.push(`/product/${slug}`);
      setFocused(false);
      setMobileOpen(false);
    },
    [router],
  );

  const navigateToCategory = useCallback(
    (slug: string) => {
      // Land on /shop with the category filter pre-applied — same screen
      // the sidebar facets use, so the customer keeps full filter control.
      router.push(`/shop?category=${encodeURIComponent(slug)}`);
      setFocused(false);
      setMobileOpen(false);
    },
    [router],
  );

  function onInputKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => (total === 0 ? -1 : (h + 1) % total));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => (total === 0 ? -1 : (h - 1 + total) % total));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const picked = highlight >= 0 ? selectables[highlight] : null;
      if (picked?.type === "category") {
        navigateToCategory(picked.data.slug);
      } else if (picked?.type === "product") {
        navigateToProduct(picked.data.slug);
      } else {
        navigateToSearch(input);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setFocused(false);
      setMobileOpen(false);
      inputRef.current?.blur();
    }
  }

  // Dropdown shows when input is focused AND has at least 1 character.
  const showDropdown =
    (variant === "desktop" ? focused : mobileOpen) && input.trim().length > 0;

  // ---- Desktop ----
  if (variant === "desktop") {
    return (
      <div
        ref={containerRef}
        className="hidden md:block relative flex-1 max-w-xl"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/50 pointer-events-none" />
          <input
            ref={inputRef}
            type="search"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => setFocused(true)}
            onKeyDown={onInputKeyDown}
            placeholder="Search products, brands..."
            className="w-full rounded-full border border-input bg-muted/40 pl-9 pr-9 py-2 text-sm outline-none focus:bg-background focus:border-brand transition"
          />
          {loading && enabled && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-foreground/40 pointer-events-none" />
          )}
        </div>

        {showDropdown && (
          <DropdownPanel
            input={input}
            enabled={enabled}
            loading={loading}
            categories={categories}
            products={products}
            highlight={highlight}
            onHover={setHighlight}
            onSelectProduct={navigateToProduct}
            onSelectCategory={navigateToCategory}
            onSubmitSearch={() => navigateToSearch(input)}
          />
        )}
      </div>
    );
  }

  // ---- Mobile ----
  return (
    <div ref={containerRef} className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        aria-label="Search"
        onClick={() => setMobileOpen((v) => !v)}
      >
        <Search className="h-5 w-5" />
      </Button>

      {mobileOpen && (
        <div className="fixed left-0 right-0 top-[var(--site-header-height,57px)] z-50 bg-background border-b shadow-md">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/50 pointer-events-none" />
              <input
                ref={inputRef}
                type="search"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onInputKeyDown}
                placeholder="Search products, brands..."
                className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm outline-none focus:border-brand transition"
              />
              {loading && enabled && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-foreground/40 pointer-events-none" />
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Close search"
              onClick={() => setMobileOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {showDropdown && (
            <div className="max-w-7xl mx-auto px-4 pb-3">
              <div className="rounded-md border bg-background shadow-sm overflow-hidden">
                <DropdownPanelInner
                  input={input}
                  enabled={enabled}
                  loading={loading}
                  categories={categories}
                  products={products}
                  highlight={highlight}
                  onHover={setHighlight}
                  onSelectProduct={navigateToProduct}
                  onSelectCategory={navigateToCategory}
                  onSubmitSearch={() => navigateToSearch(input)}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------

interface DropdownPanelProps {
  input: string;
  enabled: boolean;
  loading: boolean;
  categories: CategorySuggestion[];
  products: SearchSuggestion[];
  highlight: number;
  onHover: (i: number) => void;
  onSelectCategory: (slug: string) => void;
  onSelectProduct: (slug: string) => void;
  onSubmitSearch: () => void;
}

/** Desktop: absolutely positioned dropdown anchored under the input. */
function DropdownPanel(props: DropdownPanelProps) {
  return (
    <div className="absolute top-full left-0 right-0 mt-2 rounded-md border bg-background shadow-lg z-50 overflow-hidden">
      <DropdownPanelInner {...props} />
    </div>
  );
}

function DropdownPanelInner({
  input,
  enabled,
  loading,
  categories,
  products,
  highlight,
  onHover,
  onSelectCategory,
  onSelectProduct,
  onSubmitSearch,
}: DropdownPanelProps) {
  if (!enabled) {
    return (
      <div className="p-5 text-center text-xs text-foreground/50">
        Keep typing (at least 2 characters)…
      </div>
    );
  }

  // Categories occupy indices [0 .. categories.length-1], products occupy the
  // rest. The parent owns `highlight` and increments by one per row across
  // both sections, so the same offset math works in both renderers.
  const productOffset = categories.length;
  const empty = categories.length === 0 && products.length === 0;

  return (
    <div className="max-h-[min(60vh,420px)] overflow-y-auto">
      {empty && !loading ? (
        <div className="p-6 text-center">
          <p className="text-sm text-foreground/70">
            No quick matches for &ldquo;{input}&rdquo;.
          </p>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              onSubmitSearch();
            }}
            className="mt-2 text-sm text-brand hover:underline font-medium"
          >
            Search anyway →
          </button>
        </div>
      ) : (
        <>
          {categories.length > 0 && (
            <div>
              <div className="px-3 pt-2 pb-1 text-[10px] uppercase tracking-wider text-foreground/50 font-semibold">
                Categories
              </div>
              <ul className="pb-1">
                {categories.map((c, i) => {
                  const idx = i;
                  return (
                    <li key={c.id}>
                      <button
                        type="button"
                        onMouseEnter={() => onHover(idx)}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          onSelectCategory(c.slug);
                        }}
                        className={`w-full text-left flex items-center gap-3 px-3 py-2 ${
                          idx === highlight ? "bg-muted/60" : ""
                        } hover:bg-muted/60 transition`}
                      >
                        <div className="h-8 w-8 rounded-md bg-muted/60 flex items-center justify-center shrink-0">
                          <FolderTree className="h-4 w-4 text-foreground/60" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">
                            {c.name}
                          </div>
                          <div className="text-xs text-foreground/50">
                            in Category
                          </div>
                        </div>
                        <div className="text-xs text-foreground/50 shrink-0">
                          {c.productCount}{" "}
                          {c.productCount === 1 ? "product" : "products"}
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {products.length > 0 && (
            <div>
              {categories.length > 0 && <div className="border-t" />}
              <div className="px-3 pt-2 pb-1 text-[10px] uppercase tracking-wider text-foreground/50 font-semibold">
                Products
              </div>
              <ul className="pb-1">
                {products.map((s, i) => {
                  const idx = productOffset + i;
                  return (
                    <li key={s.id}>
                      <button
                        type="button"
                        onMouseEnter={() => onHover(idx)}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          onSelectProduct(s.slug);
                        }}
                        className={`w-full text-left flex items-center gap-3 px-3 py-2 ${
                          idx === highlight ? "bg-muted/60" : ""
                        } hover:bg-muted/60 transition`}
                      >
                        <div className="h-10 w-10 rounded bg-muted overflow-hidden shrink-0 flex items-center justify-center">
                          {s.imageUrl ? (
                            <Image
                              src={s.imageUrl}
                              alt=""
                              width={40}
                              height={40}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Box className="h-4 w-4 text-foreground/30" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">
                            {s.name}
                          </div>
                          {s.brandName && (
                            <div className="text-xs text-foreground/50 truncate">
                              {s.brandName}
                            </div>
                          )}
                        </div>
                        <div className="text-sm font-semibold tabular-nums shrink-0">
                          {formatPrice(s.price)}
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </>
      )}

      <div className="border-t bg-muted/20">
        <Link
          href={`/search?q=${encodeURIComponent(input.trim())}`}
          onMouseDown={(e) => {
            e.preventDefault();
            onSubmitSearch();
          }}
          className="block text-center text-sm font-medium text-brand hover:bg-muted/40 transition px-4 py-2.5"
        >
          See all results for &ldquo;{input.trim()}&rdquo; →
        </Link>
      </div>
    </div>
  );
}
