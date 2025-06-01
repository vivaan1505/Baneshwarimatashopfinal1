-- Add sale columns to products table
ALTER TABLE products
ADD COLUMN is_christmas_sale BOOLEAN DEFAULT false,
ADD COLUMN is_black_friday BOOLEAN DEFAULT false,
ADD COLUMN is_boxing_week BOOLEAN DEFAULT false,
ADD COLUMN is_diwali_sale BOOLEAN DEFAULT false,
ADD COLUMN is_eid_sale BOOLEAN DEFAULT false,
ADD COLUMN is_clearance BOOLEAN DEFAULT false,
ADD COLUMN sale_discount INTEGER;

-- Create index for better performance on sale queries
CREATE INDEX idx_products_sales ON products (
  is_christmas_sale,
  is_black_friday,
  is_boxing_week,
  is_diwali_sale,
  is_eid_sale,
  is_clearance
);