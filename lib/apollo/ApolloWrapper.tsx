"use client";

/**
 * Apollo Client wrapper with automatic refresh-token flow.
 *
 * THREE LAYERS OF AUTH HANDLING:
 *  1. authLink — injects Bearer token from Zustand on every outgoing request
 *  2. errorLink — catches UNAUTHENTICATED / 401 errors, refreshes via the
 *     singleton refresh manager, and replays the original operation with the
 *     new token. If refresh itself fails, the user is bounced to login.
 *  3. Boot rehydration — on mount, if Zustand has a stale (expired or near-
 *     expired) access token, proactively refresh BEFORE any query runs so the
 *     first page render isn't followed by a UNAUTHENTICATED → retry round-trip.
 */

import { useEffect } from "react";
import { ApolloLink, HttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { ErrorLink } from "@apollo/client/link/error";
import { CombinedGraphQLErrors } from "@apollo/client/errors";
import { Observable } from "@apollo/client/utilities";
import {
  ApolloNextAppProvider,
  ApolloClient,
  InMemoryCache,
  SSRMultipartLink,
} from "@apollo/client-integration-nextjs";

import { useAuthStore } from "@/store/auth.store";
import {
  handleAuthFailure,
  isAuthDead,
  isTokenStale,
  refreshAccessToken,
} from "@/lib/auth/refresh-manager";

function isUnauthorizedError(error: unknown): boolean {
  if (!error) return false;
  if (CombinedGraphQLErrors.is(error)) {
    return error.errors.some((e) => {
      const code = e.extensions?.code;
      const originalStatus = (
        e.extensions?.originalError as { statusCode?: number } | undefined
      )?.statusCode;
      return code === "UNAUTHENTICATED" || originalStatus === 401;
    });
  }
  // Network errors (e.g., fetch threw on 401 with non-JSON body)
  const networkStatus = (error as { statusCode?: number }).statusCode;
  return networkStatus === 401;
}

function makeClient() {
  const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
    fetchOptions: { cache: "no-store" },
    credentials: "include",
  });

  // Inject Bearer token from Zustand on every request.
  const authLink = setContext((_, { headers }) => {
    const token = useAuthStore.getState().accessToken;
    return {
      headers: {
        ...headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    };
  });

  // Auto-refresh on 401 / UNAUTHENTICATED. Returns an Observable that:
  //   - Awaits the singleton refresh
  //   - On success: rewrites the operation's auth header and forwards again
  //   - On failure: emits the original error and bounces the user to login
  const errorLink = new ErrorLink(({ error, operation, forward }) => {
    if (!isUnauthorizedError(error)) return;

    // Auth has already been declared dead by an earlier failure / by
    // handleAuthFailure. Don't fire another /auth/refresh for every
    // in-flight operation — the redirect to /login is on its way.
    if (isAuthDead()) return;

    // Avoid infinite loops — only retry once per operation
    const ctx = operation.getContext() as { _isAuthRetry?: boolean };
    if (ctx._isAuthRetry) return;

    return new Observable((subscriber) => {
      let inner: { unsubscribe: () => void } | null = null;

      refreshAccessToken()
        .then((newToken) => {
          if (!newToken) {
            subscriber.error(error);
            handleAuthFailure();
            return;
          }

          operation.setContext((prev: Record<string, unknown>) => ({
            ...prev,
            _isAuthRetry: true,
            headers: {
              ...((prev.headers as Record<string, string>) ?? {}),
              Authorization: `Bearer ${newToken}`,
            },
          }));

          inner = forward(operation).subscribe({
            next: (v) => subscriber.next(v),
            error: (e) => subscriber.error(e),
            complete: () => subscriber.complete(),
          });
        })
        .catch((e) => subscriber.error(e));

      return () => {
        if (inner) inner.unsubscribe();
      };
    });
  });

  const link =
    typeof window === "undefined"
      ? ApolloLink.from([new SSRMultipartLink({ stripDefer: true }), httpLink])
      : ApolloLink.from([errorLink, authLink, httpLink]);

  return new ApolloClient({
    cache: new InMemoryCache(),
    link,
  });
}

/**
 * Proactively refreshes the access token on app boot if Zustand has a stale
 * one. Reads JWT exp claim locally — no server round-trip when token is fresh.
 *
 * If the refresh fails (refresh cookie expired or revoked), bounce to login
 * IMMEDIATELY rather than fire-and-forget. Otherwise the page mounts with
 * stale credentials, the first useQuery hits 401, errorLink kicks off
 * another refresh, more queries fire from other components, and the network
 * tab fills with `graphql 200 (UNAUTHENTICATED) → refresh 401` pairs before
 * the eventual handleAuthFailure redirect lands.
 */
function useBootRehydration() {
  useEffect(() => {
    const token = useAuthStore.getState().accessToken;
    const user = useAuthStore.getState().user;
    if (!user) return; // Logged-out, no need to refresh
    if (!isTokenStale(token)) return; // Token still has >60s of life

    refreshAccessToken().then((newToken) => {
      if (!newToken) handleAuthFailure();
    });
  }, []);
}

export function ApolloWrapper({ children }: { children: React.ReactNode }) {
  useBootRehydration();
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
}
