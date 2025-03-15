
import { supabase } from '@/lib/supabase';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_image: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
}

export interface OrderStatusHistory {
  id: string;
  order_id: string;
  status: string;
  notes: string;
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  shipping_address_id: string;
  payment_method_id: string;
  order_status: OrderStatus;
  payment_status: PaymentStatus;
  tracking_number: string | null;
  estimated_delivery_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
  status_history?: OrderStatusHistory[];
}

export type OrderFilters = {
  status?: OrderStatus[];
  date_from?: string;
  date_to?: string;
  payment_status?: PaymentStatus[];
};

export type CreateOrderData = {
  total_amount: number;
  shipping_address_id: string;
  payment_method_id: string;
  notes?: string;
  items: Array<{
    product_id: string;
    product_name: string;
    product_image: string;
    quantity: number;
    unit_price: number;
    total_price: number;
  }>;
};

export const orderService = {
  async getOrders(page = 1, pageSize = 10, filters?: OrderFilters): Promise<{ data: Order[], count: number }> {
    let query = supabase
      .from('orders')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1);

    // Apply filters
    if (filters?.status && filters.status.length > 0) {
      query = query.in('order_status', filters.status);
    }
    
    if (filters?.payment_status && filters.payment_status.length > 0) {
      query = query.in('payment_status', filters.payment_status);
    }

    if (filters?.date_from) {
      query = query.gte('created_at', filters.date_from);
    }

    if (filters?.date_to) {
      query = query.lte('created_at', filters.date_to);
    }

    const { data, error, count } = await query;
    
    if (error) throw error;
    
    return { 
      data: data || [], 
      count: count || 0 
    };
  },
  
  async getOrderById(id: string): Promise<Order | null> {
    // Get order details
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();
    
    if (orderError) throw orderError;
    if (!order) return null;
    
    // Get order items
    const { data: items, error: itemsError } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', id);
    
    if (itemsError) throw itemsError;
    
    // Get order status history
    const { data: statusHistory, error: historyError } = await supabase
      .from('order_status_history')
      .select('*')
      .eq('order_id', id)
      .order('created_at', { ascending: false });
    
    if (historyError) throw historyError;
    
    return {
      ...order,
      items: items || [],
      status_history: statusHistory || []
    };
  },
  
  async createOrder(orderData: CreateOrderData): Promise<string> {
    // Start a transaction
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        total_amount: orderData.total_amount,
        shipping_address_id: orderData.shipping_address_id,
        payment_method_id: orderData.payment_method_id,
        notes: orderData.notes,
        order_status: 'pending',
        payment_status: 'pending'
      })
      .select()
      .single();
    
    if (orderError) throw orderError;
    
    // Insert order items
    const orderItems = orderData.items.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.product_name,
      product_image: item.product_image,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.total_price
    }));
    
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);
    
    if (itemsError) throw itemsError;
    
    return order.id;
  },
  
  async updateOrderStatus(orderId: string, status: OrderStatus, notes?: string): Promise<void> {
    const { error } = await supabase
      .from('orders')
      .update({ order_status: status })
      .eq('id', orderId);
    
    if (error) throw error;
  },
  
  async updatePaymentStatus(orderId: string, status: PaymentStatus): Promise<void> {
    const { error } = await supabase
      .from('orders')
      .update({ payment_status: status })
      .eq('id', orderId);
    
    if (error) throw error;
  },
  
  async updateTrackingInfo(orderId: string, trackingNumber: string, estimatedDeliveryDate?: string): Promise<void> {
    const updateData: any = { tracking_number: trackingNumber };
    
    if (estimatedDeliveryDate) {
      updateData.estimated_delivery_date = estimatedDeliveryDate;
    }
    
    const { error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', orderId);
    
    if (error) throw error;
  }
};

// Custom hooks for orders
export const useOrders = (page = 1, pageSize = 10, filters?: OrderFilters) => {
  return useQuery({
    queryKey: ['orders', page, pageSize, filters],
    queryFn: () => orderService.getOrders(page, pageSize, filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useOrder = (id: string | undefined) => {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => id ? orderService.getOrderById(id) : null,
    enabled: !!id,
    staleTime: 60 * 1000, // 1 minute
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (orderData: CreateOrderData) => orderService.createOrder(orderData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ orderId, status, notes }: { orderId: string, status: OrderStatus, notes?: string }) => 
      orderService.updateOrderStatus(orderId, status, notes),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['order', variables.orderId] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

export const useUpdatePaymentStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ orderId, status }: { orderId: string, status: PaymentStatus }) => 
      orderService.updatePaymentStatus(orderId, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['order', variables.orderId] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

export const useUpdateTrackingInfo = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ orderId, trackingNumber, estimatedDeliveryDate }: 
      { orderId: string, trackingNumber: string, estimatedDeliveryDate?: string }) => 
      orderService.updateTrackingInfo(orderId, trackingNumber, estimatedDeliveryDate),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['order', variables.orderId] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};
