
import { supabase } from '@/lib/supabase';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export type UserAddress = {
  id: string;
  user_id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  is_default: boolean;
};

export type UserPaymentMethod = {
  id: string;
  user_id: string;
  card_number: string;
  cardholder_name: string;
  expiry_date: string;
  is_default: boolean;
  card_type?: string;
};

export type UserNotificationPreferences = {
  order_updates: boolean;
  promotions: boolean;
  new_arrivals: boolean;
  account_activity: boolean;
  email_notifications: boolean;
  sms_notifications: boolean;
};

export const userService = {
  async getUserAddresses(userId: string): Promise<UserAddress[]> {
    const { data, error } = await supabase
      .from('user_addresses')
      .select('*')
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error fetching user addresses:', error);
      return [];
    }
    
    return data || [];
  },
  
  async addUserAddress(address: Omit<UserAddress, 'id'>): Promise<UserAddress | null> {
    // If this is set as default, update other addresses first
    if (address.is_default) {
      await supabase
        .from('user_addresses')
        .update({ is_default: false })
        .eq('user_id', address.user_id);
    }
    
    const { data, error } = await supabase
      .from('user_addresses')
      .insert(address)
      .select()
      .single();
    
    if (error) {
      console.error('Error adding user address:', error);
      return null;
    }
    
    return data;
  },
  
  async updateUserAddress(id: string, address: Partial<UserAddress>): Promise<void> {
    // If this is set as default, update other addresses first
    if (address.is_default) {
      await supabase
        .from('user_addresses')
        .update({ is_default: false })
        .eq('user_id', address.user_id);
    }
    
    const { error } = await supabase
      .from('user_addresses')
      .update(address)
      .eq('id', id);
    
    if (error) {
      console.error('Error updating user address:', error);
    }
  },
  
  async deleteUserAddress(id: string): Promise<void> {
    const { error } = await supabase
      .from('user_addresses')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting user address:', error);
    }
  },
  
  async getUserPaymentMethods(userId: string): Promise<UserPaymentMethod[]> {
    const { data, error } = await supabase
      .from('user_payment_methods')
      .select('*')
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error fetching user payment methods:', error);
      return [];
    }
    
    return data || [];
  },
  
  async addUserPaymentMethod(paymentMethod: Omit<UserPaymentMethod, 'id'>): Promise<UserPaymentMethod | null> {
    // If this is set as default, update other payment methods first
    if (paymentMethod.is_default) {
      await supabase
        .from('user_payment_methods')
        .update({ is_default: false })
        .eq('user_id', paymentMethod.user_id);
    }
    
    const { data, error } = await supabase
      .from('user_payment_methods')
      .insert(paymentMethod)
      .select()
      .single();
    
    if (error) {
      console.error('Error adding user payment method:', error);
      return null;
    }
    
    return data;
  },
  
  async updateUserPaymentMethod(id: string, paymentMethod: Partial<UserPaymentMethod>): Promise<void> {
    // If this is set as default, update other payment methods first
    if (paymentMethod.is_default) {
      await supabase
        .from('user_payment_methods')
        .update({ is_default: false })
        .eq('user_id', paymentMethod.user_id);
    }
    
    const { error } = await supabase
      .from('user_payment_methods')
      .update(paymentMethod)
      .eq('id', id);
    
    if (error) {
      console.error('Error updating user payment method:', error);
    }
  },
  
  async deleteUserPaymentMethod(id: string): Promise<void> {
    const { error } = await supabase
      .from('user_payment_methods')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting user payment method:', error);
    }
  },
  
  async getUserNotificationPreferences(userId: string): Promise<UserNotificationPreferences | null> {
    const { data, error } = await supabase
      .from('user_notification_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // Create default preferences if none exist
        return this.createDefaultNotificationPreferences(userId);
      }
      console.error('Error fetching user notification preferences:', error);
      return null;
    }
    
    return data;
  },
  
  async createDefaultNotificationPreferences(userId: string): Promise<UserNotificationPreferences | null> {
    const defaultPreferences = {
      user_id: userId,
      order_updates: true,
      promotions: true,
      new_arrivals: false,
      account_activity: true,
      email_notifications: true,
      sms_notifications: false
    };
    
    const { data, error } = await supabase
      .from('user_notification_preferences')
      .insert(defaultPreferences)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating default notification preferences:', error);
      return null;
    }
    
    return data;
  },
  
  async updateUserNotificationPreferences(
    userId: string, 
    preferences: Partial<UserNotificationPreferences>
  ): Promise<void> {
    const { error } = await supabase
      .from('user_notification_preferences')
      .update(preferences)
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error updating user notification preferences:', error);
    }
  },
  
  async updateUserProfile(
    userId: string, 
    profile: { first_name?: string; last_name?: string; phone?: string; avatar_url?: string }
  ): Promise<void> {
    const { error } = await supabase.auth.updateUser({
      data: {
        first_name: profile.first_name,
        last_name: profile.last_name,
        phone: profile.phone,
        avatar_url: profile.avatar_url
      }
    });
    
    if (error) {
      console.error('Error updating user profile:', error);
    }
  }
};

// React Query hooks for user data
export const useUserAddresses = (userId: string) => {
  return useQuery({
    queryKey: ['userAddresses', userId],
    queryFn: () => userService.getUserAddresses(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAddUserAddress = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (address: Omit<UserAddress, 'id'>) => userService.addUserAddress(address),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['userAddresses', variables.user_id] });
    }
  });
};

export const useUpdateUserAddress = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, address }: { id: string; address: Partial<UserAddress> }) => 
      userService.updateUserAddress(id, address),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['userAddresses', variables.address.user_id] });
    }
  });
};

export const useDeleteUserAddress = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, userId }: { id: string; userId: string }) => userService.deleteUserAddress(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['userAddresses', variables.userId] });
    }
  });
};

export const useUserPaymentMethods = (userId: string) => {
  return useQuery({
    queryKey: ['userPaymentMethods', userId],
    queryFn: () => userService.getUserPaymentMethods(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAddUserPaymentMethod = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (paymentMethod: Omit<UserPaymentMethod, 'id'>) => 
      userService.addUserPaymentMethod(paymentMethod),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['userPaymentMethods', variables.user_id] });
    }
  });
};

export const useUpdateUserPaymentMethod = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, paymentMethod }: { id: string; paymentMethod: Partial<UserPaymentMethod> }) => 
      userService.updateUserPaymentMethod(id, paymentMethod),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['userPaymentMethods', variables.paymentMethod.user_id] });
    }
  });
};

export const useDeleteUserPaymentMethod = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, userId }: { id: string; userId: string }) => userService.deleteUserPaymentMethod(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['userPaymentMethods', variables.userId] });
    }
  });
};

export const useUserNotificationPreferences = (userId: string) => {
  return useQuery({
    queryKey: ['userNotificationPreferences', userId],
    queryFn: () => userService.getUserNotificationPreferences(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUpdateUserNotificationPreferences = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, preferences }: { userId: string; preferences: Partial<UserNotificationPreferences> }) => 
      userService.updateUserNotificationPreferences(userId, preferences),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['userNotificationPreferences', variables.userId] });
    }
  });
};

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, profile }: { 
      userId: string; 
      profile: { first_name?: string; last_name?: string; phone?: string; avatar_url?: string } 
    }) => userService.updateUserProfile(userId, profile),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['user', variables.userId] });
    }
  });
};
