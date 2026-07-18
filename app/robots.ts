import type { MetadataRoute } from "next";
import { absoluteUrl, SITE_URL } from "@/lib/seo/site";

/**
 * robots.txt — allow crawling of the public storefront, disallow the
 * authenticated / transactional surfaces (account, cart, checkout) and the
 * admin / seller portals. Points crawlers at the generated sitemap.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/account/",
        "/cart",
        "/checkout",
        "/wishlist",
        "/admin/",
        "/seller/",
        "/login",
        "/register",
      ],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: SITE_URL,
  };
}
