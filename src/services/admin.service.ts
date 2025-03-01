
import { supabase } from '@/lib/supabase';
import { Product } from './product.service';

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
    const { count: totalUsers } = await supabase.auth.admin
      .listUsers({ page: 1, perPage: 1 })
      .then(response => ({ count: response.data.users.length }));
    
    // For orders and revenue, we'll use cart_items as a proxy
    // In a real app, you'd have an orders table
    const { data: cartItems } = await supabase
      .from('cart_items')
      .select(`
        quantity,
        product:products(price, discount_price)
      `);
    
    const totalOrders = cartItems ? new Set(cartItems.map(item => item.user_id)).size : 0;
    
    const revenue = cartItems ? cartItems.reduce((sum, item) => {
      const productObj = item.product as unknown as Product;
      const price = productObj?.discount_price || productObj?.price || 0;
      return sum + (price * item.quantity);
    }, 0) : 0;
    
    return {
      totalProducts: totalProducts || 0,
      totalUsers: totalUsers || 0,
      totalOrders,
      revenue
    };
  },
  
  async getUsers(page: number = 1, pageSize: number = 10): Promise<{ users: UserData[], total: number }> {
    const { data, count } = await supabase.auth.admin
      .listUsers({ page, perPage: pageSize });
    
    return {
      users: data?.users || [],
      total: count || 0
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
