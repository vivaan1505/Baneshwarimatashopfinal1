-- Add origin and availability columns to brands table
ALTER TABLE brands 
ADD COLUMN origin TEXT,
ADD COLUMN availability TEXT,
ADD COLUMN homepage TEXT;

-- Insert luxury fashion brands
INSERT INTO brands (name, slug, origin, availability, homepage, logo_url, category, description, is_active) VALUES
('Gucci', 'gucci', 'Italy', 'Global', 'https://www.gucci.com', 'https://example.com/logos/gucci.png', 'luxury', 'Luxury fashion house known for innovative designs', true),
('Prada', 'prada', 'Italy', 'Global', 'https://www.prada.com', 'https://example.com/logos/prada.png', 'luxury', 'Iconic luxury fashion brand', true),
('Louis Vuitton', 'louis-vuitton', 'France', 'Global', 'https://www.louisvuitton.com', 'https://example.com/logos/louisvuitton.png', 'luxury', 'Historic luxury goods manufacturer', true),
('Chanel', 'chanel', 'France', 'Global', 'https://www.chanel.com', 'https://example.com/logos/chanel.png', 'luxury', 'Timeless luxury fashion and accessories', true),
('Hermès', 'hermes', 'France', 'Global', 'https://www.hermes.com', 'https://example.com/logos/hermes.png', 'luxury', 'Heritage luxury brand', true),
('Dior', 'dior', 'France', 'Global', 'https://www.dior.com', 'https://example.com/logos/dior.png', 'luxury', 'Haute couture and luxury goods', true),
('Balenciaga', 'balenciaga', 'France/Spain', 'Global', 'https://www.balenciaga.com', 'https://example.com/logos/balenciaga.png', 'luxury', 'Contemporary luxury fashion', true),
('Saint Laurent', 'saint-laurent', 'France', 'Global', 'https://www.ysl.com', 'https://example.com/logos/ysl.png', 'luxury', 'Modern luxury fashion house', true),
('Versace', 'versace', 'Italy', 'Global', 'https://www.versace.com', 'https://example.com/logos/versace.png', 'luxury', 'Bold luxury fashion designs', true),
('Valentino', 'valentino', 'Italy', 'Global', 'https://www.valentino.com', 'https://example.com/logos/valentino.png', 'luxury', 'Elegant luxury fashion', true),
('Celine', 'celine', 'France', 'Global', 'https://www.celine.com', 'https://example.com/logos/celine.png', 'luxury', 'Sophisticated luxury brand', true),
('Bottega Veneta', 'bottega-veneta', 'Italy', 'Global', 'https://www.bottegaveneta.com', 'https://example.com/logos/bottegaveneta.png', 'luxury', 'Luxury leather goods', true),
('Tom Ford', 'tom-ford', 'USA', 'Global', 'https://www.tomford.com', 'https://example.com/logos/tomford.png', 'luxury', 'Modern American luxury', true);

-- Insert luxury shoe designers
INSERT INTO brands (name, slug, origin, availability, homepage, logo_url, category, description, is_active) VALUES
('Christian Louboutin', 'christian-louboutin', 'France', 'Global', 'https://www.christianlouboutin.com', 'https://example.com/logos/christianlouboutin.png', 'luxury-shoes', 'Iconic luxury footwear', true),
('Manolo Blahnik', 'manolo-blahnik', 'UK', 'Global', 'https://www.manoloblahnik.com', 'https://example.com/logos/manoloblahnik.png', 'luxury-shoes', 'Elegant designer shoes', true),
('Jimmy Choo', 'jimmy-choo', 'UK', 'Global', 'https://www.jimmychoo.com', 'https://example.com/logos/jimmychoo.png', 'luxury-shoes', 'Luxury footwear and accessories', true),
('Giuseppe Zanotti', 'giuseppe-zanotti', 'Italy', 'Global', 'https://www.giuseppezanotti.com', 'https://example.com/logos/giuseppezanotti.png', 'luxury-shoes', 'Contemporary luxury shoes', true),
('Salvatore Ferragamo', 'ferragamo', 'Italy', 'Global', 'https://www.ferragamo.com', 'https://example.com/logos/ferragamo.png', 'luxury-shoes', 'Heritage luxury footwear', true),
('Roger Vivier', 'roger-vivier', 'France', 'Global', 'https://www.rogervivier.com', 'https://example.com/logos/rogervivier.png', 'luxury-shoes', 'Sophisticated shoe design', true),
('Berluti', 'berluti', 'France', 'Global', 'https://www.berluti.com', 'https://example.com/logos/berluti.png', 'luxury-shoes', 'Luxury mens shoes', true),
('Aquazzura', 'aquazzura', 'Italy', 'Global', 'https://www.aquazzura.com', 'https://example.com/logos/aquazzura.png', 'luxury-shoes', 'Modern luxury footwear', true);

