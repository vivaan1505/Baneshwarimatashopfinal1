-- Delete existing data to avoid conflicts
DELETE FROM product_images;
DELETE FROM products;
DELETE FROM categories;

-- Create categories
INSERT INTO categories (name, slug, description, is_active) VALUES
('Men', 'men', 'Men''s fashion and accessories', true),
('Women', 'women', 'Women''s fashion and accessories', true),
('Kids', 'kids', 'Children''s clothing and accessories', true),
('Footwear', 'footwear', 'Shoes and boots for all occasions', true),
('Clothing', 'clothing', 'Apparel for all ages', true),
('Jewelry', 'jewelry', 'Fine jewelry and accessories', true),
('Beauty', 'beauty', 'Cosmetics and skincare products', true);

-- Function to get random price
CREATE OR REPLACE FUNCTION random_price(min_price integer, max_price integer) 
RETURNS decimal AS $$
BEGIN
    RETURN trunc((random() * (max_price - min_price) + min_price)::numeric, 2);
END;
$$ LANGUAGE plpgsql;

-- Function to get random stock quantity
CREATE OR REPLACE FUNCTION random_stock() 
RETURNS integer AS $$
BEGIN
    RETURN floor(random() * 100 + 1)::integer;
END;
$$ LANGUAGE plpgsql;

-- Men's Products
INSERT INTO products (
    name, slug, category_id, brand_id, description, price, stock_quantity,
    is_visible, is_featured, is_new, rating, review_count
)
SELECT 
    'Men''s ' || CASE (generate_series % 5)
        WHEN 0 THEN 'Premium Suit'
        WHEN 1 THEN 'Designer Watch'
        WHEN 2 THEN 'Leather Wallet'
        WHEN 3 THEN 'Casual Shirt'
        WHEN 4 THEN 'Dress Shoes'
    END || ' ' || generate_series,
    'mens-product-' || uuid_generate_v4(),
    (SELECT id FROM categories WHERE slug = 'men'),
    (SELECT id FROM brands ORDER BY random() LIMIT 1),
    'Premium quality men''s fashion item with modern design and comfortable fit.',
    random_price(50, 500),
    random_stock(),
    true,
    random() < 0.2,
    random() < 0.3,
    random() * 3 + 2,
    floor(random() * 100)::integer
FROM generate_series(1, 15);

-- Women's Products
INSERT INTO products (
    name, slug, category_id, brand_id, description, price, stock_quantity,
    is_visible, is_featured, is_new, rating, review_count
)
SELECT 
    'Women''s ' || CASE (generate_series % 5)
        WHEN 0 THEN 'Designer Dress'
        WHEN 1 THEN 'Luxury Handbag'
        WHEN 2 THEN 'Fashion Boots'
        WHEN 3 THEN 'Evening Gown'
        WHEN 4 THEN 'Silk Blouse'
    END || ' ' || generate_series,
    'womens-product-' || uuid_generate_v4(),
    (SELECT id FROM categories WHERE slug = 'women'),
    (SELECT id FROM brands ORDER BY random() LIMIT 1),
    'Elegant women''s fashion piece with contemporary style and premium materials.',
    random_price(50, 600),
    random_stock(),
    true,
    random() < 0.2,
    random() < 0.3,
    random() * 3 + 2,
    floor(random() * 100)::integer
FROM generate_series(1, 15);

-- Kids' Products
INSERT INTO products (
    name, slug, category_id, brand_id, description, price, stock_quantity,
    is_visible, is_featured, is_new, rating, review_count
)
SELECT 
    'Kids'' ' || CASE (generate_series % 5)
        WHEN 0 THEN 'Play Set'
        WHEN 1 THEN 'School Uniform'
        WHEN 2 THEN 'Sport Shoes'
        WHEN 3 THEN 'Winter Jacket'
        WHEN 4 THEN 'Party Dress'
    END || ' ' || generate_series,
    'kids-product-' || uuid_generate_v4(),
    (SELECT id FROM categories WHERE slug = 'kids'),
    (SELECT id FROM brands ORDER BY random() LIMIT 1),
    'Comfortable and durable children''s wear perfect for active kids.',
    random_price(20, 200),
    random_stock(),
    true,
    random() < 0.2,
    random() < 0.3,
    random() * 3 + 2,
    floor(random() * 100)::integer
FROM generate_series(1, 15);

