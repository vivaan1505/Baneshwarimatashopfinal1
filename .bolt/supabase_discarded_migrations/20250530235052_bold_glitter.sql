-- Create storage bucket for coupons if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'coupons'
  ) THEN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('coupons', 'coupons', true);
  END IF;
END $$;

-- Create storage policies for coupons bucket
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM storage.policies 
    WHERE name = 'Coupons images are publicly accessible'
  ) THEN
    CREATE POLICY "Coupons images are publicly accessible"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'coupons');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM storage.policies 
    WHERE name = 'Coupons images are uploadable by admins'
  ) THEN
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
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM storage.policies 
    WHERE name = 'Coupons images are deletable by admins'
  ) THEN
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
  END IF;
END $$;