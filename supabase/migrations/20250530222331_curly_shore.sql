/*
  # Add tags column to products table

  1. Changes
    - Add `tags` column to `products` table as a text array
    - Column is nullable to maintain compatibility with existing records
    - Default value is NULL

  2. Security
    - No changes to RLS policies needed as this column follows existing table permissions
*/

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS tags text[] DEFAULT NULL;

-- Ensure RLS is still enabled
ALTER TABLE products ENABLE ROW LEVEL SECURITY;