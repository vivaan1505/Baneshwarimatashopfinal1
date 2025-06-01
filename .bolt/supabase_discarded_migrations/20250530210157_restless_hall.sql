-- Add brands migration
DO $$ 
BEGIN
  -- First, drop foreign key constraints
  ALTER TABLE coupons DROP CONSTRAINT IF EXISTS coupons_brand_id_fkey;
  ALTER TABLE products DROP CONSTRAINT IF EXISTS products_brand_id_fkey;

  -- Delete existing brands
  DELETE FROM brands;

  -- Clothing/Fashion Brands (Mainstream)
  INSERT INTO brands (name, slug, category, is_active) VALUES
    ('Old Navy', 'old-navy', 'clothing', true),
    ('Forever 21', 'forever-21', 'clothing', true),
    ('Gap', 'gap', 'clothing', true),
    ('American Eagle', 'american-eagle', 'clothing', true),
    ('Target', 'target', 'clothing', true),
    ('H&M', 'h-and-m', 'clothing', true),
    ('Zara', 'zara', 'clothing', true),
    ('Uniqlo', 'uniqlo', 'clothing', true),
    ('Shein', 'shein', 'clothing', true),
    ('Fashion Nova', 'fashion-nova', 'clothing', true),
    ('Boohoo', 'boohoo', 'clothing', true),
    ('Mango', 'mango', 'clothing', true);

  -- Clothing/Fashion Brands (Luxury)
  INSERT INTO brands (name, slug, category, is_active) VALUES
    ('Louis Vuitton', 'louis-vuitton', 'clothing', true),
    ('Gucci', 'gucci', 'clothing', true),
    ('Chanel', 'chanel', 'clothing', true),
    ('Dior', 'dior', 'clothing', true),
    ('Saint Laurent', 'saint-laurent', 'clothing', true),
    ('Hermès', 'hermes', 'clothing', true),
    ('Prada', 'prada', 'clothing', true),
    ('Versace', 'versace', 'clothing', true);

  -- Footwear Brands (Mainstream)
  INSERT INTO brands (name, slug, category, is_active) VALUES
    ('Skechers', 'skechers', 'footwear', true),
    ('Converse', 'converse', 'footwear', true),
    ('Crocs', 'crocs', 'footwear', true),
    ('Vans', 'vans', 'footwear', true),
    ('Clarks', 'clarks', 'footwear', true),
    ('Aldo', 'aldo', 'footwear', true),
    ('Puma', 'puma', 'footwear', true),
    ('Adidas', 'adidas', 'footwear', true),
    ('Nike', 'nike', 'footwear', true),
    ('Reebok', 'reebok', 'footwear', true),
    ('New Balance', 'new-balance', 'footwear', true);

  -- Footwear Brands (Luxury)
  INSERT INTO brands (name, slug, category, is_active) VALUES
    ('Christian Louboutin', 'christian-louboutin', 'footwear', true),
    ('Jimmy Choo', 'jimmy-choo', 'footwear', true),
    ('Manolo Blahnik', 'manolo-blahnik', 'footwear', true),
    ('Giuseppe Zanotti', 'giuseppe-zanotti', 'footwear', true),
    ('Salvatore Ferragamo', 'salvatore-ferragamo', 'footwear', true);

  -- Jewelry Brands (Mainstream)
  INSERT INTO brands (name, slug, category, is_active) VALUES
    ('PAVOI', 'pavoi', 'jewelry', true),
    ('BaubleBar', 'baublebar', 'jewelry', true),
    ('Gorjana', 'gorjana', 'jewelry', true),
    ('Mejuri', 'mejuri', 'jewelry', true),
    ('Pandora', 'pandora', 'jewelry', true),
    ('Swarovski', 'swarovski', 'jewelry', true);

  -- Jewelry Brands (Luxury)
  INSERT INTO brands (name, slug, category, is_active) VALUES
    ('Tiffany & Co.', 'tiffany-and-co', 'jewelry', true),
    ('Cartier', 'cartier', 'jewelry', true),
    ('Bulgari', 'bulgari', 'jewelry', true),
    ('Van Cleef & Arpels', 'van-cleef-arpels', 'jewelry', true),
    ('Chopard', 'chopard', 'jewelry', true),
    ('Harry Winston', 'harry-winston', 'jewelry', true);

  -- Beauty Brands (Mainstream)
  INSERT INTO brands (name, slug, category, is_active) VALUES
    ('e.l.f. Cosmetics', 'elf-cosmetics', 'beauty', true),
    ('NYX', 'nyx', 'beauty', true),
    ('Wet n Wild', 'wet-n-wild', 'beauty', true),
    ('The Ordinary', 'the-ordinary', 'beauty', true),
    ('Maybelline', 'maybelline', 'beauty', true),
    ('L''Oréal Paris', 'loreal-paris', 'beauty', true),
    ('Garnier', 'garnier', 'beauty', true),
    ('Nivea', 'nivea', 'beauty', true);

  -- Beauty Brands (Luxury)
  INSERT INTO brands (name, slug, category, is_active) VALUES
    ('La Mer', 'la-mer', 'beauty', true),
    ('Estée Lauder', 'estee-lauder', 'beauty', true),
    ('Dior Beauty', 'dior-beauty', 'beauty', true),
    ('Chanel Beauty', 'chanel-beauty', 'beauty', true),
    ('Lancôme', 'lancome', 'beauty', true),
    ('SK-II', 'sk-ii', 'beauty', true);

  -- Re-add foreign key constraints
  ALTER TABLE coupons
    ADD CONSTRAINT coupons_brand_id_fkey
    FOREIGN KEY (brand_id)
    REFERENCES brands(id);

  ALTER TABLE products
    ADD CONSTRAINT products_brand_id_fkey
    FOREIGN KEY (brand_id)
    REFERENCES brands(id);
END $$;