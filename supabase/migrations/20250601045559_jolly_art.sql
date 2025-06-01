-- Add Beauty subcategories to the categories table
INSERT INTO categories (name, slug, description, parent_category, is_active)
VALUES
  -- Women's Beauty Subcategories
  ('Women''s Skincare', 'womens-skincare', 'Skincare products for women', 'beauty', true),
  ('Women''s Moisturizers', 'womens-moisturizers', 'Moisturizers for women', 'beauty', true),
  ('Women''s Serums & Oils', 'womens-serums-oils', 'Serums and facial oils for women', 'beauty', true),
  ('Women''s Face Masks', 'womens-face-masks', 'Face masks for women', 'beauty', true),
  ('Women''s Cleansers & Toners', 'womens-cleansers-toners', 'Cleansers and toners for women', 'beauty', true),
  ('Women''s Sunscreen & SPF', 'womens-sunscreen', 'Sunscreen and SPF products for women', 'beauty', true),
  
  ('Women''s Makeup', 'womens-makeup', 'Makeup products for women', 'beauty', true),
  ('Women''s Foundation & Concealer', 'womens-foundation-concealer', 'Foundation and concealer for women', 'beauty', true),
  ('Women''s Lipsticks & Lip Gloss', 'womens-lipstick-gloss', 'Lipsticks and lip glosses for women', 'beauty', true),
  ('Women''s Eyeshadow & Eyeliner', 'womens-eyeshadow-eyeliner', 'Eyeshadow and eyeliner for women', 'beauty', true),
  ('Women''s Mascara', 'womens-mascara', 'Mascara for women', 'beauty', true),
  ('Women''s Blush & Highlighter', 'womens-blush-highlighter', 'Blush and highlighter for women', 'beauty', true),
  
  ('Women''s Hair Care', 'womens-hair-care', 'Hair care products for women', 'beauty', true),
  ('Women''s Shampoos & Conditioners', 'womens-shampoo-conditioner', 'Shampoos and conditioners for women', 'beauty', true),
  ('Women''s Hair Oils & Serums', 'womens-hair-oils-serums', 'Hair oils and serums for women', 'beauty', true),
  ('Women''s Hair Masks & Treatments', 'womens-hair-masks-treatments', 'Hair masks and treatments for women', 'beauty', true),
  ('Women''s Styling Products', 'womens-styling-products', 'Hair styling products for women', 'beauty', true),
  
  ('Women''s Fragrances', 'womens-fragrances', 'Fragrances for women', 'beauty', true),
  ('Women''s Perfumes', 'womens-perfumes', 'Perfumes for women', 'beauty', true),
  ('Women''s Body Mists', 'womens-body-mists', 'Body mists for women', 'beauty', true),
  
  ('Women''s Bath & Body', 'womens-bath-body', 'Bath and body products for women', 'beauty', true),
  ('Women''s Body Lotions & Creams', 'womens-body-lotions-creams', 'Body lotions and creams for women', 'beauty', true),
  ('Women''s Body Wash & Scrubs', 'womens-body-wash-scrubs', 'Body wash and scrubs for women', 'beauty', true),
  ('Women''s Hand & Foot Care', 'womens-hand-foot-care', 'Hand and foot care products for women', 'beauty', true),
  
  ('Women''s Nail Care', 'womens-nail-care', 'Nail care products for women', 'beauty', true),
  ('Women''s Nail Polish', 'womens-nail-polish', 'Nail polish for women', 'beauty', true),
  ('Women''s Nail Treatments & Tools', 'womens-nail-treatments-tools', 'Nail treatments and tools for women', 'beauty', true),
  
  ('Women''s Beauty Tools', 'womens-beauty-tools', 'Beauty tools and accessories for women', 'beauty', true),
  ('Women''s Makeup Brushes & Sponges', 'womens-makeup-brushes-sponges', 'Makeup brushes and sponges for women', 'beauty', true),
  ('Women''s Facial Tools', 'womens-facial-tools', 'Facial tools for women', 'beauty', true),
  ('Women''s Hair Tools', 'womens-hair-tools', 'Hair tools for women', 'beauty', true),
  
  -- Men's Beauty Subcategories
  ('Men''s Skincare', 'mens-skincare', 'Skincare products for men', 'beauty', true),
  ('Men''s Face Wash & Cleansers', 'mens-face-wash-cleansers', 'Face wash and cleansers for men', 'beauty', true),
  ('Men''s Moisturizers & Aftershave Balms', 'mens-moisturizers-aftershave', 'Moisturizers and aftershave balms for men', 'beauty', true),
  ('Men''s Sunscreen & SPF', 'mens-sunscreen', 'Sunscreen and SPF products for men', 'beauty', true),
  ('Men''s Beard Care', 'mens-beard-care', 'Beard care products for men', 'beauty', true),
  
  ('Men''s Hair Care', 'mens-hair-care', 'Hair care products for men', 'beauty', true),
  ('Men''s Shampoos & Conditioners', 'mens-shampoo-conditioner', 'Shampoos and conditioners for men', 'beauty', true),
  ('Men''s Styling Gels & Pomades', 'mens-styling-gels-pomades', 'Styling gels and pomades for men', 'beauty', true),
  
  ('Men''s Fragrances', 'mens-fragrances', 'Fragrances for men', 'beauty', true),
  ('Men''s Cologne & Aftershave', 'mens-cologne-aftershave', 'Cologne and aftershave for men', 'beauty', true),
  
  ('Men''s Grooming', 'mens-grooming', 'Grooming products for men', 'beauty', true),
  ('Men''s Shaving Creams & Razors', 'mens-shaving-creams-razors', 'Shaving creams and razors for men', 'beauty', true),
  ('Men''s Trimmers & Grooming Kits', 'mens-trimmers-grooming-kits', 'Trimmers and grooming kits for men', 'beauty', true),
  
  ('Men''s Bath & Body', 'mens-bath-body', 'Bath and body products for men', 'beauty', true),
  ('Men''s Body Wash & Scrubs', 'mens-body-wash-scrubs', 'Body wash and scrubs for men', 'beauty', true),
  ('Men''s Deodorants & Antiperspirants', 'mens-deodorants-antiperspirants', 'Deodorants and antiperspirants for men', 'beauty', true),
  
  ('Men''s Nail Care', 'mens-nail-care', 'Nail care products for men', 'beauty', true),
  ('Men''s Nail Grooming Tools', 'mens-nail-grooming-tools', 'Nail grooming tools for men', 'beauty', true),
  
  -- Kids' Beauty Subcategories
  ('Kids'' Skincare', 'kids-skincare', 'Skincare products for kids', 'beauty', true),
  ('Kids'' Gentle Cleansers', 'kids-gentle-cleansers', 'Gentle cleansers for kids', 'beauty', true),
  ('Kids'' Lotions & Moisturizers', 'kids-lotions-moisturizers', 'Lotions and moisturizers for kids', 'beauty', true),
  ('Kids'' Diaper Rash Creams', 'kids-diaper-rash-creams', 'Diaper rash creams for babies', 'beauty', true),
  
  ('Kids'' Hair Care', 'kids-hair-care', 'Hair care products for kids', 'beauty', true),
  ('Kids'' Shampoos & Conditioners', 'kids-shampoos-conditioners', 'Shampoos and conditioners for kids', 'beauty', true),
  ('Kids'' Detanglers', 'kids-detanglers', 'Detanglers for kids', 'beauty', true),
  
  ('Kids'' Bath & Body', 'kids-bath-body', 'Bath and body products for kids', 'beauty', true),
  ('Kids'' Bath Wash', 'kids-bath-wash', 'Bath wash for kids', 'beauty', true),
  ('Kids'' Body Lotions', 'kids-body-lotions', 'Body lotions for kids', 'beauty', true),
  
  ('Kids'' Fragrances', 'kids-fragrances', 'Fragrances for kids', 'beauty', true),
  ('Kids'' Body Sprays', 'kids-body-sprays', 'Body sprays for kids', 'beauty', true),
  
  ('Kids'' Grooming', 'kids-grooming', 'Grooming products for kids', 'beauty', true),
  ('Kids'' Nail Clippers & Grooming Sets', 'kids-nail-clippers-grooming-sets', 'Nail clippers and grooming sets for kids', 'beauty', true)
ON CONFLICT (slug) DO NOTHING;

-- Create index on parent_category column for better performance
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