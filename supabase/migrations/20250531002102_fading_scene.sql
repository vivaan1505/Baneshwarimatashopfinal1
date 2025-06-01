-- Add one coupon for each brand
INSERT INTO coupons (
  code,
  description,
  discount_type,
  discount_value,
  minimum_purchase,
  usage_limit,
  starts_at,
  expires_at,
  brand_id,
  is_active
)
SELECT 
  CONCAT(REGEXP_REPLACE(UPPER(name), '[^A-Z0-9]+', ''), '25') as code,
  CONCAT('Get 25% off all ', name, ' products') as description,
  'percentage' as discount_type,
  25 as discount_value,
  50 as minimum_purchase,
  1000 as usage_limit,
  NOW() as starts_at,
  NOW() + INTERVAL '30 days' as expires_at,
  id as brand_id,
  true as is_active
FROM brands
WHERE is_active = true
ON CONFLICT (code) DO NOTHING;

-- Add fixed amount coupons for luxury brands
INSERT INTO coupons (
  code,
  description,
  discount_type,
  discount_value,
  minimum_purchase,
  usage_limit,
  starts_at,
  expires_at,
  brand_id,
  is_active
)
SELECT 
  CONCAT(REGEXP_REPLACE(UPPER(name), '[^A-Z0-9]+', ''), '100') as code,
  CONCAT('Get $100 off ', name, ' luxury items') as description,
  'fixed_amount' as discount_type,
  100 as discount_value,
  500 as minimum_purchase,
  500 as usage_limit,
  NOW() as starts_at,
  NOW() + INTERVAL '30 days' as expires_at,
  id as brand_id,
  true as is_active
FROM brands
WHERE category LIKE 'luxury%'
  AND is_active = true
ON CONFLICT (code) DO NOTHING;

-- Add special holiday coupons for retail chains
INSERT INTO coupons (
  code,
  description,
  discount_type,
  discount_value,
  minimum_purchase,
  usage_limit,
  starts_at,
  expires_at,
  brand_id,
  is_active
)
SELECT 
  CONCAT(REGEXP_REPLACE(UPPER(name), '[^A-Z0-9]+', ''), 'HOLIDAY') as code,
  CONCAT('Holiday Special: 30% off at ', name) as description,
  'percentage' as discount_type,
  30 as discount_value,
  75 as minimum_purchase,
  2000 as usage_limit,
  NOW() as starts_at,
  NOW() + INTERVAL '45 days' as expires_at,
  id as brand_id,
  true as is_active
FROM brands
WHERE category = 'retail'
  AND is_active = true
ON CONFLICT (code) DO NOTHING;

-- Add beauty brand special offers
INSERT INTO coupons (
  code,
  description,
  discount_type,
  discount_value,
  minimum_purchase,
  usage_limit,
  starts_at,
  expires_at,
  brand_id,
  is_active
)
SELECT 
  CONCAT(REGEXP_REPLACE(UPPER(name), '[^A-Z0-9]+', ''), 'BEAUTY') as code,
  CONCAT('Beauty Special: Get 20% off all ', name, ' products') as description,
  'percentage' as discount_type,
  20 as discount_value,
  40 as minimum_purchase,
  1500 as usage_limit,
  NOW() as starts_at,
  NOW() + INTERVAL '60 days' as expires_at,
  id as brand_id,
  true as is_active
FROM brands
WHERE (category = 'beauty' OR category = 'luxury-beauty')
  AND is_active = true
ON CONFLICT (code) DO NOTHING;

-- Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';