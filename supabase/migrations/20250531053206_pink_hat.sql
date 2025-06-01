-- Add brand_link column to coupons table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'coupons' AND column_name = 'brand_link'
  ) THEN
    ALTER TABLE coupons ADD COLUMN brand_link text;
  END IF;
END $$;

-- Update existing coupons to use brand website as brand_link if available
UPDATE coupons c
SET brand_link = b.website
FROM brands b
WHERE c.brand_id = b.id
  AND b.website IS NOT NULL
  AND c.brand_link IS NULL;

-- Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';