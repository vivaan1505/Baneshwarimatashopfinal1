-- Drop any existing foreign key constraints
ALTER TABLE coupons DROP CONSTRAINT IF EXISTS coupons_brand_id_fkey;

-- Delete existing data from coupons table
DELETE FROM coupons;

-- Add brands for each category
INSERT INTO brands (name, slug, category, logo_url, is_active) VALUES
-- Clothing/Fashion Brands
('Old Navy', 'old-navy', 'clothing', 'https://example.com/logos/old-navy.png', true),
('Forever 21', 'forever-21', 'clothing', 'https://example.com/logos/forever-21.png', true),
('Gap', 'gap', 'clothing', 'https://example.com/logos/gap.png', true),
('American Eagle', 'american-eagle', 'clothing', 'https://example.com/logos/american-eagle.png', true),
('H&M', 'h-and-m', 'clothing', 'https://example.com/logos/h-and-m.png', true),
('Zara', 'zara', 'clothing', 'https://example.com/logos/zara.png', true),
('Uniqlo', 'uniqlo', 'clothing', 'https://example.com/logos/uniqlo.png', true),

-- Footwear Brands
('Skechers', 'skechers', 'footwear', 'https://example.com/logos/skechers.png', true),
('Converse', 'converse', 'footwear', 'https://example.com/logos/converse.png', true),
('Vans', 'vans', 'footwear', 'https://example.com/logos/vans.png', true),
('Nike', 'nike', 'footwear', 'https://example.com/logos/nike.png', true),
('Adidas', 'adidas', 'footwear', 'https://example.com/logos/adidas.png', true),
('Puma', 'puma', 'footwear', 'https://example.com/logos/puma.png', true),

-- Jewelry Brands
('PAVOI', 'pavoi', 'jewelry', 'https://example.com/logos/pavoi.png', true),
('Mejuri', 'mejuri', 'jewelry', 'https://example.com/logos/mejuri.png', true),
('Gorjana', 'gorjana', 'jewelry', 'https://example.com/logos/gorjana.png', true),
('BaubleBar', 'baublebar', 'jewelry', 'https://example.com/logos/baublebar.png', true),

-- Beauty Brands
('e.l.f. Cosmetics', 'elf-cosmetics', 'beauty', 'https://example.com/logos/elf.png', true),
('NYX', 'nyx', 'beauty', 'https://example.com/logos/nyx.png', true),
('The Ordinary', 'the-ordinary', 'beauty', 'https://example.com/logos/the-ordinary.png', true),
('Maybelline', 'maybelline', 'beauty', 'https://example.com/logos/maybelline.png', true),
('L''Oréal Paris', 'loreal-paris', 'beauty', 'https://example.com/logos/loreal.png', true),

-- Luxury Brands
('Louis Vuitton', 'louis-vuitton', 'luxury', 'https://example.com/logos/lv.png', true),
('Gucci', 'gucci', 'luxury', 'https://example.com/logos/gucci.png', true),
('Chanel', 'chanel', 'luxury', 'https://example.com/logos/chanel.png', true),
('Dior', 'dior', 'luxury', 'https://example.com/logos/dior.png', true),
('Hermès', 'hermes', 'luxury', 'https://example.com/logos/hermes.png', true),
('Prada', 'prada', 'luxury', 'https://example.com/logos/prada.png', true),
('Cartier', 'cartier', 'luxury', 'https://example.com/logos/cartier.png', true),
('Tiffany & Co.', 'tiffany', 'luxury', 'https://example.com/logos/tiffany.png', true);

-- Re-add foreign key constraint
ALTER TABLE coupons
  ADD CONSTRAINT coupons_brand_id_fkey
  FOREIGN KEY (brand_id)
  REFERENCES brands(id);

-- Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';