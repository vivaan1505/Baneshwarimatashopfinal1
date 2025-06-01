-- Create categories if they don't exist
INSERT INTO categories (name, slug, description, is_active) VALUES
('Men', 'men', 'Men''s fashion and accessories', true),
('Women', 'women', 'Women''s fashion and accessories', true),
('Kids', 'kids', 'Children''s clothing and accessories', true),
('Footwear', 'footwear', 'Shoes and boots for all occasions', true),
('Clothing', 'clothing', 'Apparel for all ages', true),
('Jewelry', 'jewelry', 'Fine jewelry and accessories', true),
('Beauty', 'beauty', 'Cosmetics and skincare products', true)
ON CONFLICT (slug) DO NOTHING;

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
    'Men''s Product ' || generate_series(1, 15),
    'mens-product-' || generate_series(1, 15),
    (SELECT id FROM categories WHERE slug = 'men'),
    (SELECT id FROM brands ORDER BY random() LIMIT 1),
    'Premium quality men''s fashion item with modern design and comfortable fit.',
    random_price(50, 500),
    random_stock(),
    true,
    random() < 0.2,
    random() < 0.3,
    random() * 3 + 2,
    floor(random() * 100)::integer;

-- Women's Products
INSERT INTO products (
    name, slug, category_id, brand_id, description, price, stock_quantity,
    is_visible, is_featured, is_new, rating, review_count
)
SELECT 
    'Women''s Product ' || generate_series(1, 15),
    'womens-product-' || generate_series(1, 15),
    (SELECT id FROM categories WHERE slug = 'women'),
    (SELECT id FROM brands ORDER BY random() LIMIT 1),
    'Elegant women''s fashion piece with contemporary style and premium materials.',
    random_price(50, 600),
    random_stock(),
    true,
    random() < 0.2,
    random() < 0.3,
    random() * 3 + 2,
    floor(random() * 100)::integer;

-- Kids' Products
INSERT INTO products (
    name, slug, category_id, brand_id, description, price, stock_quantity,
    is_visible, is_featured, is_new, rating, review_count
)
SELECT 
    'Kids'' Product ' || generate_series(1, 15),
    'kids-product-' || generate_series(1, 15),
    (SELECT id FROM categories WHERE slug = 'kids'),
    (SELECT id FROM brands ORDER BY random() LIMIT 1),
    'Comfortable and durable children''s wear perfect for active kids.',
    random_price(20, 200),
    random_stock(),
    true,
    random() < 0.2,
    random() < 0.3,
    random() * 3 + 2,
    floor(random() * 100)::integer;

-- Footwear Products
INSERT INTO products (
    name, slug, category_id, brand_id, description, price, stock_quantity,
    is_visible, is_featured, is_new, rating, review_count
)
SELECT 
    'Footwear Product ' || generate_series(1, 15),
    'footwear-product-' || generate_series(1, 15),
    (SELECT id FROM categories WHERE slug = 'footwear'),
    (SELECT id FROM brands ORDER BY random() LIMIT 1),
    'High-quality footwear designed for comfort and style.',
    random_price(60, 400),
    random_stock(),
    true,
    random() < 0.2,
    random() < 0.3,
    random() * 3 + 2,
    floor(random() * 100)::integer;

-- Clothing Products
INSERT INTO products (
    name, slug, category_id, brand_id, description, price, stock_quantity,
    is_visible, is_featured, is_new, rating, review_count
)
SELECT 
    'Clothing Product ' || generate_series(1, 15),
    'clothing-product-' || generate_series(1, 15),
    (SELECT id FROM categories WHERE slug = 'clothing'),
    (SELECT id FROM brands ORDER BY random() LIMIT 1),
    'Trendy clothing pieces made with premium fabrics and attention to detail.',
    random_price(40, 300),
    random_stock(),
    true,
    random() < 0.2,
    random() < 0.3,
    random() * 3 + 2,
    floor(random() * 100)::integer;

-- Jewelry Products
INSERT INTO products (
    name, slug, category_id, brand_id, description, price, stock_quantity,
    is_visible, is_featured, is_new, rating, review_count
)
SELECT 
    'Jewelry Product ' || generate_series(1, 15),
    'jewelry-product-' || generate_series(1, 15),
    (SELECT id FROM categories WHERE slug = 'jewelry'),
    (SELECT id FROM brands ORDER BY random() LIMIT 1),
    'Exquisite jewelry pieces crafted with precious materials and stunning design.',
    random_price(100, 5000),
    random_stock(),
    true,
    random() < 0.2,
    random() < 0.3,
    random() * 3 + 2,
    floor(random() * 100)::integer;

-- Beauty Products
INSERT INTO products (
    name, slug, category_id, brand_id, description, price, stock_quantity,
    is_visible, is_featured, is_new, rating, review_count
)
SELECT 
    'Beauty Product ' || generate_series(1, 15),
    'beauty-product-' || generate_series(1, 15),
    (SELECT id FROM categories WHERE slug = 'beauty'),
    (SELECT id FROM brands ORDER BY random() LIMIT 1),
    'Premium beauty and skincare products for your daily routine.',
    random_price(20, 200),
    random_stock(),
    true,
    random() < 0.2,
    random() < 0.3,
    random() * 3 + 2,
    floor(random() * 100)::integer;

-- Add product images
INSERT INTO product_images (product_id, url, alt_text, position)
SELECT 
    p.id,
    'https://picsum.photos/seed/' || p.id || '/800/800',
    p.name || ' image',
    1
FROM products p
WHERE NOT EXISTS (
    SELECT 1 FROM product_images pi WHERE pi.product_id = p.id
);

-- Drop the helper functions
DROP FUNCTION IF EXISTS random_price;
DROP FUNCTION IF EXISTS random_stock;