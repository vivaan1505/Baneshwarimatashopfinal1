-- This migration fixes the relationship between order_items and products
-- by ensuring the correct path through product_variants

-- First, ensure the product_variants table exists with the correct structure
CREATE TABLE IF NOT EXISTS public.product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  sku TEXT,
  barcode TEXT,
  option_values JSONB NOT NULL,
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
    CREATE UNIQUE INDEX product_variants_sku_key ON public.product_variants(sku);
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
  )
AND p.sku IS NOT NULL;

-- Create a trigger function to update the updated_at column
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