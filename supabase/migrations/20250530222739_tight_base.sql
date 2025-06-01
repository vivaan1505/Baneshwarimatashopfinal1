/*
  # Add tags column to products table

  1. Changes
    - Add `tags` column to products table as text array
    - Add `care_instructions` column for product care details
    - Add `materials` column for product material information
    - Add `size_guide` column for size and fit information
    - Add `shipping_info` column for shipping details
    - Add `return_policy` column for return policy details

  These additions will ensure all commonly needed product fields are available
  and prevent similar missing column errors in the future.
*/

-- Add new columns to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS tags text[],
ADD COLUMN IF NOT EXISTS care_instructions text,
ADD COLUMN IF NOT EXISTS materials text[],
ADD COLUMN IF NOT EXISTS size_guide jsonb,
ADD COLUMN IF NOT EXISTS shipping_info text,
ADD COLUMN IF NOT EXISTS return_policy text;