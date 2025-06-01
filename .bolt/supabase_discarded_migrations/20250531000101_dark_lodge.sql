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
INSERT INTO storage.buckets (id, name, public)
SELECT 'brand-logos', 'brand-logos', true
WHERE NOT EXISTS (
  SELECT 1 FROM storage.buckets WHERE id = 'brand-logos'
);

-- Create storage bucket for coupon images if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
SELECT 'coupon-images', 'coupon-images', true
WHERE NOT EXISTS (
  SELECT 1 FROM storage.buckets WHERE id = 'coupon-images'
);

-- Add image_url column to coupons table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'coupons' AND column_name = 'image_url'
  ) THEN
    ALTER TABLE coupons ADD COLUMN image_url text;
  END IF;
END $$;

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