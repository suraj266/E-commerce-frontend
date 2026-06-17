"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { BlockEditorProps } from "../../types";
import type { FeaturedProductsProps } from "./featured-products.schema";

export function FeaturedProductsEditor({
  props,
  onChange,
  variant,
}: BlockEditorProps<FeaturedProductsProps>) {
  function patch(p: Partial<FeaturedProductsProps>) {
    onChange({ ...props, ...p });
  }
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="fp-title" className="text-xs">
          Title
        </Label>
        <Input
          id="fp-title"
          value={props.title}
          onChange={(e) => patch({ title: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="fp-subtitle" className="text-xs">
          Subtitle
        </Label>
        <Input
          id="fp-subtitle"
          value={props.subtitle}
          onChange={(e) => patch({ subtitle: e.target.value })}
          placeholder="Optional supporting line"
        />
      </div>

      <div>
        <Label className="text-xs">Source</Label>
        <Select
          value={props.source}
          onValueChange={(v) =>
            patch({ source: v as FeaturedProductsProps["source"] })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="category">By category</SelectItem>
            <SelectItem value="brand">By brand</SelectItem>
            <SelectItem value="tag">By tag</SelectItem>
            <SelectItem value="collection">By collection</SelectItem>
            <SelectItem value="manual">Manual list</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {props.source === "category" && (
        <div>
          <Label htmlFor="fp-category" className="text-xs">
            Category slug
          </Label>
          <Input
            id="fp-category"
            value={props.categorySlug}
            onChange={(e) => patch({ categorySlug: e.target.value })}
            placeholder="e.g. electronics"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Find slug in /admin/categories
          </p>
        </div>
      )}

      {props.source === "brand" && (
        <div>
          <Label htmlFor="fp-brand" className="text-xs">
            Brand slug
          </Label>
          <Input
            id="fp-brand"
            value={props.brandSlug}
            onChange={(e) => patch({ brandSlug: e.target.value })}
            placeholder="e.g. samsung"
          />
        </div>
      )}

      {props.source === "tag" && (
        <div>
          <Label htmlFor="fp-tag" className="text-xs">
            Tag slug
          </Label>
          <Input
            id="fp-tag"
            value={props.tagSlug}
            onChange={(e) => patch({ tagSlug: e.target.value })}
            placeholder="e.g. trending"
          />
        </div>
      )}

      {props.source === "collection" && (
        <div>
          <Label htmlFor="fp-collection" className="text-xs">
            Collection slug
          </Label>
          <Input
            id="fp-collection"
            value={props.collectionSlug}
            onChange={(e) => patch({ collectionSlug: e.target.value })}
            placeholder="e.g. new-arrivals"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Find slug in /admin/collections (manual or smart)
          </p>
        </div>
      )}

      {props.source === "manual" && (
        <div>
          <Label htmlFor="fp-slugs" className="text-xs">
            Product slugs (comma-separated)
          </Label>
          <textarea
            id="fp-slugs"
            value={props.productSlugs}
            onChange={(e) => patch({ productSlugs: e.target.value })}
            rows={3}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-ring"
            placeholder="samsung-galaxy-s24, mi-power-bank"
          />
        </div>
      )}

      {variant === "showcase-carousel" ? (
        <>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="fp-max" className="text-xs">
                Max items
              </Label>
              <Input
                id="fp-max"
                type="number"
                min={1}
                max={24}
                value={props.maxItems}
                onChange={(e) =>
                  patch({ maxItems: Number(e.target.value) || 8 })
                }
              />
            </div>
            <div>
              <Label className="text-xs">Auto badges</Label>
              <label className="flex items-center gap-2 mt-2 text-sm">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-input"
                  checked={props.showBadges}
                  onChange={(e) => patch({ showBadges: e.target.checked })}
                />
                Show Bestseller / New arrival pills
              </label>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Bestseller = featured + older than 30 days. New arrival = created
            in the last 30 days. Trending = featured otherwise.
          </p>
        </>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          <div>
            <Label htmlFor="fp-max" className="text-xs">
              Max items
            </Label>
            <Input
              id="fp-max"
              type="number"
              min={1}
              max={24}
              value={props.maxItems}
              onChange={(e) =>
                patch({ maxItems: Number(e.target.value) || 8 })
              }
            />
          </div>
          <div>
            <Label className="text-xs">Layout</Label>
            <Select
              value={props.layout}
              onValueChange={(v) =>
                patch({ layout: v as FeaturedProductsProps["layout"] })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="grid">Grid</SelectItem>
                <SelectItem value="carousel">Carousel</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="fp-cols" className="text-xs">
              Columns
            </Label>
            <Input
              id="fp-cols"
              type="number"
              min={2}
              max={6}
              value={props.columns}
              onChange={(e) => patch({ columns: Number(e.target.value) || 4 })}
            />
          </div>
        </div>
      )}
    </div>
  );
}
