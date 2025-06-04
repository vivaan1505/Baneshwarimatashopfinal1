import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Missing Supabase environment variables. Please check your .env file and ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set correctly.'
  );
}

// Create Supabase client
export const supabase = createClient<Database>(
  supabaseUrl || 'https://jtdnxmabkjjuesipxqoe.supabase.co',
  supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0ZG54bWFia2pqdWVzaXB4cW9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3MTMzNzUsImV4cCI6MjA2NDI4OTM3NX0.30DfLZjVpRzYWFzDtUmAhQzK2entLv3gFNfJizuFsr8',
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