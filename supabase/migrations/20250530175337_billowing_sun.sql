-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
('product-images', 'product-images', true),
('resume-uploads', 'resume-uploads', false);

-- Add storage policies
CREATE POLICY "Public Access to Product Images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated Users Can Upload Product Images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'product-images' AND
  (EXISTS (
    SELECT 1 FROM admin_users
    WHERE user_id = auth.uid()
  ))
);

CREATE POLICY "Admin Users Can Delete Product Images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'product-images' AND
  (EXISTS (
    SELECT 1 FROM admin_users
    WHERE user_id = auth.uid()
  ))
);

CREATE POLICY "Job Applicants Can Upload Resumes"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'resume-uploads' AND
  auth.uid() IS NOT NULL
);

CREATE POLICY "Users Can Access Their Own Resumes"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'resume-uploads' AND
  (auth.uid() = owner OR
   EXISTS (
     SELECT 1 FROM admin_users
     WHERE user_id = auth.uid()
   ))
);

-- Insert sample products for each category
-- Fashion Category
INSERT INTO products (name, slug, brand_id, category_id, description, price, stock_quantity, is_visible, is_featured)
SELECT 
  'Fashion Product ' || generate_series(1, 50),
  'fashion-product-' || generate_series(1, 50),
  (SELECT id FROM brands WHERE category = 'fashion' ORDER BY RANDOM() LIMIT 1),
  (SELECT id FROM categories WHERE name = 'Fashion' LIMIT 1),
  'High-quality fashion item with premium materials and modern design.',
  (random() * 500 + 100)::numeric(10,2),
  floor(random() * 100 + 10)::int,
  true,
  random() < 0.2;

-- Beauty Category
INSERT INTO products (name, slug, brand_id, category_id, description, price, stock_quantity, is_visible, is_featured)
SELECT 
  'Beauty Product ' || generate_series(1, 50),
  'beauty-product-' || generate_series(1, 50),
  (SELECT id FROM brands WHERE category = 'beauty' ORDER BY RANDOM() LIMIT 1),
  (SELECT id FROM categories WHERE name = 'Beauty' LIMIT 1),
  'Premium beauty product for your skincare routine.',
  (random() * 200 + 50)::numeric(10,2),
  floor(random() * 100 + 10)::int,
  true,
  random() < 0.2;

-- Electronics Category
INSERT INTO products (name, slug, brand_id, category_id, description, price, stock_quantity, is_visible, is_featured)
SELECT 
  'Electronics Product ' || generate_series(1, 50),
  'electronics-product-' || generate_series(1, 50),
  (SELECT id FROM brands WHERE category = 'electronics' ORDER BY RANDOM() LIMIT 1),
  (SELECT id FROM categories WHERE name = 'Electronics' LIMIT 1),
  'High-tech electronic device with advanced features.',
  (random() * 1000 + 200)::numeric(10,2),
  floor(random() * 50 + 5)::int,
  true,
  random() < 0.2;

-- Home Category
INSERT INTO products (name, slug, brand_id, category_id, description, price, stock_quantity, is_visible, is_featured)
SELECT 
  'Home Product ' || generate_series(1, 50),
  'home-product-' || generate_series(1, 50),
  (SELECT id FROM brands WHERE category = 'home' ORDER BY RANDOM() LIMIT 1),
  (SELECT id FROM categories WHERE name = 'Home' LIMIT 1),
  'Stylish and functional home decor item.',
  (random() * 300 + 50)::numeric(10,2),
  floor(random() * 75 + 10)::int,
  true,
  random() < 0.2;

-- Sports Category
INSERT INTO products (name, slug, brand_id, category_id, description, price, stock_quantity, is_visible, is_featured)
SELECT 
  'Sports Product ' || generate_series(1, 50),
  'sports-product-' || generate_series(1, 50),
  (SELECT id FROM brands WHERE category = 'sports' ORDER BY RANDOM() LIMIT 1),
  (SELECT id FROM categories WHERE name = 'Sports' LIMIT 1),
  'High-performance sports equipment and gear.',
  (random() * 400 + 100)::numeric(10,2),
  floor(random() * 60 + 10)::int,
  true,
  random() < 0.2;

-- Luxury Category
INSERT INTO products (name, slug, brand_id, category_id, description, price, stock_quantity, is_visible, is_featured)
SELECT 
  'Luxury Product ' || generate_series(1, 50),
  'luxury-product-' || generate_series(1, 50),
  (SELECT id FROM brands WHERE category = 'luxury' ORDER BY RANDOM() LIMIT 1),
  (SELECT id FROM categories WHERE name = 'Luxury' LIMIT 1),
  'Exclusive luxury item crafted with the finest materials.',
  (random() * 5000 + 1000)::numeric(10,2),
  floor(random() * 25 + 5)::int,
  true,
  random() < 0.2;

-- Add sample product images
INSERT INTO product_images (product_id, url, alt_text, position)
SELECT 
  p.id,
  'https://picsum.photos/seed/' || p.id || '/800/600',
  p.name || ' image',
  1
FROM products p;