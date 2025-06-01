-- Add missing columns for all product types
ALTER TABLE products
-- Common fields
ADD COLUMN IF NOT EXISTS gender text CHECK (gender IN ('men', 'women', 'unisex', 'kids')),
ADD COLUMN IF NOT EXISTS is_returnable boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS discount_type text CHECK (discount_type IN ('percentage', 'fixed_amount')),
ADD COLUMN IF NOT EXISTS discount_value numeric(10,2),
ADD COLUMN IF NOT EXISTS final_price numeric(10,2),

-- Footwear specific
ADD COLUMN IF NOT EXISTS type text,
ADD COLUMN IF NOT EXISTS material text,
ADD COLUMN IF NOT EXISTS closure_type text,
ADD COLUMN IF NOT EXISTS sole_type text,
ADD COLUMN IF NOT EXISTS heel_height numeric(10,2),
ADD COLUMN IF NOT EXISTS insole_type text,

-- Clothing specific
ADD COLUMN IF NOT EXISTS fit_type text,
ADD COLUMN IF NOT EXISTS fabric_type text,
ADD COLUMN IF NOT EXISTS sleeve_length text,
ADD COLUMN IF NOT EXISTS neckline_type text,
ADD COLUMN IF NOT EXISTS pattern text,

-- Beauty specific
ADD COLUMN IF NOT EXISTS category_type text,
ADD COLUMN IF NOT EXISTS product_type text,
ADD COLUMN IF NOT EXISTS skin_types text[],
ADD COLUMN IF NOT EXISTS ingredients text,
ADD COLUMN IF NOT EXISTS usage_instructions text,
ADD COLUMN IF NOT EXISTS expiry_date timestamp with time zone,
ADD COLUMN IF NOT EXISTS weight numeric(10,2),
ADD COLUMN IF NOT EXISTS weight_unit text,
ADD COLUMN IF NOT EXISTS is_fragrance_free boolean,
ADD COLUMN IF NOT EXISTS is_organic boolean,
ADD COLUMN IF NOT EXISTS is_dermatologically_tested boolean,

-- Jewelry specific
ADD COLUMN IF NOT EXISTS jewelry_type text,
ADD COLUMN IF NOT EXISTS purity text,
ADD COLUMN IF NOT EXISTS gemstone_type text,
ADD COLUMN IF NOT EXISTS has_hallmark boolean,
ADD COLUMN IF NOT EXISTS allows_engraving boolean;

-- Create product_options table if not exists
CREATE TABLE IF NOT EXISTS product_options (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    product_id uuid REFERENCES products(id) ON DELETE CASCADE,
    name text NOT NULL,
    values text[] NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Create product_variants table if not exists
CREATE TABLE IF NOT EXISTS product_variants (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    product_id uuid REFERENCES products(id) ON DELETE CASCADE,
    sku text UNIQUE,
    barcode text,
    option_values jsonb NOT NULL,
    price numeric(10,2),
    compare_at_price numeric(10,2),
    cost_price numeric(10,2),
    weight numeric(10,2),
    stock_quantity integer DEFAULT 0,
    is_visible boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create storage bucket for product images if not exists
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'product-images');

-- Enable RLS
ALTER TABLE product_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

-- Add RLS policies
CREATE POLICY "Products are viewable by everyone"
ON products FOR SELECT
TO public
USING (is_visible = true);

CREATE POLICY "Products are editable by admins only"
ON products FOR ALL
TO public
USING (EXISTS (
    SELECT 1 FROM admin_users 
    WHERE admin_users.user_id = auth.uid()
));

-- Add triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_variants_updated_at
    BEFORE UPDATE ON product_variants
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();