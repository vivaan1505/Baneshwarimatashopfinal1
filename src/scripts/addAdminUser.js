import { supabase } from '../lib/supabase';

/**
 * Adds admin privileges to a user by their email
 * @param {string} email - The email of the user to grant admin privileges
 * @returns {Promise<{success: boolean, message: string, error?: any}>}
 */
export async function addAdminUser(email) {
  try {
    console.log(`Starting process to add admin privileges to ${email}...`);
    
    // First, find the user by email
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();
    
    if (userError) {
      if (userError.code === 'PGRST116') {
        return { success: false, message: `User with email ${email} not found` };
      }
      throw userError;
    }
    
    if (!userData) {
      return { success: false, message: `User with email ${email} not found` };
    }
    
    // Check if user is already an admin
    const { data: existingAdmin, error: checkError } = await supabase
      .from('admin_users')
      .select('id')
      .eq('user_id', userData.id)
      .maybeSingle();
    
    if (checkError) throw checkError;
    
    if (existingAdmin) {
      return { success: true, message: `User ${email} already has admin privileges` };
    }
    
    // Add user to admin_users table
    const { error: insertError } = await supabase
      .from('admin_users')
      .insert([{
        user_id: userData.id,
        role: 'admin'
      }]);
    
    if (insertError) throw insertError;
    
    return { success: true, message: `Admin privileges granted to ${email} successfully` };
  } catch (error) {
    console.error('Error adding admin user:', error);
    return { success: false, message: 'Failed to add admin user', error };
  }
}