
import { supabase } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';

export type Product = {
  id: number;
  name: string;
  brand: string;
  price: number;
  discount_price?: number;
  image: string;
  description?: string;
  rating?: number;
  reviews?: number;
  in_stock: boolean;
  sizes?: string[];
  best_seller?: boolean;
  featured_product?: boolean;
  category?: string;
  gender?: string;
  occasion?: string;
  created_at?: string;
};

export type ProductFilters = {
  category?: string[];
  brand?: string[];
  priceMin?: number;
  priceMax?: number;
  gender?: string[];
  occasion?: string[];
  isNewArrival?: boolean;
  isSpecialOffer?: boolean;
  isFreeDelivery?: boolean;
  isFragrance?: boolean;
  hasDiscount?: boolean;
  searchQuery?: string;
};

export const productService = {
  async getProducts(
    page = 1, 
    pageSize = 8, 
    filters?: ProductFilters
  ): Promise<{ data: Product[], count: number }> {
    let query = supabase
      .from('products')
      .select('*', { count: 'exact' });
    
    // Apply filters
    /*if (filters) {
      // Category filter
      if (filters.category && filters.category.length > 0) {
        query = query.in('category', filters.category);
      }
      
      // Brand filter
      if (filters.brand && filters.brand.length > 0) {
        query = query.in('brand', filters.brand);
      }
      
      // Price range filter
      if (filters.priceMin !== undefined) {
        query = query.gte('price', filters.priceMin);
      }
      if (filters.priceMax !== undefined) {
        query = query.lte('price', filters.priceMax);
      }
      
      // Gender filter
      if (filters.gender && filters.gender.length > 0) {
        query = query.in('gender', filters.gender);
      }
      
      // Occasion filter
      if (filters.occasion && filters.occasion.length > 0) {
        query = query.in('occasion', filters.occasion);
      }
      
      // Boolean filters
      if (filters.isNewArrival) {
        query = query.eq('is_new_arrival', true);
      }
      if (filters.isSpecialOffer) {
        query = query.eq('is_special_offer', true);
      }
      if (filters.isFreeDelivery) {
        query = query.eq('is_free_delivery', true);
      }
      if (filters.isFragrance) {
        query = query.eq('is_fragrance', true);
      }
      if (filters.hasDiscount) {
        query = query.not('discount_price', 'is', null);
      }
      
      // Search query
      if (filters.searchQuery) {
        query = query.or(
          `name.ilike.%${filters.searchQuery}%,brand.ilike.%${filters.searchQuery}%,description.ilike.%${filters.searchQuery}%`
        );
      }
    }
    */
    // Pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    
    query = query.range(from, to);
    
    const { data, error, count } = await query;
    
    if (error) {
      console.error('Error fetching products:', error);
      return { data: [], count: 0 };
    }
    
    return { data: data || [], count: count || 0 };
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
      .eq('best_seller', true)
      .limit(10);
    
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
      .eq('featured_product', true)
      .limit(10);
    
    if (error) {
      console.error('Error fetching featured products:', error);
      return [];
    }
    
    return data || [];
  },
  
  async getNewArrivals(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_new_arrival', true)
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (error) {
      console.error('Error fetching new arrivals:', error);
      return [];
    }
    
    return data || [];
  },
  
  async getDiscountedProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .not('discount_price', 'is', null)
      .order('discount_price', { ascending: true })
      .limit(10);
    
    if (error) {
      console.error('Error fetching discounted products:', error);
      return [];
    }
    
    return data || [];
  },
  
  async getRelatedProducts(productId: number, category?: string, brand?: string): Promise<Product[]> {
    let query = supabase
      .from('products')
      .select('*')
      .neq('id', productId)
      .limit(8);
    
    if (category) {
      query = query.eq('category', category);
    }
    
    if (brand) {
      query = query.eq('brand', brand);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching related products:', error);
      return [];
    }
    
    return data || [];
  }
};

// React Query hooks for better data fetching and caching
export const useProducts = (page = 1, pageSize = 8, filters?: ProductFilters) => {
  return useQuery({
    queryKey: ['products', page, pageSize, filters],
    queryFn: () => productService.getProducts(page, pageSize, filters),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useProduct = (id: number) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getProductById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useBestSellers = () => {
  return useQuery({
    queryKey: ['bestSellers'],
    queryFn: () => productService.getBestSellers(),
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};

export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: ['featuredProducts'],
    queryFn: () => productService.getFeaturedProducts(),
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};

export const useNewArrivals = () => {
  return useQuery({
    queryKey: ['newArrivals'],
    queryFn: () => productService.getNewArrivals(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useDiscountedProducts = () => {
  return useQuery({
    queryKey: ['discountedProducts'],
    queryFn: () => productService.getDiscountedProducts(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useRelatedProducts = (productId: number, category?: string, brand?: string) => {
  return useQuery({
    queryKey: ['relatedProducts', productId, category, brand],
    queryFn: () => productService.getRelatedProducts(productId, category, brand),
    enabled: !!productId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};
