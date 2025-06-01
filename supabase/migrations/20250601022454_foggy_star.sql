-- Add foreign key constraint between wishlists and products
DO $$ 
BEGIN
  -- Check if the constraint already exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'wishlists_product_id_fkey'
  ) THEN
    -- Add the foreign key constraint
    ALTER TABLE wishlists
    ADD CONSTRAINT wishlists_product_id_fkey
    FOREIGN KEY (product_id)
    REFERENCES products(id)
    ON DELETE CASCADE;
  END IF;
END $$;

-- Create a trigger function to automatically remove items from wishlist when ordered
CREATE OR REPLACE FUNCTION remove_from_wishlist_after_order()
RETURNS TRIGGER AS $$
BEGIN
  -- When a new order item is created, remove the corresponding product from the user's wishlist
  DELETE FROM wishlists
  WHERE user_id = (
    SELECT user_id FROM orders WHERE id = NEW.order_id
  )
  AND product_id = (
    SELECT product_id FROM product_variants WHERE id = NEW.product_variant_id
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to execute the function after inserting a new order item
DROP TRIGGER IF EXISTS remove_from_wishlist_on_order ON order_items;
CREATE TRIGGER remove_from_wishlist_on_order
AFTER INSERT ON order_items
FOR EACH ROW
EXECUTE FUNCTION remove_from_wishlist_after_order();

-- Create indexes for better performance if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'wishlists_user_id_idx'
  ) THEN
    CREATE INDEX wishlists_user_id_idx ON wishlists(user_id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'wishlists_product_id_idx'
  ) THEN
    CREATE INDEX wishlists_product_id_idx ON wishlists(product_id);
  END IF;
END $$;