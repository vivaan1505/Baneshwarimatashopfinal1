/*
  # Site Branding Table

  1. New Tables
    - `site_branding` - Stores site branding assets like logos and favicons with theme and color scheme associations
      - `id` (uuid, primary key)
      - `name` (text, descriptive name for the asset)
      - `type` (text, logo or favicon)
      - `url` (text, URL to the asset file)
      - `theme` (text, associated theme like default, christmas, summer, etc.)
      - `color_scheme` (text, associated color scheme like default, blue, green, etc.)
      - `is_active` (boolean, whether this asset is currently active)
      - `created_at` (timestamptz)
  
  2. Security
    - Enable RLS on `site_branding` table
    - Add policies for public viewing and authenticated management
*/

-- Create site_branding table
CREATE TABLE IF NOT EXISTS site_branding (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL COMMENT 'Descriptive name for the asset',
  type TEXT NOT NULL COMMENT 'Type of asset (logo or favicon)',
  url TEXT NOT NULL COMMENT 'URL to the asset file',
  theme TEXT NOT NULL DEFAULT 'default' COMMENT 'Associated theme (default, christmas, summer, etc.)',
  color_scheme TEXT NOT NULL DEFAULT 'default' COMMENT 'Associated color scheme (default, blue, green, etc.)',
  is_active BOOLEAN NOT NULL DEFAULT false COMMENT 'Whether this asset is currently active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE site_branding IS 'Stores site branding assets like logos and favicons with theme and color scheme associations';

-- Create index for faster lookups by type, theme, and color scheme
CREATE INDEX idx_site_branding_type_theme_color ON site_branding (type, theme, color_scheme);

-- Add constraint to ensure type is either logo or favicon
ALTER TABLE site_branding ADD CONSTRAINT site_branding_type_check 
  CHECK (type = ANY (ARRAY['logo', 'favicon']));

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