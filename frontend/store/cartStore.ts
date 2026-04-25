import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface CartState {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addToCart: (item) => set((state) => {
        if (state.items.find((i) => i.id === item.id)) return state;
        return { items: [...state.items, item] };
      }),
      removeFromCart: (id) => set((state) => ({
        items: state.items.filter((i) => i.id !== id),
      })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'anoku-cart',
    }
  )
);
