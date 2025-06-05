/*
  # Fix Products Missing Category

  1. Changes
    - Updates products that are missing a category_id
    - Sets appropriate category_id based on product type
    - Ensures all products have a valid category reference
  
  This migration addresses the issue where some products are missing a category_id or
  have an invalid category reference, causing them to not appear in category-specific listings.
*/

-- First, create a function to get category ID by name
CREATE OR REPLACE FUNCTION get_category_id_by_name(category_name TEXT) 
RETURNS UUID AS $$
DECLARE
  category_id UUID;
BEGIN
  -- Try to find the category by name
  SELECT id INTO category_id FROM categories WHERE name ILIKE category_name LIMIT 1;
  
  -- If not found, try to find by slug
  IF category_id IS NULL THEN
    SELECT id INTO category_id FROM categories WHERE slug ILIKE category_name LIMIT 1;
  END IF;
  
  -- If still not found, try to find by parent_category
  IF category_id IS NULL THEN
    SELECT id INTO category_id FROM categories WHERE parent_category ILIKE category_name LIMIT 1;
  END IF;
  
  RETURN category_id;
END;
$$ LANGUAGE plpgsql;

-- Update products with missing category_id based on their type
DO $$
DECLARE
  footwear_id UUID;
  clothing_id UUID;
  jewelry_id UUID;
  beauty_id UUID;
  accessories_id UUID;
  bags_id UUID;
  default_id UUID;
BEGIN
  -- Get category IDs for each product type
  footwear_id := get_category_id_by_name('footwear');
  clothing_id := get_category_id_by_name('clothing');
  jewelry_id := get_category_id_by_name('jewelry');
  beauty_id := get_category_id_by_name('beauty');
  accessories_id := get_category_id_by_name('accessories');
  bags_id := get_category_id_by_name('bags');
  
  -- Get a default category ID if needed
  SELECT id INTO default_id FROM categories LIMIT 1;
  
  -- Update products with missing category_id based on their type
  UPDATE products
  SET category_id = 
    CASE 
      WHEN type = 'footwear' THEN footwear_id
      WHEN type = 'clothing' THEN clothing_id
      WHEN type = 'jewelry' THEN jewelry_id
      WHEN type = 'beauty' THEN beauty_id
      WHEN type = 'accessories' THEN accessories_id
      WHEN type = 'bags' THEN bags_id
      ELSE default_id
    END
  WHERE category_id IS NULL OR NOT EXISTS (
    SELECT 1 FROM categories WHERE categories.id = products.category_id
  );
  
  -- For products with tags containing 'bridal', set to bridal category if exists
  UPDATE products
  SET category_id = get_category_id_by_name('bridal')
  WHERE 
    tags @> ARRAY['bridal'] AND
    get_category_id_by_name('bridal') IS NOT NULL;
    
  -- For products with tags containing 'christmas', set to christmas category if exists
  UPDATE products
  SET category_id = get_category_id_by_name('christmas')
  WHERE 
    tags @> ARRAY['christmas'] AND
    get_category_id_by_name('christmas') IS NOT NULL;
END $$;

-- Drop the temporary function
DROP FUNCTION IF EXISTS get_category_id_by_name(TEXT);