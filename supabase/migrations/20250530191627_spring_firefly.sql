/*
  # Add initial admin user

  1. Changes
    - Adds an initial admin user to the admin_users table
    - Sets the role as 'admin' for full administrative access

  2. Security
    - Only adds the user if they don't already exist in admin_users
    - Maintains RLS policies
*/

DO $$
BEGIN
  -- Get the first user from auth.users
  INSERT INTO admin_users (user_id, role)
  SELECT id, 'admin'
  FROM auth.users
  WHERE NOT EXISTS (
    SELECT 1 FROM admin_users WHERE user_id = auth.users.id
  )
  LIMIT 1;
END $$;