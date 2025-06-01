-- First, drop any existing foreign key constraints
ALTER TABLE coupons DROP CONSTRAINT IF EXISTS coupons_brand_id_fkey;
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_brand_id_fkey;

-- Delete existing data from coupons and products tables since we're removing the foreign keys
DELETE FROM coupons;
DELETE FROM products;

-- Delete existing data from brands table
DELETE FROM brands;

-- Add logo_url column to brands table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'brands' AND column_name = 'logo_url'
  ) THEN
    ALTER TABLE brands ADD COLUMN logo_url text;
  END IF;
END $$;

-- Create storage bucket for brand logos if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'brand-logos'
  ) THEN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('brand-logos', 'brand-logos', true);
  END IF;
END $$;

-- Create storage bucket for coupon images if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'coupon-images'
  ) THEN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('coupon-images', 'coupon-images', true);
  END IF;
END $$;

-- Re-add foreign key constraints
ALTER TABLE coupons
  ADD CONSTRAINT coupons_brand_id_fkey
  FOREIGN KEY (brand_id)
  REFERENCES brands(id);

ALTER TABLE products
  ADD CONSTRAINT products_brand_id_fkey
  FOREIGN KEY (brand_id)
  REFERENCES brands(id);

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Brand logos are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Brand logos are uploadable by admins" ON storage.objects;
DROP POLICY IF EXISTS "Brand logos are deletable by admins" ON storage.objects;
DROP POLICY IF EXISTS "Coupon images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Coupon images are uploadable by admins" ON storage.objects;
DROP POLICY IF EXISTS "Coupon images are deletable by admins" ON storage.objects;

-- Create storage policies for brand logos
CREATE POLICY "Brand logos are publicly accessible"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'brand-logos');

CREATE POLICY "Brand logos are uploadable by admins"
ON storage.objects FOR INSERT
TO public
WITH CHECK (
  bucket_id = 'brand-logos' AND
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.user_id = auth.uid()
  )
);

CREATE POLICY "Brand logos are deletable by admins"
ON storage.objects FOR DELETE
TO public
USING (
  bucket_id = 'brand-logos' AND
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.user_id = auth.uid()
  )
);

-- Create storage policies for coupon images
CREATE POLICY "Coupon images are publicly accessible"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'coupon-images');

CREATE POLICY "Coupon images are uploadable by admins"
ON storage.objects FOR INSERT
TO public
WITH CHECK (
  bucket_id = 'coupon-images' AND
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.user_id = auth.uid()
  )
);

CREATE POLICY "Coupon images are deletable by admins"
ON storage.objects FOR DELETE
TO public
USING (
  bucket_id = 'coupon-images' AND
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.user_id = auth.uid()
  )
);