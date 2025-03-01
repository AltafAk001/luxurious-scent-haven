
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { cartService, Cart, CartItem } from '@/services/cart.service';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';

type CartContextType = {
  cart: Cart;
  loading: boolean;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  updateCartItem: (itemId: number, quantity: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Generate a guest user ID if no user is logged in
  const userId = user?.id || localStorage.getItem('guestUserId') || `guest-${Date.now()}`;
  
  // Store guest user ID in localStorage
  useEffect(() => {
    if (!user && !localStorage.getItem('guestUserId')) {
      localStorage.setItem('guestUserId', userId);
    }
  }, [user, userId]);
  
  // Fetch cart when user changes
  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        const cartData = await cartService.getCart(userId);
        setCart(cartData);
      } catch (error) {
        console.error('Error fetching cart:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCart();
  }, [userId]);
  
  const addToCart = async (productId: number, quantity: number = 1) => {
    try {
      setLoading(true);
      await cartService.addToCart(userId, productId, quantity);
      const updatedCart = await cartService.getCart(userId);
      setCart(updatedCart);
      toast({
        title: "Item added to cart",
        description: "Your item has been added to your shopping bag",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error adding to cart",
        description: error.message || "Please try again",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const updateCartItem = async (itemId: number, quantity: number) => {
    try {
      setLoading(true);
      await cartService.updateCartItem(itemId, quantity);
      const updatedCart = await cartService.getCart(userId);
      setCart(updatedCart);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating cart",
        description: error.message || "Please try again",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const removeFromCart = async (itemId: number) => {
    try {
      setLoading(true);
      await cartService.removeFromCart(itemId);
      const updatedCart = await cartService.getCart(userId);
      setCart(updatedCart);
      toast({
        title: "Item removed",
        description: "Your item has been removed from your shopping bag",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error removing item",
        description: error.message || "Please try again",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const clearCart = async () => {
    try {
      setLoading(true);
      await cartService.clearCart(userId);
      setCart({ items: [], total: 0 });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error clearing cart",
        description: error.message || "Please try again",
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <CartContext.Provider value={{ cart, loading, addToCart, updateCartItem, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
