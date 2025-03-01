
import { supabase } from '@/lib/supabase';
import { Product } from './product.service';
import { User } from '@supabase/supabase-js';

export type DashboardStats = {
  totalProducts: number;
  totalUsers: number;
  totalOrders: number;
  revenue: number;
};

export type UserData = {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at?: string;
  user_metadata?: {
    full_name?: string;
  };
};

export const adminService = {
  async getDashboardStats(): Promise<DashboardStats> {
    // Get total products
    const { count: totalProducts } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });
    
    // Get total users
    const { data: usersData } = await supabase.auth.admin
      .listUsers();
    const totalUsers = usersData?.users?.length || 0;
    
    // For orders and revenue, we'll use cart_items as a proxy
    // In a real app, you'd have an orders table
    const { data: cartItems } = await supabase
      .from('cart_items')
      .select(`
        quantity,
        user_id,
        product:products(price, discount_price)
      `);
    
    // Count unique user_ids as orders
    const uniqueUserIds = cartItems ? new Set(cartItems.map(item => item.user_id)).size : 0;
    const totalOrders = uniqueUserIds;
    
    const revenue = cartItems ? cartItems.reduce((sum, item) => {
      // Handle the product field structure correctly
      const productObj = item.product as unknown as Product;
      const price = productObj?.discount_price || productObj?.price || 0;
      return sum + (price * item.quantity);
    }, 0) : 0;
    
    return {
      totalProducts: totalProducts || 0,
      totalUsers,
      totalOrders,
      revenue
    };
  },
  
  async getUsers(page: number = 1, pageSize: number = 10): Promise<{ users: UserData[], total: number }> {
    const { data } = await supabase.auth.admin
      .listUsers({ page, perPage: pageSize });
    
    const users = data?.users || [];
    const total = users.length; // Use this as a fallback since count isn't available
    
    // Convert User type to UserData type to ensure compatibility
    const userData: UserData[] = users.map(user => ({
      id: user.id,
      email: user.email || '', // Ensure email is never undefined
      created_at: user.created_at || '',
      last_sign_in_at: user.last_sign_in_at,
      user_metadata: user.user_metadata
    }));
    
    return {
      users: userData,
      total
    };
  },
  
  async getProducts(page: number = 1, pageSize: number = 10): Promise<{ products: Product[], total: number }> {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    
    const { data, count } = await supabase
      .from('products')
      .select('*', { count: 'exact' })
      .range(from, to);
    
    return {
      products: data || [],
      total: count || 0
    };
  },
  
  async updateProduct(id: number, product: Partial<Product>): Promise<void> {
    const { error } = await supabase
      .from('products')
      .update(product)
      .eq('id', id);
    
    if (error) throw error;
  },
  
  async deleteProduct(id: number): Promise<void> {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },
  
  async addProduct(product: Omit<Product, 'id'>): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};
