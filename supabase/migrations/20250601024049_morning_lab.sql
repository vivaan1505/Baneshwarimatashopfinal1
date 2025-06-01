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