/*
  # Add Beauty Categories

  1. New Categories
    - Add beauty subcategories for skincare, makeup, fragrances, and hair care
  2. Update Products
    - Update existing beauty products with appropriate subcategories
*/

-- First, ensure we have the main beauty category
DO $$
DECLARE
  beauty_id UUID;
BEGIN
  -- Check if beauty category exists
  SELECT id INTO beauty_id FROM categories WHERE name = 'Beauty' OR slug = 'beauty' OR parent_category = 'beauty' LIMIT 1;
  
  -- If not, create it
  IF beauty_id IS NULL THEN
    INSERT INTO categories (name, slug, description, parent_category, is_active)
    VALUES ('Beauty', 'beauty', 'Premium beauty and skincare products', NULL, true);
  END IF;
END $$;

-- Create beauty subcategories if they don't exist
INSERT INTO categories (name, slug, description, parent_category, is_active)
VALUES 
  ('Skincare', 'skincare', 'Premium skincare products for all skin types', 'beauty', true)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, slug, description, parent_category, is_active)
VALUES 
  ('Makeup', 'makeup', 'Luxury makeup and cosmetics', 'beauty', true)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, slug, description, parent_category, is_active)
VALUES 
  ('Fragrances', 'fragrances', 'Designer perfumes and colognes', 'beauty', true)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, slug, description, parent_category, is_active)
VALUES 
  ('Hair Care', 'hair-care', 'Premium hair care products', 'beauty', true)
ON CONFLICT (slug) DO NOTHING;

-- Update existing beauty products with appropriate subcategories
-- For skincare products
UPDATE products
SET subcategory = 'skincare'
WHERE 
  type = 'beauty' AND 
  (
    name ILIKE '%skincare%' OR 
    name ILIKE '%moisturizer%' OR 
    name ILIKE '%serum%' OR 
    name ILIKE '%cleanser%' OR
    name ILIKE '%face%' OR
    name ILIKE '%cream%' OR
    description ILIKE '%skin%'
  ) AND
  subcategory IS NULL;

-- For makeup products
UPDATE products
SET subcategory = 'makeup'
WHERE 
  type = 'beauty' AND 
  (
    name ILIKE '%makeup%' OR 
    name ILIKE '%foundation%' OR 
    name ILIKE '%lipstick%' OR 
    name ILIKE '%mascara%' OR
    name ILIKE '%eyeshadow%' OR
    name ILIKE '%blush%'
  ) AND
  subcategory IS NULL;

-- For fragrance products
UPDATE products
SET subcategory = 'fragrances'
WHERE 
  type = 'beauty' AND 
  (
    name ILIKE '%fragrance%' OR 
    name ILIKE '%perfume%' OR 
    name ILIKE '%cologne%' OR 
    name ILIKE '%scent%'
  ) AND
  subcategory IS NULL;

-- For hair care products
UPDATE products
SET subcategory = 'hair-care'
WHERE 
  type = 'beauty' AND 
  (
    name ILIKE '%hair%' OR 
    name ILIKE '%shampoo%' OR 
    name ILIKE '%conditioner%'
  ) AND
  subcategory IS NULL;

-- Set any remaining beauty products without a subcategory to 'skincare' as default
UPDATE products
SET subcategory = 'skincare'
WHERE 
  type = 'beauty' AND 
  subcategory IS NULL;