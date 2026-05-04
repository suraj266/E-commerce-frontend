import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartState {
    items: any[]; // Aage aapse hi types banwaunga
    addToCart: (item: any) => void;
    clearCart: () => void;
}

export const useCartStore = create<CartState>()(
    persist(
        (set) => ({
            items: [],
            addToCart: (item) => set((state) => ({ items: [...state.items, item] })),
            clearCart: () => set({ items: [] }),
        }),
        {
            name: 'ecommerce-cart', // Is nam se LocalStorage mein save hoga
        }
    )
);
