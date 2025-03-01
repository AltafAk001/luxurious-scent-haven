
import { createClient } from '@supabase/supabase-js';

// These should be replaced with your Supabase project URL and anon key
// after connecting your Lovable project with Supabase
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
