-- First check if the users table exists, create if not
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users') THEN
    CREATE TABLE users (
      id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
      email text NOT NULL,  -- Remove UNIQUE constraint initially
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
    
    -- Temporarily drop email uniqueness constraint if it exists
    IF EXISTS (
      SELECT 1 FROM pg_constraint 
      WHERE conname = 'users_email_key' 
      AND conrelid = 'users'::regclass
    ) THEN
      ALTER TABLE users DROP CONSTRAINT users_email_key;
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

-- Handle duplicate emails by making them unique
DO $$
DECLARE
  rec RECORD;
  counter INT;
BEGIN
  -- Find duplicates and update them
  FOR rec IN 
    SELECT id, email, ROW_NUMBER() OVER (PARTITION BY email ORDER BY created_at) as row_num
    FROM users
  LOOP
    IF rec.row_num > 1 THEN
      -- Make email unique by appending user ID
      UPDATE users
      SET email = email || '-' || id
      WHERE id = rec.id;
    END IF;
  END LOOP;
END $$;

-- Now add back the unique constraint on email
ALTER TABLE users ADD CONSTRAINT users_email_key UNIQUE (email);

-- Create updated_at trigger if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_users_updated_at'
  ) THEN
    CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;