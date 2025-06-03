/*
  # Fix Users Table and Auth Triggers

  1. New Tables
    - Ensures `users` table exists with proper structure
  2. Security
    - Creates trigger to sync auth users to public users table
  3. Changes
    - Handles potential email duplicates by making them unique
*/

-- First check if the users table exists, create if not
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users') THEN
    CREATE TABLE users (
      id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
      email text NOT NULL UNIQUE,
      password_hash text NOT NULL DEFAULT 'managed-by-auth',
      first_name text,
      last_name text,
      phone text,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );
  ELSE
    -- If table exists but password_hash column is required, ensure it has a default
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'users' 
      AND column_name = 'password_hash' 
      AND is_nullable = 'NO'
    ) THEN
      -- Check if the column already has a default
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'password_hash' 
        AND column_default IS NOT NULL
      ) THEN
        -- Add default to existing column
        ALTER TABLE users ALTER COLUMN password_hash SET DEFAULT 'managed-by-auth';
      END IF;
    END IF;
  END IF;
END $$;

-- Create the trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, password_hash)
  VALUES (new.id, new.email, 'managed-by-auth')
  ON CONFLICT (id) DO UPDATE SET 
    email = EXCLUDED.email,
    updated_at = now();
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger (drop first if exists to avoid errors)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Backfill existing auth users into public.users with conflict handling
-- Use a more careful approach to avoid email conflicts
DO $$
DECLARE
  auth_user RECORD;
  email_exists BOOLEAN;
  unique_email TEXT;
  counter INTEGER;
BEGIN
  FOR auth_user IN (SELECT id, email FROM auth.users) LOOP
    -- Check if this user already exists in public.users
    IF NOT EXISTS (SELECT 1 FROM public.users WHERE id = auth_user.id) THEN
      -- Check if email already exists in public.users
      email_exists := EXISTS (SELECT 1 FROM public.users WHERE email = auth_user.email);
      
      IF email_exists THEN
        -- Create a unique email by appending a suffix
        counter := 1;
        unique_email := auth_user.email || '-' || counter;
        
        -- Keep incrementing counter until we find a unique email
        WHILE EXISTS (SELECT 1 FROM public.users WHERE email = unique_email) LOOP
          counter := counter + 1;
          unique_email := auth_user.email || '-' || counter;
        END LOOP;
        
        -- Insert with the unique email
        INSERT INTO public.users (id, email, password_hash)
        VALUES (auth_user.id, unique_email, 'managed-by-auth');
      ELSE
        -- Insert with original email
        INSERT INTO public.users (id, email, password_hash)
        VALUES (auth_user.id, auth_user.email, 'managed-by-auth');
      END IF;
    END IF;
  END LOOP;
END $$;