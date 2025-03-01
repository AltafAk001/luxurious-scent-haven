
import { createClient } from '@supabase/supabase-js';

// These should be replaced with your Supabase project URL and anon key
// after connecting your Lovable project with Supabase
const supabaseUrl = 'https://tazlpgnfplfjfjdgaxhw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRhemxwZ25mcGxmamZqZGdheGh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA4MTQxNDUsImV4cCI6MjA1NjM5MDE0NX0.xvNv-7qhFv30zbx2uZ0fRAAFvQLfVxH_v1G8e7moHI0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
