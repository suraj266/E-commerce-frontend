import "server-only";
import { serverGraphQL } from "@/lib/graphql/server-fetch";

/**
 * SEO / canonical-URL helpers for Server Components and metadata routes.
 *
 * `NEXT_PUBLIC_SITE_URL` is the public origin the storefront is served from.
 * It backs `metadataBase`, canonical links, Open Graph URLs, `robots.txt`
 * and `sitemap.xml`. No trailing slash.
 */

const RAW_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

/** Canonical origin with any trailing slash stripped, e.g. `https://shop.example.com`. */
export const SITE_URL = RAW_SITE_URL.replace(/\/+$/, "");

/** Fallback brand name used wherever the `platform_name` setting is unset. */
const DEFAULT_SITE_NAME = "Ecommerce";

// Named distinct from the client-side GetSiteSettings so codegen's
// operation-name uniqueness check passes. Both hit the same resolver.
const SITE_NAME_QUERY = /* GraphQL */ `
  query GetPlatformNameSSR($group: SettingGroup) {
    siteSettings(group: $group) {
      key
      value
    }
  }
`;

interface SiteSettingRow {
  key: string;
  value: string;
}

/**
 * Server-only read of the platform brand name from `SiteSetting.platform_name`
 * (GENERAL group). Falls back to "Ecommerce" when unset or unreachable, so
 * titles/metadata always render. Cached for 5 minutes — branding rarely changes.
 */
export async function getSiteName(): Promise<string> {
  const data = await serverGraphQL<{ siteSettings: SiteSettingRow[] }>(
    SITE_NAME_QUERY,
    { group: "GENERAL" },
    { revalidate: 300 },
  );
  const name = data?.siteSettings
    ?.find((s) => s.key === "platform_name")
    ?.value?.trim();
  return name || DEFAULT_SITE_NAME;
}

/**
 * Compose an absolute URL from a site-relative path. Pass-through for values
 * that are already absolute (`http(s)://…`).
 */
export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
