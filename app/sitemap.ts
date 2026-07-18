import type { MetadataRoute } from "next";
import { print } from "graphql";

import { GET_PUBLIC_PRODUCTS } from "@/lib/graphql/products";
import { GET_CATEGORIES } from "@/lib/graphql/categories";
import type { GetPublicProductsData } from "@/types/product.types";
import type { GetCategoriesData } from "@/types/category.types";
import { serverGraphQL } from "@/lib/graphql/server-fetch";
import { absoluteUrl } from "@/lib/seo/site";

const PRODUCTS_QUERY = print(GET_PUBLIC_PRODUCTS);
const CATEGORIES_QUERY = print(GET_CATEGORIES);

/**
 * sitemap.xml — static storefront routes plus every active category and
 * public (ACTIVE) product. Regenerated at most once an hour. Any backend
 * hiccup degrades gracefully to just the static routes rather than failing
 * the whole sitemap.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: absoluteUrl("/shop"), lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: absoluteUrl("/search"), lastModified: now, changeFrequency: "weekly", priority: 0.3 },
  ];

  const [productsData, categoriesData] = await Promise.all([
    serverGraphQL<GetPublicProductsData>(
      PRODUCTS_QUERY,
      { limit: 5000 },
      { revalidate: 3600 },
    ),
    serverGraphQL<GetCategoriesData>(CATEGORIES_QUERY, {}, { revalidate: 3600 }),
  ]);

  const productRoutes: MetadataRoute.Sitemap = (
    productsData?.publicProducts ?? []
  ).map((p) => ({
    url: absoluteUrl(`/product/${p.slug}`),
    lastModified: p.createdAt ? new Date(p.createdAt) : now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = (
    categoriesData?.categories ?? []
  )
    .filter((c) => c.isActive)
    .map((c) => ({
      url: absoluteUrl(`/category/${c.slug}`),
      lastModified: c.updatedAt ? new Date(c.updatedAt) : now,
      changeFrequency: "weekly",
      priority: 0.6,
    }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
