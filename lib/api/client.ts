/**
 * REST API client wrapper.
 *
 * AUTO-REFRESH:
 * If a request returns 401, we ask the singleton refresh manager for a new
 * access token, swap it into the Authorization header, and retry the request
 * exactly once. Endpoints in `SKIP_REFRESH_ENDPOINTS` opt out (login, refresh,
 * etc.) to avoid recursion.
 */

import { handleAuthFailure, refreshAccessToken } from "@/lib/auth/refresh-manager";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

/** Endpoints that must NOT trigger an auto-refresh on 401. */
const SKIP_REFRESH_ENDPOINTS = [
    "/auth/login",
    "/auth/refresh",
    "/auth/seller/register",
    "/auth/verify-email",
    "/auth/resend-verification",
    "/auth/session",
];

interface InternalOptions extends RequestInit {
    /** Internal flag — set on the second attempt to prevent infinite loops. */
    _isRetry?: boolean;
}

export async function apiClient<T>(
    endpoint: string,
    options: InternalOptions = {}
): Promise<T> {
    const { _isRetry, ...rest } = options;
    const url = `${BASE_URL}${endpoint}`;

    const headers = new Headers(rest.headers || {});
    if (!headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
    }

    const response = await fetch(url, {
        ...rest,
        headers,
        credentials: 'include',
    });

    // ---------------------------------------------------------------------
    // Auto-refresh path — fires only on first attempt for refreshable endpoints
    // ---------------------------------------------------------------------
    if (
        response.status === 401 &&
        !_isRetry &&
        !SKIP_REFRESH_ENDPOINTS.some((skip) => endpoint.startsWith(skip))
    ) {
        const newToken = await refreshAccessToken();
        if (newToken) {
            // Replace any existing Bearer header with the fresh token, then retry
            const retryHeaders = new Headers(rest.headers || {});
            retryHeaders.set('Authorization', `Bearer ${newToken}`);
            if (!retryHeaders.has('Content-Type')) {
                retryHeaders.set('Content-Type', 'application/json');
            }
            return apiClient<T>(endpoint, {
                ...rest,
                headers: retryHeaders,
                _isRetry: true,
            });
        }
        // Refresh itself failed — log the user out and bounce them
        handleAuthFailure();
    }

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Something went wrong with the API call.');
    }

    if (data.success !== undefined && data.data !== undefined) {
        return data.data as T;
    }

    return data as T;
}
