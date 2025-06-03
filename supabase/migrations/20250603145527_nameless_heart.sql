/*
  # Add initial branding assets

  1. New Data
    - Add default logo and favicon entries to site_branding table
    - Set one logo and one favicon as active by default
*/

-- Insert default logo
INSERT INTO site_branding (name, type, url, theme, color_scheme, is_active)
VALUES 
  ('Default Logo', 'logo', '/minddshopp_logo_1_logo_512x512_transparent.png', 'default', 'default', true);

-- Insert default favicons in different sizes
INSERT INTO site_branding (name, type, url, theme, color_scheme, is_active)
VALUES 
  ('Default Favicon 16x16', 'favicon', '/minddshopp_logo_1_favicon_16x16.png', 'default', 'default', false),
  ('Default Favicon 32x32', 'favicon', '/minddshopp_logo_1_favicon_32x32.png', 'default', 'default', true),
  ('Default Favicon 48x48', 'favicon', '/minddshopp_logo_1_favicon_48x48.png', 'default', 'default', false);