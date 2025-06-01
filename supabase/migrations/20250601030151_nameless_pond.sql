-- Create subcategories for each main category
DO $$ 
BEGIN
  -- First, ensure parent_category column exists in categories table
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'categories' AND column_name = 'parent_category'
  ) THEN
    ALTER TABLE categories ADD COLUMN parent_category TEXT;
  END IF;

  -- Add subcategories for Footwear
  INSERT INTO categories (name, slug, description, parent_category, is_active)
  VALUES
    ('Formal Shoes', 'formal-shoes', 'Elegant formal footwear for special occasions', 'footwear', true),
    ('Casual Shoes', 'casual-shoes', 'Comfortable everyday footwear', 'footwear', true),
    ('Athletic Shoes', 'athletic-shoes', 'Performance footwear for sports and activities', 'footwear', true),
    ('Boots', 'boots', 'Stylish and functional boots for all seasons', 'footwear', true),
    ('Sandals', 'sandals', 'Open footwear for warm weather', 'footwear', true),
    ('Heels', 'heels', 'Elegant heeled footwear for women', 'footwear', true),
    ('Flats', 'flats', 'Comfortable flat footwear for women', 'footwear', true),
    ('Sneakers', 'sneakers', 'Casual athletic-inspired footwear', 'footwear', true)
  ON CONFLICT (slug) DO NOTHING;

  -- Add subcategories for Clothing
  INSERT INTO categories (name, slug, description, parent_category, is_active)
  VALUES
    ('Men''s Formal', 'mens-formal', 'Formal attire for men', 'clothing', true),
    ('Men''s Casual', 'mens-casual', 'Casual everyday clothing for men', 'clothing', true),
    ('Women''s Dresses', 'womens-dresses', 'Elegant dresses for women', 'clothing', true),
    ('Women''s Tops', 'womens-tops', 'Stylish tops for women', 'clothing', true),
    ('Women''s Bottoms', 'womens-bottoms', 'Pants, skirts, and shorts for women', 'clothing', true),
    ('Kids'' Clothing', 'kids-clothing', 'Clothing for children', 'clothing', true),
    ('Outerwear', 'outerwear', 'Jackets, coats, and outdoor clothing', 'clothing', true),
    ('Activewear', 'activewear', 'Performance clothing for sports and fitness', 'clothing', true),
    ('Swimwear', 'swimwear', 'Bathing suits and beach attire', 'clothing', true),
    ('Underwear', 'underwear', 'Undergarments and intimates', 'clothing', true)
  ON CONFLICT (slug) DO NOTHING;

  -- Add subcategories for Jewelry
  INSERT INTO categories (name, slug, description, parent_category, is_active)
  VALUES
    ('Necklaces', 'necklaces', 'Elegant necklaces and pendants', 'jewelry', true),
    ('Rings', 'rings', 'Beautiful rings for all occasions', 'jewelry', true),
    ('Earrings', 'earrings', 'Stylish earrings and ear accessories', 'jewelry', true),
    ('Bracelets', 'bracelets', 'Wrist accessories and bangles', 'jewelry', true),
    ('Watches', 'watches', 'Luxury and fashion timepieces', 'jewelry', true),
    ('Anklets', 'anklets', 'Decorative ankle jewelry', 'jewelry', true),
    ('Brooches', 'brooches', 'Decorative pins and clips', 'jewelry', true),
    ('Cufflinks', 'cufflinks', 'Elegant shirt accessories for men', 'jewelry', true)
  ON CONFLICT (slug) DO NOTHING;

  -- Add subcategories for Beauty
  INSERT INTO categories (name, slug, description, parent_category, is_active)
  VALUES
    ('Skincare', 'skincare', 'Products for skin health and beauty', 'beauty', true),
    ('Makeup', 'makeup', 'Cosmetics and beauty products', 'beauty', true),
    ('Fragrances', 'fragrances', 'Perfumes and colognes', 'beauty', true),
    ('Hair Care', 'hair-care', 'Products for hair health and styling', 'beauty', true),
    ('Bath & Body', 'bath-body', 'Products for body care and bathing', 'beauty', true),
    ('Tools & Accessories', 'tools-accessories', 'Beauty tools and accessories', 'beauty', true),
    ('Men''s Grooming', 'mens-grooming', 'Grooming products for men', 'beauty', true),
    ('Gift Sets', 'gift-sets', 'Curated beauty product collections', 'beauty', true)
  ON CONFLICT (slug) DO NOTHING;

  -- Add subcategories for Accessories
  INSERT INTO categories (name, slug, description, parent_category, is_active)
  VALUES
    ('Hats', 'hats', 'Stylish headwear', 'accessories', true),
    ('Scarves', 'scarves', 'Neck accessories for style and warmth', 'accessories', true),
    ('Gloves', 'gloves', 'Hand coverings for fashion and function', 'accessories', true),
    ('Belts', 'belts', 'Waist accessories for function and style', 'accessories', true),
    ('Sunglasses', 'sunglasses', 'Eye protection with style', 'accessories', true),
    ('Hair Accessories', 'hair-accessories', 'Decorative and functional hair items', 'accessories', true),
    ('Ties', 'ties', 'Neckties and bow ties', 'accessories', true),
    ('Wallets', 'wallets', 'Money and card holders', 'accessories', true)
  ON CONFLICT (slug) DO NOTHING;

  -- Add subcategories for Bags
  INSERT INTO categories (name, slug, description, parent_category, is_active)
  VALUES
    ('Handbags', 'handbags', 'Stylish bags for everyday use', 'bags', true),
    ('Backpacks', 'backpacks', 'Practical bags for carrying essentials', 'bags', true),
    ('Totes', 'totes', 'Spacious open-top bags', 'bags', true),
    ('Clutches', 'clutches', 'Small handheld bags for essentials', 'bags', true),
    ('Travel Bags', 'travel-bags', 'Bags designed for travel', 'bags', true),
    ('Laptop Bags', 'laptop-bags', 'Protective cases for computers', 'bags', true),
    ('Wallets & Purses', 'wallets-purses', 'Small accessories for money and cards', 'bags', true),
    ('Luggage', 'luggage', 'Suitcases and travel containers', 'bags', true)
  ON CONFLICT (slug) DO NOTHING;
END $$;

-- Add subcategory column to products table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'subcategory'
  ) THEN
    ALTER TABLE products ADD COLUMN subcategory TEXT;
  END IF;
END $$;

-- Create index on subcategory column for better performance
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_products_subcategory'
  ) THEN
    CREATE INDEX idx_products_subcategory ON products(subcategory);
  END IF;
END $$;

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