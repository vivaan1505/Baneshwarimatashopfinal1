-- Add Bridal Boutique subcategories to the categories table
INSERT INTO categories (name, slug, description, parent_category, is_active)
VALUES
  -- Bridal Dresses
  ('Wedding Gowns', 'wedding-gowns', 'Elegant wedding gowns for the bride', 'bridal', true),
  ('Reception Dresses', 'reception-dresses', 'Stylish dresses for wedding receptions', 'bridal', true),
  ('Engagement Dresses', 'engagement-dresses', 'Beautiful dresses for engagement ceremonies', 'bridal', true),
  ('Mehndi / Haldi Dresses', 'mehndi-haldi-dresses', 'Traditional dresses for Mehndi and Haldi ceremonies', 'bridal', true),
  ('Sangeet Dresses', 'sangeet-dresses', 'Festive dresses for Sangeet celebrations', 'bridal', true),
  
  -- Bridal Jewelry
  ('Necklaces & Sets', 'bridal-necklaces-sets', 'Bridal necklaces and jewelry sets', 'bridal', true),
  ('Earrings', 'bridal-earrings', 'Bridal earrings and ear accessories', 'bridal', true),
  ('Bangles & Bracelets', 'bridal-bangles-bracelets', 'Bridal bangles and bracelets', 'bridal', true),
  ('Maang Tikka & Headpieces', 'maang-tikka-headpieces', 'Traditional and modern bridal headpieces', 'bridal', true),
  ('Nose Rings & Nath', 'nose-rings-nath', 'Bridal nose rings and nath', 'bridal', true),
  ('Waist Belts (Kamarbandh)', 'waist-belts-kamarbandh', 'Decorative waist belts for bridal wear', 'bridal', true),
  
  -- Bridal Footwear
  ('Heels & Sandals', 'bridal-heels-sandals', 'Elegant heels and sandals for brides', 'bridal', true),
  ('Mojaris & Juttis', 'mojaris-juttis', 'Traditional Indian footwear for brides', 'bridal', true),
  ('Bridal Flats', 'bridal-flats', 'Comfortable flats for brides', 'bridal', true),
  
  -- Bridal Accessories
  ('Veils & Dupattas', 'veils-dupattas', 'Bridal veils and dupattas', 'bridal', true),
  ('Clutches & Potlis', 'clutches-potlis', 'Elegant clutches and potlis for brides', 'bridal', true),
  ('Hair Accessories', 'bridal-hair-accessories', 'Decorative hair pins and combs for brides', 'bridal', true),
  ('Bridal Gloves', 'bridal-gloves', 'Elegant gloves for brides', 'bridal', true),
  
  -- Bridal Makeup Kits
  ('Foundation & Concealers', 'bridal-foundation-concealers', 'Foundation and concealers for bridal makeup', 'bridal', true),
  ('Lipsticks & Lip Gloss', 'bridal-lipsticks-lip-gloss', 'Lipsticks and lip glosses for bridal makeup', 'bridal', true),
  ('Eye Makeup', 'bridal-eye-makeup', 'Eye makeup products for brides', 'bridal', true),
  
  -- Bridal Hair Care
  ('Hair Oils & Serums', 'bridal-hair-oils-serums', 'Hair oils and serums for bridal hair care', 'bridal', true),
  ('Hair Extensions & Wigs', 'hair-extensions-wigs', 'Hair extensions and wigs for bridal hairstyles', 'bridal', true),
  
  -- Other Bridal Categories
  ('Bridal Mehndi & Henna Kits', 'bridal-mehndi-henna-kits', 'Mehndi and henna kits for bridal ceremonies', 'bridal', true),
  ('Bridal Lingerie & Undergarments', 'bridal-lingerie-undergarments', 'Lingerie and undergarments for brides', 'bridal', true),
  ('Bridal Gift Sets & Packaging', 'bridal-gift-sets-packaging', 'Gift sets and packaging for bridal occasions', 'bridal', true)
ON CONFLICT (slug) DO NOTHING;

-- Create index on parent_category column for better performance if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_categories_parent_category'
  ) THEN
    CREATE INDEX idx_categories_parent_category ON categories(parent_category);
  END IF;
END $$;

-- Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';