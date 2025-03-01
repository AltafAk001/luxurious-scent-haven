
import { supabase } from '@/lib/supabase';
import { Product } from './product.service';

export type CartItem = {
  id: number;
  productId: number;
  userId: string;
  quantity: number;
  product?: Product;
};

export type Cart = {
  items: CartItem[];
  total: number;
};

export const cartService = {
  async getCart(userId: string): Promise<Cart> {
    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        id,
        productId,
        userId,
        quantity,
        product:products(*)
      `)
      .eq('userId', userId);
    
    if (error) {
      console.error('Error fetching cart:', error);
      return { items: [], total: 0 };
    }
    
    const items = data || [];
    const total = items.reduce((sum, item) => {
      const price = item.product?.discountPrice || item.product?.price || 0;
      return sum + (price * item.quantity);
    }, 0);
    
    return { items, total };
  },
  
  async addToCart(userId: string, productId: number, quantity: number = 1): Promise<void> {
    // Check if item already exists in cart
    const { data: existingItems } = await supabase
      .from('cart_items')
      .select('*')
      .eq('userId', userId)
      .eq('productId', productId);
    
    if (existingItems && existingItems.length > 0) {
      // Update quantity if item exists
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity: existingItems[0].quantity + quantity })
        .eq('id', existingItems[0].id);
      
      if (error) console.error('Error updating cart item:', error);
    } else {
      // Insert new item if it doesn't exist
      const { error } = await supabase
        .from('cart_items')
        .insert({ userId, productId, quantity });
      
      if (error) console.error('Error adding item to cart:', error);
    }
  },
  
  async updateCartItem(itemId: number, quantity: number): Promise<void> {
    const { error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', itemId);
    
    if (error) console.error('Error updating cart item:', error);
  },
  
  async removeFromCart(itemId: number): Promise<void> {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId);
    
    if (error) console.error('Error removing item from cart:', error);
  },
  
  async clearCart(userId: string): Promise<void> {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('userId', userId);
    
    if (error) console.error('Error clearing cart:', error);
  }
};
