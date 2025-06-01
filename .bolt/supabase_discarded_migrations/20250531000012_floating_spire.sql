-- Create storage bucket for coupons if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
SELECT 'coupons', 'coupons', true
WHERE NOT EXISTS (
  SELECT 1 FROM storage.buckets WHERE id = 'coupons'
);

-- Create storage policies for coupons bucket
CREATE POLICY "Coupons images are publicly accessible"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'coupons');

CREATE POLICY "Coupons images are uploadable by admins"
ON storage.objects FOR INSERT
TO public
WITH CHECK (
  bucket_id = 'coupons' AND
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.user_id = auth.uid()
  )
);

CREATE POLICY "Coupons images are deletable by admins"
ON storage.objects FOR DELETE
TO public
USING (
  bucket_id = 'coupons' AND
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.user_id = auth.uid()
  )
);