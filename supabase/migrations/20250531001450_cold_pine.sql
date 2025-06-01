-- Update brand logos with actual image URLs
UPDATE brands SET logo_url = CASE name
  -- Clothing/Fashion Brands
  WHEN 'Old Navy' THEN 'https://logo.clearbit.com/oldnavy.com'
  WHEN 'Forever 21' THEN 'https://logo.clearbit.com/forever21.com'
  WHEN 'Gap' THEN 'https://logo.clearbit.com/gap.com'
  WHEN 'American Eagle' THEN 'https://logo.clearbit.com/ae.com'
  WHEN 'H&M' THEN 'https://logo.clearbit.com/hm.com'
  WHEN 'Zara' THEN 'https://logo.clearbit.com/zara.com'
  WHEN 'Uniqlo' THEN 'https://logo.clearbit.com/uniqlo.com'
  
  -- Footwear Brands
  WHEN 'Skechers' THEN 'https://logo.clearbit.com/skechers.com'
  WHEN 'Converse' THEN 'https://logo.clearbit.com/converse.com'
  WHEN 'Vans' THEN 'https://logo.clearbit.com/vans.com'
  WHEN 'Nike' THEN 'https://logo.clearbit.com/nike.com'
  WHEN 'Adidas' THEN 'https://logo.clearbit.com/adidas.com'
  WHEN 'Puma' THEN 'https://logo.clearbit.com/puma.com'
  
  -- Jewelry Brands
  WHEN 'PAVOI' THEN 'https://logo.clearbit.com/pavoi.com'
  WHEN 'Mejuri' THEN 'https://logo.clearbit.com/mejuri.com'
  WHEN 'Gorjana' THEN 'https://logo.clearbit.com/gorjana.com'
  WHEN 'BaubleBar' THEN 'https://logo.clearbit.com/baublebar.com'
  
  -- Beauty Brands
  WHEN 'e.l.f. Cosmetics' THEN 'https://logo.clearbit.com/elfcosmetics.com'
  WHEN 'NYX' THEN 'https://logo.clearbit.com/nyxcosmetics.com'
  WHEN 'The Ordinary' THEN 'https://logo.clearbit.com/theordinary.com'
  WHEN 'Maybelline' THEN 'https://logo.clearbit.com/maybelline.com'
  WHEN 'L''Oréal Paris' THEN 'https://logo.clearbit.com/loreal.com'
  
  -- Luxury Brands
  WHEN 'Louis Vuitton' THEN 'https://logo.clearbit.com/louisvuitton.com'
  WHEN 'Gucci' THEN 'https://logo.clearbit.com/gucci.com'
  WHEN 'Chanel' THEN 'https://logo.clearbit.com/chanel.com'
  WHEN 'Dior' THEN 'https://logo.clearbit.com/dior.com'
  WHEN 'Hermès' THEN 'https://logo.clearbit.com/hermes.com'
  WHEN 'Prada' THEN 'https://logo.clearbit.com/prada.com'
  WHEN 'Cartier' THEN 'https://logo.clearbit.com/cartier.com'
  WHEN 'Tiffany & Co.' THEN 'https://logo.clearbit.com/tiffany.com'
  ELSE logo_url
END;

-- Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';