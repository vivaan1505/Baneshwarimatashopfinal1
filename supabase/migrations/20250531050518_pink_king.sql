/*
  # Add foreign key constraint for recycling_requests user_id

  1. Changes
    - Add foreign key constraint from recycling_requests.user_id to auth.users.id
    - This enables proper joins between recycling_requests and auth.users tables
    - Required for Supabase's PostgREST to recognize the relationship

  2. Security
    - ON DELETE CASCADE ensures referential integrity
    - When a user is deleted, their recycling requests are automatically removed
*/

-- Drop existing foreign key if it exists (using DO block for safety)
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'recycling_requests'
    AND constraint_name = 'recycling_requests_user_id_fkey'
  ) THEN
    ALTER TABLE public.recycling_requests 
    DROP CONSTRAINT recycling_requests_user_id_fkey;
  END IF;
END $$;

-- Add new foreign key constraint referencing auth.users
ALTER TABLE public.recycling_requests
ADD CONSTRAINT recycling_requests_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES auth.users(id)
ON DELETE CASCADE;