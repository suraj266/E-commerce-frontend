"use client";

import { useQuery } from "@apollo/client/react";
import { GET_CATEGORIES } from "@/lib/graphql/categories";
import type { Category, GetCategoriesData } from "@/types/category.types";
import type { CategoryShowcaseProps } from "./category-showcase.schema";

export interface ResolvedCategoryTile {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
}

/**
 * Resolves the showcase's curated/auto list against the live category catalog.
 * Returns at most `props.maxItems` tiles in the same order as configured (or
 * by displayOrder when source = "auto"), skipping categories the admin
 * removed since the block was last saved.
 */
export function useResolvedCategories(props: CategoryShowcaseProps): {
  tiles: ResolvedCategoryTile[];
  loading: boolean;
} {
  const { data, loading } = useQuery<GetCategoriesData>(GET_CATEGORIES, {
    fetchPolicy: "cache-and-network",
  });

  const all = data?.categories ?? [];
  const byId = new Map<string, Category>();
  for (const c of all) byId.set(c.id, c);

  let tiles: ResolvedCategoryTile[] = [];

  if (props.source === "auto") {
    tiles = all
      .filter((c) => c.isActive && !c.parentId)
      .slice()
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .slice(0, props.maxItems)
      .map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        imageUrl: c.imageUrl ?? null,
      }));
  } else if (props.source === "children-of") {
    const parentId = props.parentCategoryId || null;
    tiles = parentId
      ? all
          .filter((c) => c.isActive && c.parentId === parentId)
          .slice()
          .sort((a, b) => a.displayOrder - b.displayOrder)
          .slice(0, props.maxItems)
          .map((c) => ({
            id: c.id,
            name: c.name,
            slug: c.slug,
            imageUrl: c.imageUrl ?? null,
          }))
      : [];
  } else {
    tiles = props.items
      .map((it) => {
        const cat = byId.get(it.categoryId);
        if (!cat || !cat.isActive) return null;
        return {
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          imageUrl: it.imageOverride || cat.imageUrl || null,
        };
      })
      .filter((t): t is ResolvedCategoryTile => t !== null)
      .slice(0, props.maxItems);
  }

  return { tiles, loading };
}
