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

-- Create index for faster lookups by type, theme, and color scheme (only if it doesn't exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_site_branding_type_theme_color'
  ) THEN
    CREATE INDEX idx_site_branding_type_theme_color ON site_branding (type, theme, color_scheme);
  END IF;
END $$;

-- Add constraint to ensure type is either logo or favicon (if not already exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'site_branding_type_check'
  ) THEN
    ALTER TABLE site_branding ADD CONSTRAINT site_branding_type_check 
      CHECK (type = ANY (ARRAY['logo', 'favicon']));
  END IF;
END $$;

-- Enable Row Level Security
ALTER TABLE site_branding ENABLE ROW LEVEL SECURITY;

-- Create policies (will be skipped if they already exist)
DROP POLICY IF EXISTS "Anyone can view site branding" ON site_branding;
CREATE POLICY "Anyone can view site branding" 
  ON site_branding
  FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert site branding" ON site_branding;
CREATE POLICY "Authenticated users can insert site branding" 
  ON site_branding
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update site branding" ON site_branding;
CREATE POLICY "Authenticated users can update site branding" 
  ON site_branding
  FOR UPDATE
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can delete site branding" ON site_branding;
CREATE POLICY "Authenticated users can delete site branding" 
  ON site_branding
  FOR DELETE
  TO authenticated
  USING (true);