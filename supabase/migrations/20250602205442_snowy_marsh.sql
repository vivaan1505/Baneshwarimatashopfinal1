/*
  # Theme Enhancements Migration

  1. New Tables
    - None (using existing site_branding table)
  
  2. Security
    - Ensure RLS is enabled on site_branding table
    - Add policies for site_branding table if not already present
  
  3. Changes
    - Add additional theme and color scheme options to site_branding table
*/

-- Add additional theme options to site_branding table if they don't exist
DO $$
BEGIN
  -- Check if the site_branding table exists
  IF EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'site_branding'
  ) THEN
    -- Add comment to the table if it doesn't exist
    IF NOT EXISTS (
      SELECT FROM pg_description 
      WHERE objoid = 'public.site_branding'::regclass 
      AND objsubid = 0
    ) THEN
      COMMENT ON TABLE site_branding IS 'Stores site branding assets like logos and favicons with theme and color scheme associations';
    END IF;
    
    -- Add comments to columns if they don't exist
    IF NOT EXISTS (
      SELECT FROM pg_description 
      WHERE objoid = 'public.site_branding'::regclass 
      AND objsubid = (
        SELECT attnum FROM pg_attribute 
        WHERE attrelid = 'public.site_branding'::regclass 
        AND attname = 'name'
      )
    ) THEN
      COMMENT ON COLUMN site_branding.name IS 'Descriptive name for the asset';
    END IF;
    
    IF NOT EXISTS (
      SELECT FROM pg_description 
      WHERE objoid = 'public.site_branding'::regclass 
      AND objsubid = (
        SELECT attnum FROM pg_attribute 
        WHERE attrelid = 'public.site_branding'::regclass 
        AND attname = 'type'
      )
    ) THEN
      COMMENT ON COLUMN site_branding.type IS 'Type of asset (logo or favicon)';
    END IF;
    
    IF NOT EXISTS (
      SELECT FROM pg_description 
      WHERE objoid = 'public.site_branding'::regclass 
      AND objsubid = (
        SELECT attnum FROM pg_attribute 
        WHERE attrelid = 'public.site_branding'::regclass 
        AND attname = 'url'
      )
    ) THEN
      COMMENT ON COLUMN site_branding.url IS 'URL to the asset file';
    END IF;
    
    IF NOT EXISTS (
      SELECT FROM pg_description 
      WHERE objoid = 'public.site_branding'::regclass 
      AND objsubid = (
        SELECT attnum FROM pg_attribute 
        WHERE attrelid = 'public.site_branding'::regclass 
        AND attname = 'theme'
      )
    ) THEN
      COMMENT ON COLUMN site_branding.theme IS 'Associated theme (default, christmas, summer, etc.)';
    END IF;
    
    IF NOT EXISTS (
      SELECT FROM pg_description 
      WHERE objoid = 'public.site_branding'::regclass 
      AND objsubid = (
        SELECT attnum FROM pg_attribute 
        WHERE attrelid = 'public.site_branding'::regclass 
        AND attname = 'color_scheme'
      )
    ) THEN
      COMMENT ON COLUMN site_branding.color_scheme IS 'Associated color scheme (default, blue, green, etc.)';
    END IF;
    
    IF NOT EXISTS (
      SELECT FROM pg_description 
      WHERE objoid = 'public.site_branding'::regclass 
      AND objsubid = (
        SELECT attnum FROM pg_attribute 
        WHERE attrelid = 'public.site_branding'::regclass 
        AND attname = 'is_active'
      )
    ) THEN
      COMMENT ON COLUMN site_branding.is_active IS 'Whether this asset is currently active';
    END IF;
    
    -- Create index for faster lookups by type, theme, and color scheme (only if it doesn't exist)
    IF NOT EXISTS (
      SELECT 1 FROM pg_indexes 
      WHERE indexname = 'idx_site_branding_type_theme_color'
    ) THEN
      CREATE INDEX idx_site_branding_type_theme_color ON site_branding (type, theme, color_scheme);
    END IF;
    
    -- Add constraint to ensure type is either logo or favicon (if not already exists)
    IF NOT EXISTS (
      SELECT 1 FROM pg_constraint 
      WHERE conname = 'site_branding_type_check'
    ) THEN
      ALTER TABLE site_branding ADD CONSTRAINT site_branding_type_check 
        CHECK (type = ANY (ARRAY['logo', 'favicon']));
    END IF;
    
    -- Enable Row Level Security if not already enabled
    IF NOT EXISTS (
      SELECT 1 FROM pg_tables 
      WHERE tablename = 'site_branding' 
      AND rowsecurity = true
    ) THEN
      ALTER TABLE site_branding ENABLE ROW LEVEL SECURITY;
    END IF;
    
    -- Create policies (will be skipped if they already exist)
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies 
      WHERE tablename = 'site_branding' 
      AND policyname = 'Anyone can view site branding'
    ) THEN
      CREATE POLICY "Anyone can view site branding" 
        ON site_branding
        FOR SELECT
        TO public
        USING (true);
    END IF;
    
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies 
      WHERE tablename = 'site_branding' 
      AND policyname = 'Authenticated users can insert site branding'
    ) THEN
      CREATE POLICY "Authenticated users can insert site branding" 
        ON site_branding
        FOR INSERT
        TO authenticated
        WITH CHECK (true);
    END IF;
    
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies 
      WHERE tablename = 'site_branding' 
      AND policyname = 'Authenticated users can update site branding'
    ) THEN
      CREATE POLICY "Authenticated users can update site branding" 
        ON site_branding
        FOR UPDATE
        TO authenticated
        USING (true);
    END IF;
    
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies 
      WHERE tablename = 'site_branding' 
      AND policyname = 'Authenticated users can delete site branding'
    ) THEN
      CREATE POLICY "Authenticated users can delete site branding" 
        ON site_branding
        FOR DELETE
        TO authenticated
        USING (true);
    END IF;
  END IF;
END $$;