
import { supabase } from '@/lib/supabase';

export type Product = {
  id: number;
  name: string;
  brand: string;
  price: number;
  discount_price?: number; // Updated to match database column name
  image: string;
  description?: string;
  rating?: number;
  reviews?: number;
  in_stock: boolean; // Updated to match database column name
  sizes?: string[];
  best_seller?: boolean; // Updated to match database column name
  featured_product?: boolean; // Updated to match database column name
  category?: string;
  created_at?: string; // Updated to match database column name
};

export const productService = {
  async getProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*');
    
    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }
    
    return data || [];
  },
  
  async getProductById(id: number): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching product with id ${id}:`, error);
      return null;
    }
    
    return data;
  },
  
  async getBestSellers(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('best_seller', true);
    
    if (error) {
      console.error('Error fetching best sellers:', error);
      return [];
    }
    
    return data || [];
  },
  
  async getFeaturedProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('featured_product', true);
    
    if (error) {
      console.error('Error fetching featured products:', error);
      return [];
    }
    
    return data || [];
  }
};
