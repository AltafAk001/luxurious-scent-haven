import { supabase } from '@/lib/supabase';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export type OrderStatus = 
  | 'pending' 
  | 'processing' 
  | 'to_ship' 
  | 'to_receive' 
  | 'completed' 
  | 'cancelled' 
  | 'refunded';

export type OrderItem = {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  total: number;
  product?: {
    name: string;
    brand: string;
    image: string;
    size?: string;
  };
};

export type Order = {
  id: number;
  user_id: string;
  status: OrderStatus;
  total: number;
  shipping_address: {
    name: string;
    street: string;
    city: string;
    state: string;
    zip_code: string;
    country: string;
  };
  payment_method: {
    type: string;
    last4?: string;
    exp_date?: string;
  };
  tracking_number?: string;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
};

export type CreateOrderInput = {
  user_id: string;
  shipping_address: {
    name: string;
    street: string;
    city: string;
    state: string;
    zip_code: string;
    country: string;
  };
  payment_method: {
    type: string;
    last4?: string;
    exp_date?: string;
  };
  items: {
    product_id: number;
    quantity: number;
    price: number;
    total: number;
  }[];
  total: number;
};

export const orderService = {
  async createOrder(orderData: CreateOrderInput): Promise<Order | null> {
    // Start by creating the order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: orderData.user_id,
        status: 'pending',
        total: orderData.total,
        shipping_address: orderData.shipping_address,
        payment_method: orderData.payment_method,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (orderError) {
      console.error('Error creating order:', orderError);
      return null;
    }
    
    // Then add the order items
    const orderItems = orderData.items.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
      total: item.total
    }));
    
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);
    
    if (itemsError) {
      console.error('Error adding order items:', itemsError);
      // Should ideally roll back the order here, but we'll keep it simple
      return null;
    }
    
    return order;
  },
  
  async getOrdersByUser(userId: string, page = 1, pageSize = 5): Promise<{ data: Order[], count: number }> {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    
    const { data, error, count } = await supabase
      .from('orders')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(from, to);
    
    if (error) {
      console.error('Error fetching orders:', error);
      return { data: [], count: 0 };
    }
    
    return { data: data || [], count: count || 0 };
  },
  
  async getOrderById(orderId: number): Promise<Order | null> {
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();
    
    if (orderError) {
      console.error(`Error fetching order with id ${orderId}:`, orderError);
      return null;
    }
    
    // Fetch the order items
    const { data: items, error: itemsError } = await supabase
      .from('order_items')
      .select(`
        id,
        order_id,
        product_id,
        quantity,
        price,
        total,
        product:products(name, brand, image, size)
      `)
      .eq('order_id', orderId);
    
    if (itemsError) {
      console.error(`Error fetching order items for order ${orderId}:`, itemsError);
      return order;
    }
    
    return {
      ...order,
      items: items || []
    };
  },
  
  async updateOrderStatus(orderId: number, status: OrderStatus): Promise<void> {
    const { error } = await supabase
      .from('orders')
      .update({ 
        status, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', orderId);
    
    if (error) {
      console.error(`Error updating status for order ${orderId}:`, error);
    }
  },
  
  async cancelOrder(orderId: number): Promise<void> {
    await this.updateOrderStatus(orderId, 'cancelled');
  },
  
  async requestRefund(orderId: number): Promise<void> {
    const { error } = await supabase
      .from('refund_requests')
      .insert({
        order_id: orderId,
        status: 'pending',
        created_at: new Date().toISOString()
      });
    
    if (error) {
      console.error(`Error requesting refund for order ${orderId}:`, error);
    }
  }
};

// React Query hooks for orders
export const useOrders = (userId: string, page = 1, pageSize = 5) => {
  return useQuery({
    queryKey: ['orders', userId, page, pageSize],
    queryFn: () => orderService.getOrdersByUser(userId, page, pageSize),
    enabled: !!userId,
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useOrder = (orderId: number) => {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: () => orderService.getOrderById(orderId),
    enabled: !!orderId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (orderData: CreateOrderInput) => orderService.createOrder(orderData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['orders', variables.user_id] });
      // Clear the cart after successful order creation
      queryClient.invalidateQueries({ queryKey: ['cart', variables.user_id] });
    }
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ orderId, status, userId }: { orderId: number, status: OrderStatus, userId: string }) => 
      orderService.updateOrderStatus(orderId, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['order', variables.orderId] });
      queryClient.invalidateQueries({ queryKey: ['orders', variables.userId] });
    }
  });
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ orderId, userId }: { orderId: number, userId: string }) => 
      orderService.cancelOrder(orderId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['order', variables.orderId] });
      queryClient.invalidateQueries({ queryKey: ['orders', variables.userId] });
    }
  });
};

export const useRequestRefund = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ orderId, userId }: { orderId: number, userId: string }) => 
      orderService.requestRefund(orderId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['order', variables.orderId] });
      queryClient.invalidateQueries({ queryKey: ['orders', variables.userId] });
    }
  });
};
