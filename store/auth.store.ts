import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserSnippet } from '@/types/auth.types';

interface AuthState {
    accessToken: string | null;
    user: UserSnippet | null;
    setAuth: (accessToken: string, user: UserSnippet) => void;
    logout: () => void;
}

// accessToken is intentionally NOT persisted — keeping it in localStorage
// makes any XSS into a full account takeover. The httpOnly refreshToken
// cookie is the source of truth; on reload, ApolloWrapper's boot
// rehydration calls /auth/refresh and repopulates the token in memory.
// We persist `user` only so the header/avatar don't flash a logged-out
// state during that round-trip.
export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            accessToken: null,
            user: null,
            setAuth: (accessToken, user) => set({ accessToken, user }),
            logout: () => set({ accessToken: null, user: null }),
        }),
        {
            name: 'ecommerce-auth',
            version: 1,
            partialize: (state) => ({ user: state.user }),
            // Older builds persisted accessToken alongside user. Drop it on
            // first load after this change so existing sessions immediately
            // benefit from the in-memory-only token policy.
            migrate: (persistedState) => {
                const old = persistedState as { user?: UserSnippet | null } | null;
                return { user: old?.user ?? null };
            },
        }
    )
);
