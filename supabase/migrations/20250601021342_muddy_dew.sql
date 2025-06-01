/*
  # Sync Auth Users to Public Users Table

  1. New Tables
    - None (uses existing users table)
  
  2. Changes
    - Add trigger function to handle new auth users
    - Add trigger to automatically create public.users entries
    - Backfill existing auth users into public.users table
  
  3. Security
    - No RLS changes needed (uses existing policies)
*/

-- First check if the users table exists, create if not
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users') THEN
    CREATE TABLE users (
      id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
      email text NOT NULL UNIQUE,
      first_name text,
      last_name text,
      phone text,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );
  END IF;
END $$;

-- Create the trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (new.id, new.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger (drop first if exists to avoid errors)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Backfill existing auth users into public.users
INSERT INTO public.users (id, email)
SELECT id, email 
FROM auth.users
ON CONFLICT (id) DO NOTHING;