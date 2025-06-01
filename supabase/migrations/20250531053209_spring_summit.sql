-- Update brand websites with actual URLs
UPDATE brands SET website = CASE name
  -- Clothing/Fashion Brands
  WHEN 'Old Navy' THEN 'https://oldnavy.com'
  WHEN 'Forever 21' THEN 'https://forever21.com'
  WHEN 'Gap' THEN 'https://gap.com'
  WHEN 'American Eagle' THEN 'https://ae.com'
  WHEN 'H&M' THEN 'https://hm.com'
  WHEN 'Zara' THEN 'https://zara.com'
  WHEN 'Uniqlo' THEN 'https://uniqlo.com'
  
  -- Footwear Brands
  WHEN 'Skechers' THEN 'https://skechers.com'
  WHEN 'Converse' THEN 'https://converse.com'
  WHEN 'Vans' THEN 'https://vans.com'
  WHEN 'Nike' THEN 'https://nike.com'
  WHEN 'Adidas' THEN 'https://adidas.com'
  WHEN 'Puma' THEN 'https://puma.com'
  
  -- Jewelry Brands
  WHEN 'PAVOI' THEN 'https://pavoi.com'
  WHEN 'Mejuri' THEN 'https://mejuri.com'
  WHEN 'Gorjana' THEN 'https://gorjana.com'
  WHEN 'BaubleBar' THEN 'https://baublebar.com'
  
  -- Beauty Brands
  WHEN 'e.l.f. Cosmetics' THEN 'https://elfcosmetics.com'
  WHEN 'NYX' THEN 'https://nyxcosmetics.com'
  WHEN 'The Ordinary' THEN 'https://theordinary.com'
  WHEN 'Maybelline' THEN 'https://maybelline.com'
  WHEN 'L''Oréal Paris' THEN 'https://loreal.com'
  
  -- Luxury Brands
  WHEN 'Louis Vuitton' THEN 'https://louisvuitton.com'
  WHEN 'Gucci' THEN 'https://gucci.com'
  WHEN 'Chanel' THEN 'https://chanel.com'
  WHEN 'Dior' THEN 'https://dior.com'
  WHEN 'Hermès' THEN 'https://hermes.com'
  WHEN 'Prada' THEN 'https://prada.com'
  WHEN 'Cartier' THEN 'https://cartier.com'
  WHEN 'Tiffany & Co.' THEN 'https://tiffany.com'
  
  -- Luxury Footwear Brands
  WHEN 'Christian Louboutin' THEN 'https://christianlouboutin.com'
  WHEN 'Jimmy Choo' THEN 'https://jimmychoo.com'
  WHEN 'Manolo Blahnik' THEN 'https://manoloblahnik.com'
  
  -- Luxury Jewelry Brands
  WHEN 'Bulgari' THEN 'https://bulgari.com'
  WHEN 'Van Cleef & Arpels' THEN 'https://vancleefarpels.com'
  WHEN 'Chopard' THEN 'https://chopard.com'
  
  -- Luxury Beauty Brands
  WHEN 'La Mer' THEN 'https://lamer.com'
  WHEN 'Estée Lauder' THEN 'https://esteelauder.com'
  WHEN 'Dior Beauty' THEN 'https://dior.com/beauty'
  WHEN 'Chanel Beauty' THEN 'https://chanel.com/beauty'
  
  -- Retail Chains
  WHEN 'Target' THEN 'https://target.com'
  WHEN 'Walmart' THEN 'https://walmart.com'
  WHEN 'Macy''s' THEN 'https://macys.com'
  WHEN 'Nordstrom' THEN 'https://nordstrom.com'
  
  ELSE website
END
WHERE website IS NULL OR website = '';

-- For any remaining brands without websites, generate a default website
UPDATE brands 
SET website = LOWER(REGEXP_REPLACE(name, '[^a-zA-Z0-9]', '')) || '.com'
WHERE website IS NULL OR website = '';

-- Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';