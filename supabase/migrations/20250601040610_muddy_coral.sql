-- Add is_returnable column to products table
ALTER TABLE products
ADD COLUMN IF NOT EXISTS is_returnable BOOLEAN DEFAULT TRUE;

-- Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';