/*
  # Add foreign key relationship between wishlists and products

  1. Changes
    - Add foreign key constraint between wishlists.product_id and products.id
    - This enables proper joins between wishlists and products tables
    
  2. Security
    - Maintain existing RLS policies
    - CASCADE deletion to automatically remove wishlist entries when products are deleted
*/

-- Add foreign key constraint
ALTER TABLE wishlists
ADD CONSTRAINT wishlists_product_id_fkey 
FOREIGN KEY (product_id) 
REFERENCES products(id) 
ON DELETE CASCADE;