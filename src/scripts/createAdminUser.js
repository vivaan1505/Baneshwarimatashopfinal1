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
    
    // 1. Create the user account in auth.users
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

    // 2. Create corresponding entry in public.users table
    const { error: publicUserError } = await supabase
      .from('users')
      .insert([{
        id: authData.user.id,
        email: email,
        first_name: metadata.first_name,
        last_name: metadata.last_name
      }]);

    if (publicUserError) {
      console.error('Error creating public user:', publicUserError);
      throw publicUserError;
    }

    // 3. Add user to admin_users table
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
    
    // If we failed after creating the auth user, attempt to clean up
    if (error.message !== 'Failed to create user') {
      try {
        const { error: deleteError } = await supabase.auth.admin.deleteUser(
          authData.user.id
        );
        if (deleteError) console.error('Error cleaning up auth user:', deleteError);
      } catch (cleanupError) {
        console.error('Error during cleanup:', cleanupError);
      }
    }
    
    return { 
      success: false, 
      message: error.message || 'Failed to create admin user', 
      error 
    };
  }
}