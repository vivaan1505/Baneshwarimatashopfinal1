-- Add origin and availability columns to brands table if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'brands' AND column_name = 'origin') THEN
        ALTER TABLE brands ADD COLUMN origin TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'brands' AND column_name = 'availability') THEN
        ALTER TABLE brands ADD COLUMN availability TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'brands' AND column_name = 'homepage') THEN
        ALTER TABLE brands ADD COLUMN homepage TEXT;
    END IF;
END $$;

-- Function to safely insert brands
CREATE OR REPLACE FUNCTION insert_brand_if_not_exists(
    p_name TEXT,
    p_slug TEXT,
    p_origin TEXT,
    p_availability TEXT,
    p_homepage TEXT,
    p_logo_url TEXT,
    p_category TEXT,
    p_description TEXT
) RETURNS UUID AS $$
DECLARE
    brand_id UUID;
BEGIN
    SELECT id INTO brand_id FROM brands WHERE slug = p_slug;
    IF NOT FOUND THEN
        INSERT INTO brands (name, slug, origin, availability, homepage, logo_url, category, description, is_active)
        VALUES (p_name, p_slug, p_origin, p_availability, p_homepage, p_logo_url, p_category, p_description, true)
        RETURNING id INTO brand_id;
    END IF;
    RETURN brand_id;
END;
$$ LANGUAGE plpgsql;

-- Insert luxury fashion brands
SELECT insert_brand_if_not_exists(
    'Gucci', 'gucci', 'Italy', 'Global', 'https://www.gucci.com',
    'https://example.com/logos/gucci.png', 'luxury', 'Luxury fashion house known for innovative designs'
);

SELECT insert_brand_if_not_exists(
    'Prada', 'prada', 'Italy', 'Global', 'https://www.prada.com',
    'https://example.com/logos/prada.png', 'luxury', 'Iconic luxury fashion brand'
);

-- Continue with all other brands...
SELECT insert_brand_if_not_exists(
    'Louis Vuitton', 'louis-vuitton', 'France', 'Global', 'https://www.louisvuitton.com',
    'https://example.com/logos/louisvuitton.png', 'luxury', 'Historic luxury goods manufacturer'
);

-- Add remaining luxury fashion brands
SELECT insert_brand_if_not_exists(
    'Chanel', 'chanel', 'France', 'Global', 'https://www.chanel.com',
    'https://example.com/logos/chanel.png', 'luxury', 'Timeless luxury fashion and accessories'
);

-- Luxury shoe designers
SELECT insert_brand_if_not_exists(
    'Christian Louboutin', 'christian-louboutin', 'France', 'Global', 'https://www.christianlouboutin.com',
    'https://example.com/logos/christianlouboutin.png', 'luxury-shoes', 'Iconic luxury footwear'
);

SELECT insert_brand_if_not_exists(
    'Manolo Blahnik', 'manolo-blahnik', 'UK', 'Global', 'https://www.manoloblahnik.com',
    'https://example.com/logos/manoloblahnik.png', 'luxury-shoes', 'Elegant designer shoes'
);

-- Luxury jewelry brands
SELECT insert_brand_if_not_exists(
    'Cartier', 'cartier', 'France', 'Global', 'https://www.cartier.com',
    'https://example.com/logos/cartier.png', 'luxury-jewelry', 'Fine jewelry and watches'
);

SELECT insert_brand_if_not_exists(
    'Tiffany & Co.', 'tiffany', 'USA', 'Global', 'https://www.tiffany.com',
    'https://example.com/logos/tiffany.png', 'luxury-jewelry', 'Iconic American jeweler'
);

-- Luxury multi-brand retailers
SELECT insert_brand_if_not_exists(
    'Farfetch', 'farfetch', 'UK/Global', 'Global', 'https://www.farfetch.com',
    'https://example.com/logos/farfetch.png', 'luxury-retail', 'Global luxury marketplace'
);

SELECT insert_brand_if_not_exists(
    'Net-a-Porter', 'net-a-porter', 'UK', 'Global', 'https://www.net-a-porter.com',
    'https://example.com/logos/netaporter.png', 'luxury-retail', 'Luxury fashion retailer'
);

-- Fast fashion brands
SELECT insert_brand_if_not_exists(
    'H&M', 'hm', 'Sweden', 'Global', 'https://www.hm.com',
    'https://example.com/logos/hm.png', 'fast-fashion', 'Affordable fashion'
);

SELECT insert_brand_if_not_exists(
    'Zara', 'zara', 'Spain', 'Global', 'https://www.zara.com',
    'https://example.com/logos/zara.png', 'fast-fashion', 'Contemporary fashion'
);

-- Footwear retailers
SELECT insert_brand_if_not_exists(
    'ALDO', 'aldo', 'Canada', 'Global', 'https://www.aldoshoes.com',
    'https://example.com/logos/aldo.png', 'footwear', 'Fashion footwear'
);

SELECT insert_brand_if_not_exists(
    'DSW', 'dsw', 'USA', 'USA, Canada', 'https://www.dsw.com',
    'https://example.com/logos/dsw.png', 'footwear', 'Designer shoe warehouse'
);

-- Create welcome coupons for each brand
INSERT INTO coupons (code, brand_id, description, discount_type, discount_value, minimum_purchase, usage_limit, starts_at, expires_at, is_active)
SELECT
    'WELCOME_' || REPLACE(UPPER(b.slug), '-', '') || '_25',
    b.id,
    'Welcome offer for ' || b.name || ' - Get 25% off your first purchase',
    'percentage',
    25.00,
    CASE 
        WHEN b.category LIKE 'luxury%' THEN 1000.00
        WHEN b.category = 'footwear' THEN 100.00
        ELSE 50.00
    END,
    1000,
    NOW(),
    NOW() + INTERVAL '30 days',
    true
FROM brands b
WHERE b.is_active = true
ON CONFLICT (code) DO NOTHING;