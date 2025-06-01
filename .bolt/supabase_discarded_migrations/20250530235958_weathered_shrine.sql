-- Create storage bucket for product images if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
SELECT 'product-images', 'product-images', true
WHERE NOT EXISTS (
  SELECT 1 FROM storage.buckets WHERE id = 'product-images'
);

-- Enable RLS
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Product images are viewable by everyone" ON product_images;
DROP POLICY IF EXISTS "Product images are insertable by admins" ON product_images;
DROP POLICY IF EXISTS "Product images are updatable by admins" ON product_images;
DROP POLICY IF EXISTS "Product images are deletable by admins" ON product_images;

-- Create policies for product images
CREATE POLICY "Product images are viewable by everyone"
ON product_images FOR SELECT
TO public
USING (true);

CREATE POLICY "Product images are insertable by admins"
ON product_images FOR INSERT
TO public
WITH CHECK (
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.user_id = auth.uid()
  )
);

CREATE POLICY "Product images are updatable by admins"
ON product_images FOR UPDATE
TO public
USING (
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.user_id = auth.uid()
  )
);

CREATE POLICY "Product images are deletable by admins"
ON product_images FOR DELETE
TO public
USING (
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.user_id = auth.uid()
  )
);

-- Create storage policies
CREATE POLICY "Product images are publicly accessible"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'product-images');

CREATE POLICY "Product images are uploadable by admins"
ON storage.objects FOR INSERT
TO public
WITH CHECK (
  bucket_id = 'product-images' AND
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.user_id = auth.uid()
  )
);

CREATE POLICY "Product images are deletable by admins"
ON storage.objects FOR DELETE
TO public
USING (
  bucket_id = 'product-images' AND
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.user_id = auth.uid()
  )
);