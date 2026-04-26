import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  cartItemId: string;
  id: string;
  name: string;
  price: number;
  image: string;
  deliveryType: string;
  deliveryCharge: number;
  durationHours: number;
  totalPrice: number;
  ownerId: string;
}

interface CartState {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'cartItemId'>) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addToCart: (item) => set((state) => {
        // Generate a unique ID for this cart entry
        const cartItemWithId = { ...item, cartItemId: Math.random().toString(36).substr(2, 9) };
        return { items: [...state.items, cartItemWithId] };
      }),
      removeFromCart: (cartItemId) => set((state) => ({
        items: state.items.filter((i) => i.cartItemId !== cartItemId),
      })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'anoku-cart',
    }
  )
);
