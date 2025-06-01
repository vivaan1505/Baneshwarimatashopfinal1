import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

interface UserMetadata {
  first_name?: string;
  last_name?: string;
}

interface AuthState {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, metadata?: UserMetadata) => Promise<void>;
  signOut: () => Promise<void>;
  checkAdmin: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAdmin: false,
  loading: true,
  
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    set({ user: data.user });
    await useAuthStore.getState().checkAdmin();
  },
  
  signUp: async (email: string, password: string, metadata?: UserMetadata) => {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    });
    
    if (authError) throw authError;

    // Create or update corresponding entry in public.users table
    if (authData.user) {
      const { error: userError } = await supabase
        .from('users')
        .upsert({
          id: authData.user.id,
          email: authData.user.email,
          first_name: metadata?.first_name,
          last_name: metadata?.last_name,
        }, {
          onConflict: 'id',
          ignoreDuplicates: false
        });

      if (userError) {
        // If user creation fails, sign out and throw error
        await supabase.auth.signOut();
        throw userError;
      }
    }
    
    set({ user: authData.user });
  },
  
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    set({ user: null, isAdmin: false });
  },
  
  checkAdmin: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      set({ isAdmin: false });
      return;
    }
    
    const { data: adminRole } = await supabase
      .from('admin_users')
      .select('role')
      .eq('user_id', user.id)
      .maybeSingle();
    
    set({ isAdmin: !!adminRole });
  },
}));

// Set up auth state listener
supabase.auth.onAuthStateChange((event, session) => {
  useAuthStore.setState({ user: session?.user ?? null, loading: false });
  if (session?.user) {
    useAuthStore.getState().checkAdmin();
  }
});