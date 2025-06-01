-- First, ensure we have the necessary categories
INSERT INTO categories (name, slug, description, is_active) VALUES
('Clothing', 'clothing', 'Luxury clothing and apparel', true),
('Footwear', 'footwear', 'Designer shoes and footwear', true),
('Jewelry', 'jewelry', 'Fine jewelry and watches', true),
('Beauty', 'beauty', 'Luxury beauty and skincare', true),
('Bridal', 'bridal', 'Bridal collection', true),
('Christmas', 'christmas', 'Holiday collection', true),
('Sale', 'sale', 'Special offers and deals', true)
ON CONFLICT (slug) DO NOTHING;

-- Add products for each category
INSERT INTO products (
  name,
  slug,
  brand_id,
  category_id,
  description,
  price,
  stock_quantity,
  is_visible,
  gender,
  tags
) 
SELECT 
  'Silk Evening Gown',
  'silk-evening-gown-' || b.slug,
  b.id,
  (SELECT id FROM categories WHERE slug = 'clothing'),
  'Elegant silk evening gown with delicate beading and flowing silhouette',
  3500.00,
  10,
  true,
  'women',
  ARRAY['luxury', 'evening-wear', 'new-arrival']
FROM brands b
WHERE b.category = 'luxury'
LIMIT 5;

-- Add footwear products
INSERT INTO products (
  name,
  slug,
  brand_id,
  category_id,
  description,
  price,
  stock_quantity,
  is_visible,
  gender,
  tags
)
SELECT 
  'Classic Leather Pumps',
  'classic-leather-pumps-' || b.slug,
  b.id,
  (SELECT id FROM categories WHERE slug = 'footwear'),
  'Timeless leather pumps with 3-inch heel',
  895.00,
  15,
  true,
  'women',
  ARRAY['luxury', 'classic', 'best-seller']
FROM brands b
WHERE b.category = 'luxury-footwear'
LIMIT 5;

-- Add jewelry products
INSERT INTO products (
  name,
  slug,
  brand_id,
  category_id,
  description,
  price,
  stock_quantity,
  is_visible,
  gender,
  tags
)
SELECT 
  'Diamond Tennis Bracelet',
  'diamond-tennis-bracelet-' || b.slug,
  b.id,
  (SELECT id FROM categories WHERE slug = 'jewelry'),
  '18K white gold tennis bracelet with round brilliant diamonds',
  15000.00,
  5,
  true,
  'women',
  ARRAY['luxury', 'diamonds', 'exclusive']
FROM brands b
WHERE b.category = 'luxury-jewelry'
LIMIT 5;

-- Add beauty products
INSERT INTO products (
  name,
  slug,
  brand_id,
  category_id,
  description,
  price,
  stock_quantity,
  is_visible,
  gender,
  tags
)
SELECT 
  'Luxury Skincare Set',
  'luxury-skincare-set-' || b.slug,
  b.id,
  (SELECT id FROM categories WHERE slug = 'beauty'),
  'Complete luxury skincare routine with premium ingredients',
  950.00,
  20,
  true,
  'unisex',
  ARRAY['luxury', 'skincare', 'gift-set']
FROM brands b
WHERE b.category = 'luxury-beauty'
LIMIT 5;

-- Add bridal products
INSERT INTO products (
  name,
  slug,
  brand_id,
  category_id,
  description,
  price,
  stock_quantity,
  is_visible,
  gender,
  tags
)
SELECT 
  'Bridal Collection Gown',
  'bridal-collection-gown-' || b.slug,
  b.id,
  (SELECT id FROM categories WHERE slug = 'bridal'),
  'Exquisite bridal gown with hand-beaded details and cathedral train',
  12000.00,
  3,
  true,
  'women',
  ARRAY['bridal', 'luxury', 'exclusive']
FROM brands b
WHERE b.category = 'luxury'
LIMIT 5;

-- Add Christmas collection products
INSERT INTO products (
  name,
  slug,
  brand_id,
  category_id,
  description,
  price,
  stock_quantity,
  is_visible,
  gender,
  tags
)
SELECT 
  'Holiday Collection Set',
  'holiday-collection-set-' || b.slug,
  b.id,
  (SELECT id FROM categories WHERE slug = 'christmas'),
  'Limited edition holiday collection with exclusive packaging',
  1500.00,
  25,
  true,
  'unisex',
  ARRAY['holiday', 'limited-edition', 'gift-set']
FROM brands b
WHERE b.category IN ('luxury', 'luxury-beauty')
LIMIT 5;

-- Add sale products
INSERT INTO products (
  name,
  slug,
  brand_id,
  category_id,
  description,
  price,
  compare_at_price,
  stock_quantity,
  is_visible,
  gender,
  tags
)
SELECT 
  'Designer Sale Item',
  'designer-sale-item-' || b.slug,
  b.id,
  (SELECT id FROM categories WHERE slug = 'sale'),
  'Luxury designer piece at a special price',
  1999.99,
  2999.99,
  8,
  true,
  'unisex',
  ARRAY['sale', 'limited-time', 'best-deal']
FROM brands b
WHERE b.category = 'luxury'
LIMIT 5;

-- Add product images
INSERT INTO product_images (
  product_id,
  url,
  alt_text,
  position
)
SELECT 
  p.id,
  CASE c.slug
    WHEN 'clothing' THEN 'https://images.pexels.com/photos/1755385/pexels-photo-1755385.jpeg'
    WHEN 'footwear' THEN 'https://images.pexels.com/photos/3782786/pexels-photo-3782786.jpeg'
    WHEN 'jewelry' THEN 'https://images.pexels.com/photos/1721937/pexels-photo-1721937.jpeg'
    WHEN 'beauty' THEN 'https://images.pexels.com/photos/3785147/pexels-photo-3785147.jpeg'
    WHEN 'bridal' THEN 'https://images.pexels.com/photos/1855586/pexels-photo-1855586.jpeg'
    WHEN 'christmas' THEN 'https://images.pexels.com/photos/717988/pexels-photo-717988.jpeg'
    WHEN 'sale' THEN 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg'
  END,
  p.name,
  0
FROM products p
JOIN categories c ON c.id = p.category_id;

-- Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';