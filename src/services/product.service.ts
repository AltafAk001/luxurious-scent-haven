
import { supabase } from '@/lib/supabase';

export type Product = {
  id: number;
  name: string;
  brand: string;
  price: number;
  discountPrice?: number;
  image: string;
  description?: string;
  rating?: number;
  reviews?: number;
  inStock: boolean;
  sizes?: string[];
  bestSeller?: boolean;
  featuredProduct?: boolean;
  category?: string;
  createdAt?: string;
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
      .eq('bestSeller', true);
    
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
      .eq('featuredProduct', true);
    
    if (error) {
      console.error('Error fetching featured products:', error);
      return [];
    }
    
    return data || [];
  }
};
