-- Add category column to brands table if it doesn't exist
ALTER TABLE brands ADD COLUMN IF NOT EXISTS category TEXT;

-- Add brand_id to coupons table if it doesn't exist
ALTER TABLE coupons ADD COLUMN IF NOT EXISTS brand_id UUID REFERENCES brands(id);

-- Insert sample brands
INSERT INTO brands (name, slug, description, logo_url, website, category, is_active) VALUES
-- Fashion Brands
('Nike', 'nike', 'Athletic footwear and apparel', 'https://example.com/nike-logo.png', 'https://nike.com', 'fashion', true),
('Adidas', 'adidas', 'Sports and lifestyle wear', 'https://example.com/adidas-logo.png', 'https://adidas.com', 'fashion', true),
('Zara', 'zara', 'Contemporary fashion', 'https://example.com/zara-logo.png', 'https://zara.com', 'fashion', true),
('H&M', 'hm', 'Affordable fashion', 'https://example.com/hm-logo.png', 'https://hm.com', 'fashion', true),
('Uniqlo', 'uniqlo', 'Casual wear', 'https://example.com/uniqlo-logo.png', 'https://uniqlo.com', 'fashion', true),

-- Beauty Brands
('Sephora', 'sephora', 'Beauty and cosmetics', 'https://example.com/sephora-logo.png', 'https://sephora.com', 'beauty', true),
('MAC Cosmetics', 'mac', 'Professional makeup', 'https://example.com/mac-logo.png', 'https://maccosmetics.com', 'beauty', true),
('Fenty Beauty', 'fenty-beauty', 'Inclusive beauty', 'https://example.com/fenty-logo.png', 'https://fentybeauty.com', 'beauty', true),
('The Body Shop', 'the-body-shop', 'Natural beauty products', 'https://example.com/bodyshop-logo.png', 'https://thebodyshop.com', 'beauty', true),
('Lush', 'lush', 'Fresh handmade cosmetics', 'https://example.com/lush-logo.png', 'https://lush.com', 'beauty', true),

-- Electronics Brands
('Apple', 'apple', 'Consumer electronics', 'https://example.com/apple-logo.png', 'https://apple.com', 'electronics', true),
('Samsung', 'samsung', 'Electronics and appliances', 'https://example.com/samsung-logo.png', 'https://samsung.com', 'electronics', true),
('Sony', 'sony', 'Entertainment electronics', 'https://example.com/sony-logo.png', 'https://sony.com', 'electronics', true),
('Microsoft', 'microsoft', 'Software and hardware', 'https://example.com/microsoft-logo.png', 'https://microsoft.com', 'electronics', true),
('Dell', 'dell', 'Computers and accessories', 'https://example.com/dell-logo.png', 'https://dell.com', 'electronics', true),

-- Home & Living Brands
('IKEA', 'ikea', 'Furniture and home accessories', 'https://example.com/ikea-logo.png', 'https://ikea.com', 'home', true),
('Crate & Barrel', 'crate-and-barrel', 'Home furnishings', 'https://example.com/crate-logo.png', 'https://crateandbarrel.com', 'home', true),
('West Elm', 'west-elm', 'Modern furniture', 'https://example.com/westelm-logo.png', 'https://westelm.com', 'home', true),
('Pottery Barn', 'pottery-barn', 'Home decor', 'https://example.com/pottery-logo.png', 'https://potterybarn.com', 'home', true),
('Wayfair', 'wayfair', 'Home goods', 'https://example.com/wayfair-logo.png', 'https://wayfair.com', 'home', true),

-- Sports & Fitness Brands
('Under Armour', 'under-armour', 'Athletic wear', 'https://example.com/ua-logo.png', 'https://underarmour.com', 'sports', true),
('Puma', 'puma', 'Sports lifestyle', 'https://example.com/puma-logo.png', 'https://puma.com', 'sports', true),
('New Balance', 'new-balance', 'Athletic footwear', 'https://example.com/nb-logo.png', 'https://newbalance.com', 'sports', true),
('Reebok', 'reebok', 'Fitness gear', 'https://example.com/reebok-logo.png', 'https://reebok.com', 'sports', true),
('The North Face', 'the-north-face', 'Outdoor gear', 'https://example.com/tnf-logo.png', 'https://thenorthface.com', 'sports', true),

-- Luxury Brands
('Gucci', 'gucci', 'Luxury fashion house', 'https://example.com/gucci-logo.png', 'https://gucci.com', 'luxury', true),
('Louis Vuitton', 'louis-vuitton', 'Luxury goods', 'https://example.com/lv-logo.png', 'https://louisvuitton.com', 'luxury', true),
('Chanel', 'chanel', 'Haute couture', 'https://example.com/chanel-logo.png', 'https://chanel.com', 'luxury', true),
('Hermès', 'hermes', 'Luxury accessories', 'https://example.com/hermes-logo.png', 'https://hermes.com', 'luxury', true),
('Prada', 'prada', 'Luxury fashion', 'https://example.com/prada-logo.png', 'https://prada.com', 'luxury', true);

-- Insert sample coupons for each brand
INSERT INTO coupons (code, description, discount_type, discount_value, minimum_purchase, usage_limit, starts_at, expires_at, is_active, brand_id)
SELECT 
    'WELCOME' || REPLACE(UPPER(b.name), ' ', '') || '25',
    'Welcome offer for ' || b.name || ' - 25% off your first purchase',
    'percentage',
    25.00,
    100.00,
    1000,
    NOW(),
    NOW() + INTERVAL '30 days',
    true,
    b.id
FROM brands b
WHERE b.is_active = true;