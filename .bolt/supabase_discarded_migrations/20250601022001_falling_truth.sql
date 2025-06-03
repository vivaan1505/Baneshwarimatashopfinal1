-- First check if the users table exists, create if not
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users') THEN
    CREATE TABLE users (
      id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
      email text NOT NULL UNIQUE,
      password_hash text NOT NULL DEFAULT 'managed-by-auth', -- Add default value for password_hash
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
INSERT INTO public.users (id, email, password_hash)
SELECT id, email, 'managed-by-auth'
FROM auth.users
ON CONFLICT (id) DO UPDATE SET 
  email = EXCLUDED.email,
  updated_at = now();

-- Handle potential email conflicts by ensuring email uniqueness
-- This will update any duplicate emails to make them unique by appending the user ID
DO $$
DECLARE
  duplicate_record RECORD;
BEGIN
  FOR duplicate_record IN 
    SELECT id, email, COUNT(*) OVER (PARTITION BY email) as count
    FROM users
    WHERE email IN (
      SELECT email FROM users GROUP BY email HAVING COUNT(*) > 1
    )
    ORDER BY email, id
  LOOP
    IF duplicate_record.count > 1 THEN
      -- Skip the first occurrence of each email (keep it as is)
      CONTINUE WHEN duplicate_record.count = 1;
      
      -- For subsequent occurrences, make the email unique by appending user ID
      UPDATE users
      SET email = email || '-' || id
      WHERE id = duplicate_record.id;
    END IF;
  END LOOP;
END $$;