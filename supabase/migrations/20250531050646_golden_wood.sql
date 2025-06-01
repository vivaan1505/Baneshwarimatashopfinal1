/*
  # Add foreign key constraint for recycling requests

  1. Changes
    - Add foreign key constraint from recycling_requests.user_id to auth.users.id
    - This enables proper joins between recycling_requests and users in queries

  2. Technical Details
    - Adds constraint fk_recycling_user_id
    - References auth.users table (Supabase Auth)
    - Enables ON DELETE CASCADE to maintain referential integrity
*/

DO $$ 
BEGIN
  -- Add foreign key constraint if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_recycling_user_id'
  ) THEN
    ALTER TABLE recycling_requests
    ADD CONSTRAINT fk_recycling_user_id
    FOREIGN KEY (user_id) 
    REFERENCES auth.users(id)
    ON DELETE CASCADE;
  END IF;
END $$;