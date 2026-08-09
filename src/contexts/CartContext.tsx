import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export interface CartItem {
  id: string; // locally generated or DB uuid
  product_id: string;
  size?: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  addToCart: (productId: string, size: string | undefined, quantity?: number) => void;
  updateQuantity: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('hidden-ivory-cart');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Sync to local storage whenever items change
  useEffect(() => {
    localStorage.setItem('hidden-ivory-cart', JSON.stringify(items));
  }, [items]);

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  const addToCart = (productId: string, size: string | undefined, quantity = 1) => {
    setItems(prev => {
      // Check if exact item already exists
      const existing = prev.find(i => i.product_id === productId && i.size === size);
      if (existing) {
        return prev.map(i => i.id === existing.id ? { ...i, quantity: i.quantity + quantity } : i);
      }
      return [...prev, { id: crypto.randomUUID(), product_id: productId, size, quantity }];
    });
    openDrawer();
  };

  const updateQuantity = (id: string, delta: number) => {
    setItems(prev => prev.map(i => {
      if (i.id === id) {
        const newQ = Math.max(1, i.quantity + delta);
        return { ...i, quantity: newQ };
      }
      return i;
    }));
  };

  const removeFromCart = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const clearCart = () => setItems([]);

  return (
    <CartContext.Provider value={{ items, isDrawerOpen, openDrawer, closeDrawer, addToCart, updateQuantity, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