-- Footwear Products
INSERT INTO products (
    name, slug, category_id, brand_id, description, price, stock_quantity,
    is_visible, is_featured, is_new, rating, review_count
)
SELECT 
    CASE (generate_series % 5)
        WHEN 0 THEN 'Luxury Leather'
        WHEN 1 THEN 'Sport Elite'
        WHEN 2 THEN 'Comfort Plus'
        WHEN 3 THEN 'Designer Collection'
        WHEN 4 THEN 'Classic Style'
    END || ' Footwear ' || generate_series,
    'footwear-product-' || uuid_generate_v4(),
    (SELECT id FROM categories WHERE slug = 'footwear'),
    (SELECT id FROM brands ORDER BY random() LIMIT 1),
    'High-quality footwear designed for comfort and style.',
    random_price(60, 400),
    random_stock(),
    true,
    random() < 0.2,
    random() < 0.3,
    random() * 3 + 2,
    floor(random() * 100)::integer
FROM generate_series(1, 15);

-- Clothing Products
INSERT INTO products (
    name, slug, category_id, brand_id, description, price, stock_quantity,
    is_visible, is_featured, is_new, rating, review_count
)
SELECT 
    CASE (generate_series % 5)
        WHEN 0 THEN 'Premium Collection'
        WHEN 1 THEN 'Designer Series'
        WHEN 2 THEN 'Casual Comfort'
        WHEN 3 THEN 'Luxury Line'
        WHEN 4 THEN 'Fashion Forward'
    END || ' Apparel ' || generate_series,
    'clothing-product-' || uuid_generate_v4(),
    (SELECT id FROM categories WHERE slug = 'clothing'),
    (SELECT id FROM brands ORDER BY random() LIMIT 1),
    'Trendy clothing pieces made with premium fabrics and attention to detail.',
    random_price(40, 300),
    random_stock(),
    true,
    random() < 0.2,
    random() < 0.3,
    random() * 3 + 2,
    floor(random() * 100)::integer
FROM generate_series(1, 15);

-- Jewelry Products
INSERT INTO products (
    name, slug, category_id, brand_id, description, price, stock_quantity,
    is_visible, is_featured, is_new, rating, review_count
)
SELECT 
    CASE (generate_series % 5)
        WHEN 0 THEN 'Diamond Collection'
        WHEN 1 THEN 'Gold Series'
        WHEN 2 THEN 'Pearl Elegance'
        WHEN 3 THEN 'Silver Crafted'
        WHEN 4 THEN 'Precious Gems'
    END || ' Jewelry ' || generate_series,
    'jewelry-product-' || uuid_generate_v4(),
    (SELECT id FROM categories WHERE slug = 'jewelry'),
    (SELECT id FROM brands ORDER BY random() LIMIT 1),
    'Exquisite jewelry pieces crafted with precious materials and stunning design.',
    random_price(100, 5000),
    random_stock(),
    true,
    random() < 0.2,
    random() < 0.3,
    random() * 3 + 2,
    floor(random() * 100)::integer
FROM generate_series(1, 15);

-- Beauty Products
INSERT INTO products (
    name, slug, category_id, brand_id, description, price, stock_quantity,
    is_visible, is_featured, is_new, rating, review_count
)
SELECT 
    CASE (generate_series % 5)
        WHEN 0 THEN 'Luxury Skincare'
        WHEN 1 THEN 'Premium Cosmetics'
        WHEN 2 THEN 'Natural Beauty'
        WHEN 3 THEN 'Organic Collection'
        WHEN 4 THEN 'Beauty Essentials'
    END || ' ' || generate_series,
    'beauty-product-' || uuid_generate_v4(),
    (SELECT id FROM categories WHERE slug = 'beauty'),
    (SELECT id FROM brands ORDER BY random() LIMIT 1),
    'Premium beauty and skincare products for your daily routine.',
    random_price(20, 200),
    random_stock(),
    true,
    random() < 0.2,
    random() < 0.3,
    random() * 3 + 2,
    floor(random() * 100)::integer
FROM generate_series(1, 15);

-- Add product images
INSERT INTO product_images (product_id, url, alt_text, position)
SELECT 
    p.id,
    'https://picsum.photos/seed/' || p.id || '/800/800',
    p.name || ' image',
    1
FROM products p;

-- Drop the helper functions
DROP FUNCTION IF EXISTS random_price;
DROP FUNCTION IF EXISTS random_stock;