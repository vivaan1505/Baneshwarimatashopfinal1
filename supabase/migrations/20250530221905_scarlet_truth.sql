/*
  # Add care instructions column to products table

  1. Changes
    - Add `care_instructions` column to `products` table
    - Force schema cache refresh to ensure immediate availability
*/

-- Add the care_instructions column
ALTER TABLE products ADD COLUMN IF NOT EXISTS care_instructions TEXT;

-- Force schema cache refresh
ALTER TABLE products RENAME COLUMN care_instructions TO care_instructions_temp;
ALTER TABLE products RENAME COLUMN care_instructions_temp TO care_instructions;