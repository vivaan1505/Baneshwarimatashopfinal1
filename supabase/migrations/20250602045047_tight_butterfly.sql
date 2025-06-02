-- This migration fixes the relationship between order_items and products
-- by ensuring the correct path through product_variants

-- First, ensure the product_variants table exists with the correct structure
CREATE TABLE IF NOT EXISTS public.product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  sku TEXT,
  barcode TEXT,
  option_values JSONB NOT NULL DEFAULT '[]'::jsonb,
  price NUMERIC(10,2),
  compare_at_price NUMERIC(10,2),
  cost_price NUMERIC(10,2),
  weight NUMERIC(10,2),
  stock_quantity INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create a unique index on SKU if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'product_variants_sku_key'
  ) THEN
    CREATE UNIQUE INDEX product_variants_sku_key ON public.product_variants(sku)
    WHERE sku IS NOT NULL;
  END IF;
END $$;

-- Ensure the order_items table has the correct foreign key to product_variants
DO $$
BEGIN
  -- Check if the foreign key already exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'order_items_product_variant_id_fkey'
  ) THEN
    -- Add the foreign key constraint if it doesn't exist
    ALTER TABLE public.order_items
    ADD CONSTRAINT order_items_product_variant_id_fkey
    FOREIGN KEY (product_variant_id) REFERENCES public.product_variants(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Create a default product variant for each product if none exists
-- This helps with backward compatibility for existing orders
INSERT INTO public.product_variants (product_id, sku, option_values, price, stock_quantity)
SELECT 
  p.id, 
  p.sku, 
  '[]'::jsonb, 
  p.price, 
  p.stock_quantity
FROM 
  public.products p
WHERE 
  NOT EXISTS (
    SELECT 1 
    FROM public.product_variants pv 
    WHERE pv.product_id = p.id
  );

-- Create a trigger function to update the updated_at column if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger for product_variants if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_product_variants_updated_at'
  ) THEN
    CREATE TRIGGER update_product_variants_updated_at
    BEFORE UPDATE ON public.product_variants
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Create product_options table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.product_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  values TEXT[] NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Add support for Asian countries in the addresses table
DO $$
BEGIN
  -- Check if the country column exists in the addresses table
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'addresses' AND column_name = 'country'
  ) THEN
    -- Add a comment to the country column to indicate support for Asian countries
    COMMENT ON COLUMN addresses.country IS 'Supports all countries including Asian countries like China, Japan, South Korea, India, Singapore, etc.';
  END IF;
END $$;

-- Add translations table for multilingual support
CREATE TABLE IF NOT EXISTS public.translations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  language_code TEXT NOT NULL,
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(language_code, key)
);

-- Add Asian languages support
INSERT INTO public.translations (language_code, key, value)
VALUES
  ('zh', 'welcome_message', '欢迎来到 MinddShopp！'),
  ('ja', 'welcome_message', 'MinddShoppへようこそ！'),
  ('ko', 'welcome_message', 'MinddShopp에 오신 것을 환영합니다!'),
  ('hi', 'welcome_message', 'MinddShopp में आपका स्वागत है!'),
  ('th', 'welcome_message', 'ยินดีต้อนรับสู่ MinddShopp!'),
  ('vi', 'welcome_message', 'Chào mừng đến với MinddShopp!')
ON CONFLICT (language_code, key) DO NOTHING;

-- Add currency support for Asian countries
CREATE TABLE IF NOT EXISTS public.currency_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  currency_code TEXT NOT NULL UNIQUE,
  symbol TEXT NOT NULL,
  exchange_rate NUMERIC(15,6) NOT NULL, -- Increased precision to handle larger values
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Insert Asian currencies
INSERT INTO public.currency_settings (currency_code, symbol, exchange_rate, is_active)
VALUES
  ('CNY', '¥', 7.25, true),
  ('JPY', '¥', 150.45, true),
  ('KRW', '₩', 1350.75, true),
  ('INR', '₹', 83.20, true),
  ('SGD', 'S$', 1.35, true),
  ('THB', '฿', 35.80, true),
  ('MYR', 'RM', 4.65, true),
  ('IDR', 'Rp', 15750.00, true),
  ('PHP', '₱', 56.80, true),
  ('VND', '₫', 24850.00, true)
ON CONFLICT (currency_code) DO NOTHING;