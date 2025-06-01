/*
  # Add wishlists table

  1. New Tables
    - `wishlists`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `product_id` (uuid, foreign key to products)
      - `created_at` (timestamp with time zone)

  2. Security
    - Enable RLS on `wishlists` table
    - Add policies for:
      - Users can view their own wishlist items
      - Users can create wishlist items
      - Users can delete their own wishlist items
*/

-- Create wishlists table
CREATE TABLE IF NOT EXISTS wishlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Add unique constraint to prevent duplicate wishlist items
ALTER TABLE wishlists
ADD CONSTRAINT wishlists_user_id_product_id_key UNIQUE (user_id, product_id);

-- Enable Row Level Security
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own wishlist"
  ON wishlists
  FOR SELECT
  TO public
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create wishlist items"
  ON wishlists
  FOR INSERT
  TO public
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own wishlist items"
  ON wishlists
  FOR DELETE
  TO public
  USING (auth.uid() = user_id);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS wishlists_user_id_idx ON wishlists(user_id);
CREATE INDEX IF NOT EXISTS wishlists_product_id_idx ON wishlists(product_id);