-- Insert luxury jewelry brands
INSERT INTO brands (name, slug, origin, availability, homepage, logo_url, category, description, is_active) VALUES
('Cartier', 'cartier', 'France', 'Global', 'https://www.cartier.com', 'https://example.com/logos/cartier.png', 'luxury-jewelry', 'Fine jewelry and watches', true),
('Tiffany & Co.', 'tiffany', 'USA', 'Global', 'https://www.tiffany.com', 'https://example.com/logos/tiffany.png', 'luxury-jewelry', 'Iconic American jeweler', true),
('Bvlgari', 'bvlgari', 'Italy', 'Global', 'https://www.bulgari.com', 'https://example.com/logos/bvlgari.png', 'luxury-jewelry', 'Italian luxury jewelry', true),
('Van Cleef & Arpels', 'van-cleef-arpels', 'France', 'Global', 'https://www.vancleefarpels.com', 'https://example.com/logos/vancleefarpels.png', 'luxury-jewelry', 'High jewelry maison', true),
('Harry Winston', 'harry-winston', 'USA', 'Global', 'https://www.harrywinston.com', 'https://example.com/logos/harrywinston.png', 'luxury-jewelry', 'Exceptional diamonds', true),
('Chopard', 'chopard', 'Switzerland', 'Global', 'https://www.chopard.com', 'https://example.com/logos/chopard.png', 'luxury-jewelry', 'Swiss luxury jewelry', true),
('David Yurman', 'david-yurman', 'USA', 'North America', 'https://www.davidyurman.com', 'https://example.com/logos/davidyurman.png', 'luxury-jewelry', 'American jewelry design', true),
('Graff', 'graff', 'UK', 'Global', 'https://www.graff.com', 'https://example.com/logos/graff.png', 'luxury-jewelry', 'Exceptional diamonds', true);

-- Insert luxury multi-brand retailers
INSERT INTO brands (name, slug, origin, availability, homepage, logo_url, category, description, is_active) VALUES
('Farfetch', 'farfetch', 'UK/Global', 'Global', 'https://www.farfetch.com', 'https://example.com/logos/farfetch.png', 'luxury-retail', 'Global luxury marketplace', true),
('Net-a-Porter', 'net-a-porter', 'UK', 'Global', 'https://www.net-a-porter.com', 'https://example.com/logos/netaporter.png', 'luxury-retail', 'Luxury fashion retailer', true),
('Mytheresa', 'mytheresa', 'Germany', 'Global', 'https://www.mytheresa.com', 'https://example.com/logos/mytheresa.png', 'luxury-retail', 'Designer fashion retail', true),
('MatchesFashion', 'matches-fashion', 'UK', 'Global', 'https://www.matchesfashion.com', 'https://example.com/logos/matchesfashion.png', 'luxury-retail', 'Global luxury retail', true),
('24S', '24s', 'France', 'Global', 'https://www.24s.com', 'https://example.com/logos/24s.png', 'luxury-retail', 'LVMH luxury platform', true),
('Moda Operandi', 'moda-operandi', 'USA', 'Global', 'https://www.modaoperandi.com', 'https://example.com/logos/modaoperandi.png', 'luxury-retail', 'Designer fashion retail', true),
('SSENSE', 'ssense', 'Canada', 'Global', 'https://www.ssense.com', 'https://example.com/logos/ssense.png', 'luxury-retail', 'Contemporary fashion', true);

-- Insert fast fashion and mid-market brands
INSERT INTO brands (name, slug, origin, availability, homepage, logo_url, category, description, is_active) VALUES
('H&M', 'hm', 'Sweden', 'Global', 'https://www.hm.com', 'https://example.com/logos/hm.png', 'fast-fashion', 'Affordable fashion', true),
('Zara', 'zara', 'Spain', 'Global', 'https://www.zara.com', 'https://example.com/logos/zara.png', 'fast-fashion', 'Contemporary fashion', true),
('Uniqlo', 'uniqlo', 'Japan', 'Global', 'https://www.uniqlo.com', 'https://example.com/logos/uniqlo.png', 'fast-fashion', 'Essential clothing', true),
('Mango', 'mango', 'Spain', 'Global', 'https://shop.mango.com', 'https://example.com/logos/mango.png', 'fast-fashion', 'Mediterranean style', true),
('Gap', 'gap', 'USA', 'Global', 'https://www.gap.com', 'https://example.com/logos/gap.png', 'fast-fashion', 'American casual wear', true);

-- Insert footwear retailers
INSERT INTO brands (name, slug, origin, availability, homepage, logo_url, category, description, is_active) VALUES
('ALDO', 'aldo', 'Canada', 'Global', 'https://www.aldoshoes.com', 'https://example.com/logos/aldo.png', 'footwear', 'Fashion footwear', true),
('DSW', 'dsw', 'USA', 'USA, Canada', 'https://www.dsw.com', 'https://example.com/logos/dsw.png', 'footwear', 'Designer shoe warehouse', true),
('Steve Madden', 'steve-madden', 'USA', 'Global', 'https://www.stevemadden.com', 'https://example.com/logos/stevemadden.png', 'footwear', 'Contemporary footwear', true),
('Clarks', 'clarks', 'UK', 'Global', 'https://www.clarksusa.com', 'https://example.com/logos/clarks.png', 'footwear', 'Classic comfort shoes', true);

-- Create sample coupons for each brand
INSERT INTO coupons (code, brand_id, description, discount_type, discount_value, minimum_purchase, usage_limit, starts_at, expires_at, is_active)
SELECT
  'WELCOME' || REPLACE(UPPER(b.name), ' ', '') || '25',
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
WHERE b.is_active = true;