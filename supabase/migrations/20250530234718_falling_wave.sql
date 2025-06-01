-- Create storage bucket for coupon brand images
INSERT INTO storage.buckets (id, name, public)
VALUES ('coupon-brand-images', 'coupon-brand-images', true);

-- Allow public access to coupon brand images
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'coupon-brand-images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'coupon-brand-images');

-- Allow authenticated users to update their own images
CREATE POLICY "Authenticated users can update their own images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'coupon-brand-images' AND owner = auth.uid());

-- Allow authenticated users to delete their own images
CREATE POLICY "Authenticated users can delete their own images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'coupon-brand-images' AND owner = auth.uid());