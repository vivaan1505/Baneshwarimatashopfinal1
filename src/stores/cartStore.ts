import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  // Optionally support product options/variants (e.g. size, weight, etc.)
  optionValues?: string[]; // e.g. ["M"], ["250g"], or ["M", "Blue"]
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (productId: string, optionValues?: string[]) => void;
  updateQuantity: (productId: string, quantity: number, optionValues?: string[]) => void;
  clearCart: () => void;
  getTotal: () => number;
}

function isSameCartItem(a: CartItem, b: Omit<CartItem, 'id'>) {
  // Same product AND options (deep equality)
  if (a.productId !== b.productId) return false;
  if (!a.optionValues && !b.optionValues) return true;
  if ((a.optionValues && !b.optionValues) || (!a.optionValues && b.optionValues)) return false;
  if (!a.optionValues || !b.optionValues) return false;
  if (a.optionValues.length !== b.optionValues.length) return false;
  for (let i = 0; i < a.optionValues.length; i++) {
    if (a.optionValues[i] !== b.optionValues[i]) return false;
  }
  return true;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        set((state) => {
          const existingItem = state.items.find((i) => isSameCartItem(i, item));
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                isSameCartItem(i, item)
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }
          return {
            items: [...state.items, { ...item, id: crypto.randomUUID() }],
          };
        });
      },
      
      removeItem: (productId, optionValues) => {
        set((state) => ({
          items: state.items.filter((i) =>
            !(i.productId === productId && (
              (!optionValues && !i.optionValues) ||
              (optionValues && i.optionValues && optionValues.length === i.optionValues.length &&
                optionValues.every((val, idx) => val === i.optionValues?.[idx]))
            ))
          ),
        }));
      },
      
      updateQuantity: (productId, quantity, optionValues) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId &&
            (
              (!optionValues && !i.optionValues) ||
              (optionValues && i.optionValues && optionValues.length === i.optionValues.length &&
                optionValues.every((val, idx) => val === i.optionValues?.[idx]))
            )
              ? { ...i, quantity }
              : i
          ),
        }));
      },
      
      clearCart: () => {
        set({ items: [] });
      },
      
      getTotal: () => {
        const state = get();
        return state.items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);