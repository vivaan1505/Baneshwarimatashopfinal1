-- Add brands if they don't exist
DO $$ 
BEGIN
  -- Clothing/Fashion Brands (Mainstream)
  INSERT INTO brands (name, slug, category, is_active)
  SELECT 'Old Navy', 'old-navy', 'clothing', true
  WHERE NOT EXISTS (SELECT 1 FROM brands WHERE slug = 'old-navy');

  INSERT INTO brands (name, slug, category, is_active)
  SELECT 'Forever 21', 'forever-21', 'clothing', true
  WHERE NOT EXISTS (SELECT 1 FROM brands WHERE slug = 'forever-21');

  -- Continue for each brand...
  -- Add more INSERT statements following the same pattern
END $$;