import { supabase } from '@/lib/supabase';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';

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
    
    if (filters) {
      if (filters.category && filters.category.length > 0) {
        query = query.in('category', filters.category);
      }
      
      if (filters.brand && filters.brand.length > 0) {
        query = query.in('brand', filters.brand);
      }
      
      if (filters.priceMin !== undefined) {
        query = query.gte('price', filters.priceMin);
      }
      if (filters.priceMax !== undefined) {
        query = query.lte('price', filters.priceMax);
      }
      
      if (filters.gender && filters.gender.length > 0) {
        query = query.in('gender', filters.gender);
      }
      
      if (filters.occasion && filters.occasion.length > 0) {
        query = query.in('occasion', filters.occasion);
      }
      
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
      
      if (filters.searchQuery) {
        query = query.or(
          `name.ilike.%${filters.searchQuery}%,brand.ilike.%${filters.searchQuery}%,description.ilike.%${filters.searchQuery}%`
        );
      }
    }
    
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
  
  async getProductsInfinite(
    { pageParam = 1 },
    pageSize = 8, 
    filters?: ProductFilters
  ): Promise<{ data: Product[], count: number, nextPage: number | null }> {
    let query = supabase
      .from('products')
      .select('*', { count: 'exact' });
    
    if (filters) {
      if (filters.category && filters.category.length > 0) {
        query = query.in('category', filters.category);
      }
      
      if (filters.brand && filters.brand.length > 0) {
        query = query.in('brand', filters.brand);
      }
      
      if (filters.priceMin !== undefined) {
        query = query.gte('price', filters.priceMin);
      }
      if (filters.priceMax !== undefined) {
        query = query.lte('price', filters.priceMax);
      }
      
      if (filters.gender && filters.gender.length > 0) {
        query = query.in('gender', filters.gender);
      }
      
      if (filters.occasion && filters.occasion.length > 0) {
        query = query.in('occasion', filters.occasion);
      }
      
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
      
      if (filters.searchQuery) {
        query = query.or(
          `name.ilike.%${filters.searchQuery}%,brand.ilike.%${filters.searchQuery}%,description.ilike.%${filters.searchQuery}%`
        );
      }
    }
    
    const from = (pageParam - 1) * pageSize;
    const to = from + pageSize - 1;
    
    query = query.range(from, to);
    
    const { data, error, count } = await query;
    
    if (error) {
      console.error('Error fetching products:', error);
      return { 
        data: [], 
        count: 0, 
        nextPage: null 
      };
    }
    
    const hasNextPage = count ? from + pageSize < count : false;
    
    return { 
      data: data || [], 
      count: count || 0, 
      nextPage: hasNextPage ? pageParam + 1 : null 
    };
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
  },
  
  async getSearchSuggestions(query: string): Promise<{products: Product[], categories: string[], brands: string[]}> {
    if (!query || query.trim().length < 2) {
      return { products: [], categories: [], brands: [] };
    }
    
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .select('id, name, brand, image, price, discount_price, category, in_stock')
      .or(`name.ilike.%${query}%,brand.ilike.%${query}%,description.ilike.%${query}%`)
      .limit(5);
    
    if (productsError) {
      console.error('Error fetching product suggestions:', productsError);
    }
    
    const { data: categories, error: categoriesError } = await supabase
      .from('products')
      .select('category')
      .ilike('category', `%${query}%`)
      .limit(3);
    
    if (categoriesError) {
      console.error('Error fetching category suggestions:', categoriesError);
    }
    
    const { data: brands, error: brandsError } = await supabase
      .from('products')
      .select('brand')
      .ilike('brand', `%${query}%`)
      .limit(3);
    
    if (brandsError) {
      console.error('Error fetching brand suggestions:', brandsError);
    }
    
    const uniqueCategories = Array.from(new Set(categories?.map(item => item.category) || []));
    const uniqueBrands = Array.from(new Set(brands?.map(item => item.brand) || []));
    
    const products = productsData?.map(product => ({
      ...product,
      in_stock: product.in_stock !== undefined ? product.in_stock : true
    })) as Product[] || [];
    
    return {
      products,
      categories: uniqueCategories.filter(Boolean),
      brands: uniqueBrands.filter(Boolean)
    };
  }
};

export const useProductsInfinite = (pageSize = 8, filters?: ProductFilters) => {
  return useInfiniteQuery({
    queryKey: ['productsInfinite', pageSize, filters],
    queryFn: (context) => productService.getProductsInfinite(context, pageSize, filters),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useProducts = (page = 1, pageSize = 8, filters?: ProductFilters) => {
  return useQuery({
    queryKey: ['products', page, pageSize, filters],
    queryFn: () => productService.getProducts(page, pageSize, filters),
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

export const useSearchSuggestions = (query: string) => {
  return useQuery({
    queryKey: ['searchSuggestions', query],
    queryFn: () => productService.getSearchSuggestions(query),
    enabled: query.trim().length >= 2,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};
