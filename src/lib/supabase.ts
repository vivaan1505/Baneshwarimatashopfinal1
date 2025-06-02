import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env file and ensure both VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.'
  );
}

// Create Supabase client
export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      detectSessionInUrl: true
    }
  }
);

// Test connection in development
if (import.meta.env.DEV) {
  supabase
    .from('products')
    .select('count')
    .limit(1)
    .then(() => console.log('✅ Supabase connection successful'))
    .catch(err => console.error('❌ Supabase connection error:', err.message));
}