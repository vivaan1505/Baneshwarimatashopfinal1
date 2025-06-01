-- Create wishlists table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'wishlists') THEN
    CREATE TABLE wishlists (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
      product_id uuid REFERENCES products(id) ON DELETE CASCADE,
      created_at timestamptz DEFAULT now()
    );
  END IF;
END $$;

-- Add unique constraint only if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'wishlists_user_id_product_id_key'
  ) THEN
    ALTER TABLE wishlists
    ADD CONSTRAINT wishlists_user_id_product_id_key UNIQUE (user_id, product_id);
  END IF;
END $$;

-- Enable Row Level Security
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own wishlist" ON wishlists;
DROP POLICY IF EXISTS "Users can create wishlist items" ON wishlists;
DROP POLICY IF EXISTS "Users can delete their own wishlist items" ON wishlists;
DROP POLICY IF EXISTS "Users can manage their own wishlist" ON wishlists;

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

CREATE POLICY "Users can manage their own wishlist"
  ON wishlists
  FOR ALL
  TO public
  USING (auth.uid() = user_id);

-- Add indexes for better performance (only if they don't exist)
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