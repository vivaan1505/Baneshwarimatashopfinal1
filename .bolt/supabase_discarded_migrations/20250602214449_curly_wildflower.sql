-- Create site_branding table
CREATE TABLE IF NOT EXISTS site_branding (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  url TEXT NOT NULL,
  theme TEXT NOT NULL DEFAULT 'default',
  color_scheme TEXT NOT NULL DEFAULT 'default',
  is_active BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add comments to table and columns
COMMENT ON TABLE site_branding IS 'Stores site branding assets like logos and favicons with theme and color scheme associations';
COMMENT ON COLUMN site_branding.name IS 'Descriptive name for the asset';
COMMENT ON COLUMN site_branding.type IS 'Type of asset (logo or favicon)';
COMMENT ON COLUMN site_branding.url IS 'URL to the asset file';
COMMENT ON COLUMN site_branding.theme IS 'Associated theme (default, christmas, summer, etc.)';
COMMENT ON COLUMN site_branding.color_scheme IS 'Associated color scheme (default, blue, green, etc.)';
COMMENT ON COLUMN site_branding.is_active IS 'Whether this asset is currently active';

-- Enable Row Level Security
ALTER TABLE site_branding ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Anyone can view site branding
CREATE POLICY "Anyone can view site branding" 
  ON site_branding
  FOR SELECT
  TO public
  USING (true);

-- Authenticated users can insert site branding
CREATE POLICY "Authenticated users can insert site branding" 
  ON site_branding
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated users can update site branding
CREATE POLICY "Authenticated users can update site branding" 
  ON site_branding
  FOR UPDATE
  TO authenticated
  USING (true);

-- Authenticated users can delete site branding
CREATE POLICY "Authenticated users can delete site branding" 
  ON site_branding
  FOR DELETE
  TO authenticated
  USING (true);