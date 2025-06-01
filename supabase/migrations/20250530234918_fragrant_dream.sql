-- Create storage bucket for coupon images
INSERT INTO storage.buckets (id, name, public)
VALUES ('coupon-images', 'coupon-images', true);

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