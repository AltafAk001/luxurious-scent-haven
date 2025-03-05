
import { supabase } from '@/lib/supabase';
import { Product } from './product.service';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export type CartItem = {
  id: number;
  product_id: number;
  user_id: string;
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
      const productObject = item.product as unknown as Product;
      const price = productObject?.discount_price || productObject?.price || 0;
      return sum + (price * item.quantity);
    }, 0);
    
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

// React Query hooks for cart operations
export const useCart = (userId: string) => {
  return useQuery({
    queryKey: ['cart', userId],
    queryFn: () => cartService.getCart(userId),
    enabled: !!userId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, productId, quantity }: { userId: string, productId: number, quantity?: number }) => 
      cartService.addToCart(userId, productId, quantity),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['cart', variables.userId] });
    }
  });
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ itemId, quantity, userId }: { itemId: number, quantity: number, userId: string }) => 
      cartService.updateCartItem(itemId, quantity),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['cart', variables.userId] });
    }
  });
};

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ itemId, userId }: { itemId: number, userId: string }) => 
      cartService.removeFromCart(itemId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['cart', variables.userId] });
    }
  });
};

export const useClearCart = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userId: string) => cartService.clearCart(userId),
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: ['cart', userId] });
    }
  });
};
