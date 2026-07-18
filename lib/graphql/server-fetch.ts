import "server-only";

/**
 * Server-side GraphQL fetch helper for Server Components, `generateMetadata`,
 * `robots.ts` and `sitemap.ts`.
 *
 * Mirrors the resilient pattern in `lib/theme/get-admin-theme.ts` and
 * `lib/auth/session.ts`: a plain `fetch` POST that never throws — on any
 * transport error, non-2xx response, or malformed body it returns `null`
 * so callers can `notFound()` or fall back to a default instead of crashing
 * the render with a 500.
 *
 * Endpoint resolution (server → backend on the Docker network):
 *   1. `INTERNAL_API_URL`      — container-internal hostname (not browser-facing)
 *   2. `NEXT_PUBLIC_GRAPHQL_URL` — browser-facing fallback (dev / no-docker)
 *   3. `http://localhost:7000/graphql` — last-resort default
 *
 * The value is normalized to always point at the `/graphql` path, so it works
 * whether the env var is set to a base origin (`http://backend:7000`) or the
 * full endpoint (`http://backend:7000/graphql`).
 *
 * Caching uses the Next.js `fetch` data cache. By default responses are
 * revalidated every 60s; pass `revalidate: false` to opt out (always fresh)
 * or a different number of seconds. Optional `tags` enable on-demand
 * revalidation.
 */

function resolveGraphqlEndpoint(): string {
  const raw =
    process.env.INTERNAL_API_URL ||
    process.env.NEXT_PUBLIC_GRAPHQL_URL ||
    "http://localhost:7000/graphql";
  const trimmed = raw.replace(/\/+$/, "");
  return trimmed.endsWith("/graphql") ? trimmed : `${trimmed}/graphql`;
}

export interface ServerFetchOptions {
  /** Seconds until the cached response is revalidated. `false` = no cache. Default 60. */
  revalidate?: number | false;
  /** Cache tags for on-demand revalidation. */
  tags?: string[];
  /**
   * Abort timeout (ms) for uncached (`revalidate: false`) fetches, so an
   * unreachable backend fails fast to `null` instead of hanging the render
   * (e.g. build-time prerender when the API isn't up). Default 8000.
   * Cached fetches deliberately omit the signal so the Next data cache is kept.
   */
  timeoutMs?: number;
}

/**
 * Execute a GraphQL query on the server and return its `data` payload, or
 * `null` on any failure (transport, non-2xx, or a response with no `data`).
 *
 * GraphQL-level errors that still return partial `data` are tolerated (the
 * `data` is returned as-is), matching the client's `errorPolicy: "all"`.
 */
export async function serverGraphQL<TData>(
  query: string,
  variables: Record<string, unknown> = {},
  options: ServerFetchOptions = {},
): Promise<TData | null> {
  const { revalidate = 60, tags, timeoutMs = 8000 } = options;
  // During `next build` the backend usually isn't reachable, so attach an abort
  // timeout to EVERY fetch (a signal opts a request out of the Next data cache,
  // which is fine at build time — dynamic pages re-fetch at request time anyway).
  // At runtime we only attach it to uncached fetches, so the data cache is kept.
  const buildPhase = process.env.NEXT_PHASE === "phase-production-build";
  const attachTimeout = revalidate === false || buildPhase;
  try {
    const res = await fetch(resolveGraphqlEndpoint(), {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ query, variables }),
      // `revalidate: false` → always fresh (no data cache); otherwise use the
      // Next.js data cache with the given revalidation window. `cache` and
      // `next.revalidate` are mutually exclusive, so only one is ever set.
      ...(revalidate === false
        ? { cache: "no-store" as const }
        : { next: { revalidate, ...(tags ? { tags } : {}) } }),
      ...(attachTimeout ? { signal: AbortSignal.timeout(timeoutMs) } : {}),
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { data?: TData | null };
    return json?.data ?? null;
  } catch {
    return null;
  }
}
