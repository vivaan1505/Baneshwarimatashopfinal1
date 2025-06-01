import { supabase } from '../lib/supabase';

/**
 * Creates a new admin user
 * @param {string} email - Email for the new admin user
 * @param {string} password - Password for the new admin user
 * @param {object} metadata - User metadata (first_name, last_name, etc.)
 * @returns {Promise<{success: boolean, message: string, error?: any}>}
 */
export async function createAdminUser(email, password, metadata = {}) {
  try {
    console.log(`Creating admin user with email: ${email}`);
    
    // 1. Create the user account
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    });

    if (authError) throw authError;
    
    if (!authData.user) {
      throw new Error('Failed to create user');
    }

    console.log(`User created with ID: ${authData.user.id}`);

    // 2. Add user to admin_users table
    const { error: adminError } = await supabase
      .from('admin_users')
      .insert([{
        user_id: authData.user.id,
        role: 'admin'
      }]);

    if (adminError) throw adminError;
    
    return { 
      success: true, 
      message: `Admin user ${email} created successfully. Please check your email to confirm your account.` 
    };
  } catch (error) {
    console.error('Error creating admin user:', error);
    return { 
      success: false, 
      message: error.message || 'Failed to create admin user', 
      error 
    };
  }
}