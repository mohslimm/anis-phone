import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  cartItemId: string; // Unique ID for the cart (product_id + variant_id)
  productId: string;
  variantId: string;
  name: string;
  variantLabel: string;
  price: number;
  originalPrice?: number;
  qty: number;
  image: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, qty: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isCartOpen: false,
      
      setCartOpen: (open) => set({ isCartOpen: open }),

      addItem: (newItem) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (i) => i.cartItemId === newItem.cartItemId
          );

          if (existingItemIndex > -1) {
            // Update quantity of existing item
            const updatedItems = [...state.items];
            updatedItems[existingItemIndex].qty += newItem.qty;
            return { items: updatedItems, isCartOpen: true };
          }
          
          // Add new item
          return { items: [...state.items, newItem], isCartOpen: true };
        });
      },

      removeItem: (cartItemId) => {
        set((state) => ({
          items: state.items.filter((i) => i.cartItemId !== cartItemId),
        }));
      },

      updateQuantity: (cartItemId, qty) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.cartItemId === cartItemId ? { ...i, qty: Math.max(1, qty) } : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      getCartTotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.qty, 0);
      },

      getCartCount: () => {
        return get().items.reduce((count, item) => count + item.qty, 0);
      },
    }),
    {
      name: "anis-phone-cart",
      // Optional: partialize to save only specific state to localStorage
      partialize: (state) => ({ items: state.items }),
    }
  )
);
