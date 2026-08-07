import "server-only";
import {
  ADMIN_THEME_DEFAULTS,
  type AdminTheme,
} from "@/types/admin-theme.types";

/**
 * Resolve the GraphQL endpoint for this SERVER-SIDE fetch (mirrors
 * `lib/graphql/server-fetch.ts`). Order matters: inside Docker the browser URL
 * (`NEXT_PUBLIC_GRAPHQL_URL=http://localhost:7000`) points at the frontend
 * container itself — `localhost` is NOT the backend — so a server fetch to it
 * is refused and we'd silently fall back to ADMIN_THEME_DEFAULTS (the panel
 * reverts to the brand-indigo default even though a custom theme is saved).
 * `INTERNAL_API_URL` (e.g. http://host.docker.internal:7000) is the reachable
 * container→backend path and must win. Normalized to always end in /graphql so
 * it works whether the env var is a base origin or the full endpoint.
 */
function resolveGraphqlEndpoint(): string {
  const raw =
    process.env.INTERNAL_API_URL ||
    process.env.NEXT_PUBLIC_GRAPHQL_URL ||
    "http://localhost:7000/graphql";
  const trimmed = raw.replace(/\/+$/, "");
  return trimmed.endsWith("/graphql") ? trimmed : `${trimmed}/graphql`;
}

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
    const res = await fetch(resolveGraphqlEndpoint(), {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ query: QUERY }),
      cache: "no-store",
      // Fail fast to the theme defaults if the backend is slow/unreachable —
      // without this an unreachable backend (e.g. during `next build`, when the
      // API isn't up) hangs each page's prerender until Next's 60s limit.
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return ADMIN_THEME_DEFAULTS;
    const json = (await res.json()) as GraphQLResponse;
    return json.data?.adminTheme ?? ADMIN_THEME_DEFAULTS;
  } catch {
    return ADMIN_THEME_DEFAULTS;
  }
}
