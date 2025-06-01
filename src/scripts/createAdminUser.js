import { supabase } from '../lib/supabase';

/**
 * Creates a new admin user via Edge Function
 * @param {string} email - Email for the new admin user
 * @param {string} password - Password for the new admin user
 * @param {object} metadata - User metadata (first_name, last_name, etc.)
 * @returns {Promise<{success: boolean, message: string, error?: any}>}
 */
export async function createAdminUser(email, password, metadata = {}) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-admin`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          email,
          password,
          metadata
        })
      }
    );

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create admin user');
    }

    return data;
  } catch (error) {
    console.error('Error creating admin user:', error);
    return { 
      success: false, 
      message: error.message || 'Failed to create admin user'
    };
  }
}