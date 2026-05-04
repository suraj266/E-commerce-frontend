import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserSnippet } from '@/types/auth.types';

interface AuthState {
    accessToken: string | null;
    user: UserSnippet | null;
    setAuth: (accessToken: string, user: UserSnippet) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            accessToken: null,
            user: null,
            setAuth: (accessToken, user) => set({ accessToken, user }),
            logout: () => set({ accessToken: null, user: null }),
        }),
        {
            name: 'ecommerce-auth', // name of the item in localStorage
        }
    )
);

