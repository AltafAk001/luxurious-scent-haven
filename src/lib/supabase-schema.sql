
-- User Addresses Table
CREATE TABLE IF NOT EXISTS user_addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  street TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  country TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_addresses_user_id ON user_addresses(user_id);

-- Add Row Level Security (RLS) policies
ALTER TABLE user_addresses ENABLE ROW LEVEL SECURITY;

-- Allow users to view only their own addresses
CREATE POLICY "Users can view their own addresses" 
  ON user_addresses 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Allow users to insert their own addresses
CREATE POLICY "Users can insert their own addresses" 
  ON user_addresses 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own addresses
CREATE POLICY "Users can update their own addresses" 
  ON user_addresses 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Allow users to delete their own addresses
CREATE POLICY "Users can delete their own addresses" 
  ON user_addresses 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- User Payment Methods Table
CREATE TABLE IF NOT EXISTS user_payment_methods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  card_number TEXT NOT NULL,
  cardholder_name TEXT NOT NULL,
  expiry_date TEXT NOT NULL,
  card_type TEXT,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_payment_methods_user_id ON user_payment_methods(user_id);

-- Add Row Level Security (RLS) policies
ALTER TABLE user_payment_methods ENABLE ROW LEVEL SECURITY;

-- Allow users to view only their own payment methods
CREATE POLICY "Users can view their own payment methods" 
  ON user_payment_methods 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Allow users to insert their own payment methods
CREATE POLICY "Users can insert their own payment methods" 
  ON user_payment_methods 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own payment methods
CREATE POLICY "Users can update their own payment methods" 
  ON user_payment_methods 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Allow users to delete their own payment methods
CREATE POLICY "Users can delete their own payment methods" 
  ON user_payment_methods 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- User Notification Preferences Table
CREATE TABLE IF NOT EXISTS user_notification_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  order_updates BOOLEAN DEFAULT true,
  promotions BOOLEAN DEFAULT true,
  new_arrivals BOOLEAN DEFAULT false,
  account_activity BOOLEAN DEFAULT true,
  email_notifications BOOLEAN DEFAULT true,
  sms_notifications BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_notification_preferences_user_id ON user_notification_preferences(user_id);

-- Add Row Level Security (RLS) policies
ALTER TABLE user_notification_preferences ENABLE ROW LEVEL SECURITY;

-- Allow users to view only their own notification preferences
CREATE POLICY "Users can view their own notification preferences" 
  ON user_notification_preferences 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Allow users to insert their own notification preferences
CREATE POLICY "Users can insert their own notification preferences" 
  ON user_notification_preferences 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own notification preferences
CREATE POLICY "Users can update their own notification preferences" 
  ON user_notification_preferences 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Allow users to delete their own notification preferences
CREATE POLICY "Users can delete their own notification preferences" 
  ON user_notification_preferences 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total_amount DECIMAL(10, 2) NOT NULL,
  shipping_address_id UUID REFERENCES user_addresses(id),
  payment_method_id UUID REFERENCES user_payment_methods(id),
  order_status TEXT NOT NULL DEFAULT 'pending',
  payment_status TEXT NOT NULL DEFAULT 'pending',
  tracking_number TEXT,
  estimated_delivery_date TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);

-- Add Row Level Security (RLS) policies
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Allow users to view only their own orders
CREATE POLICY "Users can view their own orders" 
  ON orders 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Allow users to insert their own orders
CREATE POLICY "Users can insert their own orders" 
  ON orders 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own orders
CREATE POLICY "Users can update their own orders" 
  ON orders 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  product_image TEXT,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on order_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- Add Row Level Security (RLS) policies
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Allow users to view only their own order items
CREATE POLICY "Users can view their own order items" 
  ON order_items 
  USING (EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
  ));

-- Allow users to insert their own order items
CREATE POLICY "Users can insert their own order items" 
  ON order_items 
  WITH CHECK (EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
  ));

-- Order Status History Table
CREATE TABLE IF NOT EXISTS order_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on order_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_order_status_history_order_id ON order_status_history(order_id);

-- Add Row Level Security (RLS) policies
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;

-- Allow users to view only their own order status history
CREATE POLICY "Users can view their own order status history" 
  ON order_status_history 
  USING (EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_status_history.order_id AND orders.user_id = auth.uid()
  ));

-- Add trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply the trigger to all tables
CREATE TRIGGER set_updated_at_user_addresses
BEFORE UPDATE ON user_addresses
FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at_user_payment_methods
BEFORE UPDATE ON user_payment_methods
FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at_user_notification_preferences
BEFORE UPDATE ON user_notification_preferences
FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at_orders
BEFORE UPDATE ON orders
FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- Create a function to add an entry to order_status_history when order status changes
CREATE OR REPLACE FUNCTION log_order_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.order_status IS NULL OR NEW.order_status <> OLD.order_status THEN
    INSERT INTO order_status_history (order_id, status, notes)
    VALUES (NEW.id, NEW.order_status, 'Status changed from ' || COALESCE(OLD.order_status, 'null') || ' to ' || NEW.order_status);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply the trigger to orders table
CREATE TRIGGER log_order_status_change
AFTER UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION log_order_status_change();

-- Create a trigger to add initial status when order is created
CREATE OR REPLACE FUNCTION log_initial_order_status()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO order_status_history (order_id, status, notes)
  VALUES (NEW.id, NEW.order_status, 'Order created with status: ' || NEW.order_status);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply the trigger to orders table
CREATE TRIGGER log_initial_order_status
AFTER INSERT ON orders
FOR EACH ROW
EXECUTE FUNCTION log_initial_order_status();
