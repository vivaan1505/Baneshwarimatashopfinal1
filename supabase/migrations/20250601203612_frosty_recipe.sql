-- Create site_settings table if it doesn't exist
CREATE TABLE IF NOT EXISTS site_settings (
  id TEXT PRIMARY KEY,
  site_wide_discount NUMERIC(5,2) DEFAULT 0,
  site_wide_discount_active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Insert default settings
INSERT INTO site_settings (id, site_wide_discount, site_wide_discount_active)
VALUES ('global', 0, false)
ON CONFLICT (id) DO NOTHING;

-- Create updated_at trigger for site_settings if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_site_settings_updated_at'
  ) THEN
    CREATE TRIGGER update_site_settings_updated_at
    BEFORE UPDATE ON site_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Create function to calculate discounted price
CREATE OR REPLACE FUNCTION calculate_discounted_price()
RETURNS TRIGGER AS $$
BEGIN
  -- If a site-wide discount is active and no specific discount is set for this product
  -- (i.e., compare_at_price is NULL), apply the site-wide discount
  IF NEW.compare_at_price IS NULL THEN
    SELECT site_wide_discount, site_wide_discount_active 
    INTO NEW.site_wide_discount, NEW.site_wide_discount_active
    FROM site_settings 
    WHERE id = 'global';
    
    IF NEW.site_wide_discount_active AND NEW.site_wide_discount > 0 THEN
      -- Store original price in compare_at_price
      NEW.compare_at_price := NEW.price;
      -- Apply discount to price
      NEW.price := ROUND(NEW.price * (1 - NEW.site_wide_discount / 100), 2);
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add site_wide_discount and site_wide_discount_active columns to products table if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'site_wide_discount'
  ) THEN
    ALTER TABLE products ADD COLUMN site_wide_discount NUMERIC(5,2);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'site_wide_discount_active'
  ) THEN
    ALTER TABLE products ADD COLUMN site_wide_discount_active BOOLEAN;
  END IF;
END $$;

-- Create trigger to apply discount on product insert if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'apply_site_wide_discount_on_insert'
  ) THEN
    CREATE TRIGGER apply_site_wide_discount_on_insert
    BEFORE INSERT ON products
    FOR EACH ROW
    EXECUTE FUNCTION calculate_discounted_price();
  END IF;
END $$;