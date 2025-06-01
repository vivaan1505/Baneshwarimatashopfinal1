-- Add sample brands if they don't exist
INSERT INTO brands (id, name, slug, logo_url, category, is_active)
VALUES
  ('b1c2d3e4-f5g6-4a3b-2c1d-1a2b3c4d5e6f', 'Nike', 'nike', 'https://example.com/nike-logo.png', 'footwear', true),
  ('c2d3e4f5-g6h7-5b4c-3d2e-2b3c4d5e6f7g', 'Adidas', 'adidas', 'https://example.com/adidas-logo.png', 'footwear', true),
  ('d3e4f5g6-h7i8-6c5d-4e3f-3c4d5e6f7g8h', 'Zara', 'zara', 'https://example.com/zara-logo.png', 'clothing', true),
  ('e4f5g6h7-i8j9-7d6e-5f4g-4d5e6f7g8h9i', 'MAC Cosmetics', 'mac-cosmetics', 'https://example.com/mac-logo.png', 'beauty', true)
ON CONFLICT (slug) DO NOTHING;

-- Add sample coupons with brand relationships
INSERT INTO coupons (
  code,
  description,
  discount_type,
  discount_value,
  minimum_purchase,
  usage_limit,
  starts_at,
  expires_at,
  is_active,
  brand_id
)
VALUES
  (
    'NIKE25',
    'Get 25% off on all Nike products',
    'percentage',
    25.00,
    100.00,
    1000,
    NOW(),
    NOW() + INTERVAL '30 days',
    true,
    (SELECT id FROM brands WHERE slug = 'nike')
  ),
  (
    'ADIDAS50',
    'Save $50 on Adidas footwear',
    'fixed_amount',
    50.00,
    150.00,
    500,
    NOW(),
    NOW() + INTERVAL '60 days',
    true,
    (SELECT id FROM brands WHERE slug = 'adidas')
  ),
  (
    'ZARA20',
    '20% off on all Zara clothing',
    'percentage',
    20.00,
    75.00,
    2000,
    NOW(),
    NOW() + INTERVAL '45 days',
    true,
    (SELECT id FROM brands WHERE slug = 'zara')
  ),
  (
    'MACBEAUTY',
    'Get $30 off on MAC Cosmetics',
    'fixed_amount',
    30.00,
    100.00,
    1500,
    NOW(),
    NOW() + INTERVAL '90 days',
    true,
    (SELECT id FROM brands WHERE slug = 'mac-cosmetics')
  );