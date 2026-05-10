"use client";

/**
 * ShopFilters — left rail of the shop page. Three filter sections:
 *   - Category   (single-select; "All Products" = no filter)
 *   - Price      (single-select bucket: under-50 / 50-150 / over-150)
 *   - Size       (toggle pills, multi-select; UI-only for now since most
 *                 of the catalog has no Size attribute. Wire to the
 *                 attribute filter when Size becomes a real facet.)
 *
 * Filter state is owned by the parent so it can serialize to the URL.
 */

import { useQuery } from "@apollo/client/react";
import { GET_SHOP_FILTER_CATEGORIES } from "@/lib/graphql/categories";
import type { GetShopFilterCategoriesData } from "@/types/category.types";

export type PriceBucketKey = "all" | "under50" | "50-150" | "over150";

export const PRICE_BUCKETS: {
  key: PriceBucketKey;
  label: string;
  min?: number;
  max?: number;
}[] = [
  { key: "all", label: "Any price" },
  { key: "under50", label: "Under $50", max: 50 },
  { key: "50-150", label: "$50 - $150", min: 50, max: 150 },
  { key: "over150", label: "Over $150", min: 150 },
];

export const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL"] as const;
export type SizeOption = (typeof SIZE_OPTIONS)[number];

export interface ShopFiltersValue {
  categorySlug: string | null;
  priceBucket: PriceBucketKey;
  sizes: SizeOption[];
}

interface ShopFiltersProps {
  value: ShopFiltersValue;
  onChange: (next: ShopFiltersValue) => void;
  /**
   * Hide the Category section. Useful on `/category/[slug]` where the
   * category is already implied by the route — showing a category filter
   * there would just let the user navigate away.
   */
  showCategory?: boolean;
}

export function ShopFilters({
  value,
  onChange,
  showCategory = true,
}: ShopFiltersProps) {
  const { data } = useQuery<GetShopFilterCategoriesData>(
    GET_SHOP_FILTER_CATEGORIES,
    { fetchPolicy: "cache-first" },
  );
  // Backend already returns only root categories with active products,
  // sorted by displayOrder — no client-side filtering needed.
  const shopCats = data?.shopFilterCategories ?? [];

  function setCategory(slug: string | null) {
    onChange({ ...value, categorySlug: slug });
  }
  function setPrice(bucket: PriceBucketKey) {
    onChange({ ...value, priceBucket: bucket });
  }
  function toggleSize(size: SizeOption) {
    const next = value.sizes.includes(size)
      ? value.sizes.filter((s) => s !== size)
      : [...value.sizes, size];
    onChange({ ...value, sizes: next });
  }

  return (
    <aside className="space-y-8">
      <div>
        <h2 className="text-xl font-bold tracking-tight border-b pb-3">
          Filters
        </h2>
      </div>

      {/* ---- Category ---- */}
      {showCategory && (
        <FilterSection title="Category">
          <CheckboxRow
            label="All Products"
            checked={value.categorySlug === null}
            onChange={() => setCategory(null)}
          />
          {shopCats.map((c) => (
            <CheckboxRow
              key={c.id}
              label={`${c.name} (${c.productCount})`}
              checked={value.categorySlug === c.slug}
              onChange={() => setCategory(c.slug)}
            />
          ))}
        </FilterSection>
      )}


      {/* ---- Price Range ---- */}
      <FilterSection title="Price Range">
        {PRICE_BUCKETS.map((b) => (
          <RadioRow
            key={b.key}
            label={b.label}
            checked={value.priceBucket === b.key}
            onChange={() => setPrice(b.key)}
          />
        ))}
      </FilterSection>

      {/* ---- Size ---- */}
      <FilterSection title="Size">
        <div className="flex flex-wrap gap-2">
          {SIZE_OPTIONS.map((s) => {
            const active = value.sizes.includes(s);
            return (
              <button
                key={s}
                type="button"
                onClick={() => toggleSize(s)}
                className={`h-9 w-12 text-sm font-semibold rounded-md border transition ${
                  active
                    ? "bg-brand text-white border-brand"
                    : "bg-background text-foreground/80 hover:border-foreground/40"
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </FilterSection>
    </aside>
  );
}

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h3 className="text-sm font-semibold tracking-wide text-foreground">
        {title}
      </h3>
      <div className="space-y-2.5">{children}</div>
    </section>
  );
}

function CheckboxRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer text-sm text-foreground/80 select-none">
      <span
        className={`relative inline-flex h-5 w-5 items-center justify-center rounded border transition ${
          checked
            ? "bg-brand border-brand"
            : "bg-background border-input hover:border-foreground/40"
        }`}
      >
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={onChange}
        />
        {checked && (
          <svg
            className="h-3 w-3 text-white"
            viewBox="0 0 12 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M1 5L4.5 8.5L11 1.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      {label}
    </label>
  );
}

function RadioRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer text-sm text-foreground/80 select-none">
      <span
        className={`relative inline-flex h-5 w-5 items-center justify-center rounded-full border transition ${
          checked
            ? "border-brand"
            : "border-input hover:border-foreground/40"
        }`}
      >
        <input
          type="radio"
          className="sr-only"
          checked={checked}
          onChange={onChange}
        />
        {checked && <span className="h-2.5 w-2.5 rounded-full bg-brand" />}
      </span>
      {label}
    </label>
  );
}
