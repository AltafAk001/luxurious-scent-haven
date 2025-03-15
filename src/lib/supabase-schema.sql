
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
