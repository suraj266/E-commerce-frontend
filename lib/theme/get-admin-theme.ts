import "server-only";
import {
  ADMIN_THEME_DEFAULTS,
  type AdminTheme,
} from "@/types/admin-theme.types";

const GRAPHQL_URL =
  process.env.NEXT_PUBLIC_GRAPHQL_URL || "http://localhost:7000/graphql";

// Named distinct from the client-side GetAdminTheme so codegen's operation-name
// uniqueness check passes. Both hit the same resolver.
const QUERY = /* GraphQL */ `
  query GetAdminThemeSSR {
    adminTheme {
      id
      primaryLight
      primaryDark
      accentLight
      accentDark
      sidebarLight
      sidebarDark
      destructiveLight
      destructiveDark
      radius
      fontFamily
      updatedAt
      updatedById
    }
  }
`;

interface GraphQLResponse {
  data?: { adminTheme: AdminTheme };
  errors?: Array<{ message: string }>;
}

/**
 * Server-only fetch for the admin theme. Used by the (admin) layout to
 * inject CSS variables before first paint, so the panel never flashes the
 * default theme on top of a customized one.
 *
 * Falls back to ADMIN_THEME_DEFAULTS if the backend is unreachable — the
 * admin shell will still render with the original look while the user
 * investigates the outage.
 */
export async function getAdminTheme(): Promise<AdminTheme> {
  try {
    const res = await fetch(GRAPHQL_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ query: QUERY }),
      cache: "no-store",
    });
    if (!res.ok) return ADMIN_THEME_DEFAULTS;
    const json = (await res.json()) as GraphQLResponse;
    return json.data?.adminTheme ?? ADMIN_THEME_DEFAULTS;
  } catch {
    return ADMIN_THEME_DEFAULTS;
  }
}
