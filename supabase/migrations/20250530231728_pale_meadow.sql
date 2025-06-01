/*
  # Add tags column to products table

  1. Changes
    - Add `tags` column to products table as text array
    - Notify PostgREST to reload schema cache

  2. Notes
    - Uses safe IF NOT EXISTS check to prevent errors if column already exists
    - Reloads schema cache to ensure Supabase recognizes the new column
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'tags'
  ) THEN
    ALTER TABLE products ADD COLUMN tags text[];
  END IF;
END $$;

-- Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';