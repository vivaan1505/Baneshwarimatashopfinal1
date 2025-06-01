-- First, remove any existing foreign key constraints
ALTER TABLE coupons DROP CONSTRAINT IF EXISTS coupons_brand_id_fkey;
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_brand_id_fkey;

-- Delete existing brands
DELETE FROM brands;

-- Add brands with proper error handling
DO $$ 
BEGIN
  -- Clothing/Fashion Brands (Mainstream)
  INSERT INTO brands (name, slug, category, is_active)
  VALUES ('Old Navy', 'old-navy', 'clothing', true);
  
  INSERT INTO brands (name, slug, category, is_active)
  VALUES ('Forever 21', 'forever-21', 'clothing', true);

  -- Continue for each brand...
  -- Add more INSERT statements

  -- Re-add foreign key constraints
  ALTER TABLE coupons
    ADD CONSTRAINT coupons_brand_id_fkey
    FOREIGN KEY (brand_id)
    REFERENCES brands(id);

  ALTER TABLE products
    ADD CONSTRAINT products_brand_id_fkey
    FOREIGN KEY (brand_id)
    REFERENCES brands(id);
EXCEPTION WHEN OTHERS THEN
  -- Log error and rollback
  RAISE NOTICE 'Error occurred: %', SQLERRM;
  RAISE;
END $$;