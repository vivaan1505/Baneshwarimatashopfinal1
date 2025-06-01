/*
  # Add type column to products table

  1. Changes
    - Add `type` column to products table
    - Add check constraint to ensure valid product types
    
  2. Notes
    - The type column is nullable
    - Valid types are: clothing, accessories, shoes, bags
*/

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS type TEXT,
ADD CONSTRAINT products_type_check 
CHECK (type = ANY (ARRAY['clothing'::text, 'accessories'::text, 'shoes'::text, 'bags'::text]));