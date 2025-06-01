-- Create helper functions
CREATE OR REPLACE FUNCTION random_price(min_price integer, max_price integer) 
RETURNS decimal AS $$
BEGIN
    RETURN trunc((random() * (max_price - min_price) + min_price)::numeric, 2);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION random_stock() 
RETURNS integer AS $$
BEGIN
    RETURN floor(random() * 100 + 1)::integer;
END;
$$ LANGUAGE plpgsql;

-- Add subcategories to categories table
ALTER TABLE categories ADD COLUMN IF NOT EXISTS parent_category TEXT;

-- Add gender to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS gender TEXT CHECK (gender IN ('men', 'women', 'kids', 'unisex'));

-- Add subcategory to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS subcategory TEXT;

-- Create collections for special categories
INSERT INTO collections (name, slug, description, image_url, is_active) VALUES
('Bridal Collection', 'bridal-collection', 'Exclusive bridal wear and accessories', 'https://images.pexels.com/photos/1855586/pexels-photo-1855586.jpeg', true),
('Christmas Collection', 'christmas-collection', 'Festive fashion and gifts', 'https://images.pexels.com/photos/717988/pexels-photo-717988.jpeg', true)
ON CONFLICT (slug) DO NOTHING;

-- Insert subcategories for main categories
INSERT INTO categories (name, slug, description, parent_category, is_active) VALUES
-- Men's Subcategories
('Men''s Formal Wear', 'mens-formal', 'Suits, blazers, and formal attire', 'men', true),
('Men''s Casual Wear', 'mens-casual', 'Everyday casual clothing', 'men', true),
('Men''s Accessories', 'mens-accessories', 'Belts, ties, and accessories', 'men', true),
('Men''s Shoes', 'mens-shoes', 'Formal and casual footwear', 'men', true),

-- Women's Subcategories
('Women''s Dresses', 'womens-dresses', 'Formal and casual dresses', 'women', true),
('Women''s Tops', 'womens-tops', 'Blouses, shirts, and tops', 'women', true),
('Women''s Bottoms', 'womens-bottoms', 'Pants, skirts, and shorts', 'women', true),
('Women''s Accessories', 'womens-accessories', 'Bags, scarves, and accessories', 'women', true),

-- Kids' Subcategories
('Kids'' Clothing', 'kids-clothing', 'Clothes for children', 'kids', true),
('Kids'' Shoes', 'kids-shoes', 'Footwear for children', 'kids', true),
('Kids'' Accessories', 'kids-accessories', 'Accessories for children', 'kids', true),

-- Footwear Subcategories
('Formal Shoes', 'formal-shoes', 'Dress shoes and formal footwear', 'footwear', true),
('Casual Shoes', 'casual-shoes', 'Everyday comfortable shoes', 'footwear', true),
('Athletic Shoes', 'athletic-shoes', 'Sports and training footwear', 'footwear', true),
('Boots', 'boots', 'All types of boots', 'footwear', true),

-- Jewelry Subcategories
('Necklaces', 'necklaces', 'Chains and pendants', 'jewelry', true),
('Rings', 'rings', 'Fashion and fine rings', 'jewelry', true),
('Earrings', 'earrings', 'Studs and statement earrings', 'jewelry', true),
('Bracelets', 'bracelets', 'Bangles and bracelets', 'jewelry', true),

-- Beauty Subcategories
('Skincare', 'skincare', 'Facial and body care products', 'beauty', true),
('Makeup', 'makeup', 'Cosmetics and beauty tools', 'beauty', true),
('Fragrances', 'fragrances', 'Perfumes and body sprays', 'beauty', true),
('Hair Care', 'hair-care', 'Hair products and accessories', 'beauty', true)
ON CONFLICT (slug) DO NOTHING;

