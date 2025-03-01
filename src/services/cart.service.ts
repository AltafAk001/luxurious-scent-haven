
import { supabase } from '@/lib/supabase';
import { Product } from './product.service';

export type CartItem = {
  id: number;
  product_id: number; // Changed from productId to match database column name
  user_id: string;    // Changed from userId to match database column name
  quantity: number;
  product?: Product;  // This should be a single Product object, not an array
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
        product_id,
        user_id,
        quantity,
        product:products(*)
      `)
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error fetching cart:', error);
      return { items: [], total: 0 };
    }
    
    const items = data || [];
    const total = items.reduce((sum, item) => {
      // Access product as a single object, not an array
      const productObject = item.product as unknown as Product;
      const price = productObject?.discount_price || productObject?.price || 0;
      return sum + (price * item.quantity);
    }, 0);
    
    // Properly type the items with the product property correctly mapped
    const typedItems = items.map(item => ({
      ...item,
      product: item.product as unknown as Product
    })) as CartItem[];
    
    return { items: typedItems, total };
  },
  
  async addToCart(userId: string, productId: number, quantity: number = 1): Promise<void> {
    const { data: existingItems } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', userId)
      .eq('product_id', productId);
    
    if (existingItems && existingItems.length > 0) {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity: existingItems[0].quantity + quantity })
        .eq('id', existingItems[0].id);
      
      if (error) console.error('Error updating cart item:', error);
    } else {
      const { error } = await supabase
        .from('cart_items')
        .insert({ user_id: userId, product_id: productId, quantity });
      
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
      .eq('user_id', userId);
    
    if (error) console.error('Error clearing cart:', error);
  }
};
