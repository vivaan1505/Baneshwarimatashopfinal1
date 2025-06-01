/*
  # Add foreign key constraint to order_items table

  1. Changes
    - Add foreign key constraint between order_items.product_variant_id and product_variants.id
    - This enables nested querying between order_items and product_variants tables

  2. Security
    - No RLS changes needed as this is a structural change
*/

DO $$ BEGIN
  -- Only add the constraint if it doesn't already exist
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.table_constraints 
    WHERE constraint_name = 'order_items_product_variant_id_fkey'
    AND table_name = 'order_items'
  ) THEN
    ALTER TABLE order_items
    ADD CONSTRAINT order_items_product_variant_id_fkey
    FOREIGN KEY (product_variant_id)
    REFERENCES product_variants (id)
    ON DELETE CASCADE;
  END IF;
END $$;