-- Insert bridal collection products
INSERT INTO products (
    name, slug, category_id, brand_id, description,
    price, stock_quantity, is_visible, is_featured, is_new,
    rating, review_count, gender, subcategory
)
SELECT 
    'Bridal ' || CASE (generate_series % 5)
        WHEN 0 THEN 'Gown'
        WHEN 1 THEN 'Shoes'
        WHEN 2 THEN 'Jewelry Set'
        WHEN 3 THEN 'Accessories'
        WHEN 4 THEN 'Beauty Kit'
    END || ' ' || generate_series,
    'bridal-' || generate_series || '-' || floor(random() * 1000)::text,
    (SELECT id FROM categories WHERE slug = 'womens-dresses'),
    (SELECT id FROM brands ORDER BY random() LIMIT 1),
    'Luxurious bridal piece crafted with premium materials and exquisite attention to detail.',
    random_price(500, 5000),
    random_stock(),
    true,
    true,
    true,
    random() * 2 + 3,
    floor(random() * 50)::integer,
    'women',
    'bridal'
FROM generate_series(1, 100)
ON CONFLICT (slug) DO NOTHING;

-- Insert Christmas collection products
INSERT INTO products (
    name, slug, category_id, brand_id, description,
    price, stock_quantity, is_visible, is_featured, is_new,
    rating, review_count, gender, subcategory
)
SELECT 
    'Holiday ' || CASE (generate_series % 5)
        WHEN 0 THEN 'Party Dress'
        WHEN 1 THEN 'Gift Set'
        WHEN 2 THEN 'Festive Wear'
        WHEN 3 THEN 'Accessories'
        WHEN 4 THEN 'Beauty Collection'
    END || ' ' || generate_series,
    'christmas-' || generate_series || '-' || floor(random() * 1000)::text,
    (SELECT id FROM categories WHERE slug = CASE (generate_series % 3)
        WHEN 0 THEN 'womens-dresses'
        WHEN 1 THEN 'mens-formal'
        WHEN 2 THEN 'kids-clothing'
    END),
    (SELECT id FROM brands ORDER BY random() LIMIT 1),
    'Special holiday collection item perfect for festive celebrations.',
    random_price(50, 1000),
    random_stock(),
    true,
    true,
    true,
    random() * 2 + 3,
    floor(random() * 50)::integer,
    CASE (generate_series % 3)
        WHEN 0 THEN 'women'
        WHEN 1 THEN 'men'
        WHEN 2 THEN 'kids'
    END,
    'christmas'
FROM generate_series(1, 100)
ON CONFLICT (slug) DO NOTHING;

-- Add collection products
INSERT INTO collection_products (collection_id, product_id)
SELECT 
    c.id,
    p.id
FROM collections c
CROSS JOIN products p
WHERE 
    (c.slug = 'bridal-collection' AND p.subcategory = 'bridal') OR
    (c.slug = 'christmas-collection' AND p.subcategory = 'christmas')
ON CONFLICT DO NOTHING;

-- Add product images with real URLs
INSERT INTO product_images (product_id, url, alt_text, position)
SELECT 
    p.id,
    CASE p.subcategory
        WHEN 'bridal' THEN (
            SELECT 'https://images.pexels.com/photos/' || (
                ARRAY[
                    '1855586', '2122361', '291759', '1721934',
                    '1458867', '1721936', '1855582', '2122363'
                ])[floor(random() * 8 + 1)] || '/pexels-photo-' || (
                ARRAY[
                    '1855586', '2122361', '291759', '1721934',
                    '1458867', '1721936', '1855582', '2122363'
                ])[floor(random() * 8 + 1)] || '.jpeg'
        )
        WHEN 'christmas' THEN (
            SELECT 'https://images.pexels.com/photos/' || (
                ARRAY[
                    '717988', '1661905', '1661904', '1661903',
                    '1661902', '1661901', '1661900', '1661899'
                ])[floor(random() * 8 + 1)] || '/pexels-photo-' || (
                ARRAY[
                    '717988', '1661905', '1661904', '1661903',
                    '1661902', '1661901', '1661900', '1661899'
                ])[floor(random() * 8 + 1)] || '.jpeg'
        )
        ELSE 'https://picsum.photos/seed/' || p.id || '/800/800'
    END,
    p.name || ' image',
    1
FROM products p
WHERE NOT EXISTS (
    SELECT 1 FROM product_images pi WHERE pi.product_id = p.id
);

-- Drop helper functions
DROP FUNCTION IF EXISTS random_price;
DROP FUNCTION IF EXISTS random_stock;