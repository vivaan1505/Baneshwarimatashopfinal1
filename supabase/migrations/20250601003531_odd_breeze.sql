-- Create partner_services table
CREATE TABLE IF NOT EXISTS partner_services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  logo_url TEXT,
  website TEXT NOT NULL,
  booking_url TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  hours TEXT NOT NULL,
  service_type TEXT NOT NULL CHECK (service_type IN ('beauty', 'bridal', 'fashion', 'photography', 'venue', 'catering', 'other')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE partner_services ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Partner services are viewable by everyone"
ON partner_services FOR SELECT
TO public
USING (is_active = true);

CREATE POLICY "Partner services are editable by admins only"
ON partner_services FOR ALL
TO public
USING (
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.user_id = auth.uid()
  )
);

-- Create trigger for updated_at
CREATE TRIGGER update_partner_services_updated_at
BEFORE UPDATE ON partner_services
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Insert initial data for Zuzu Nails
INSERT INTO partner_services (
  name,
  description,
  logo_url,
  website,
  booking_url,
  address,
  phone,
  hours,
  service_type,
  is_active
) VALUES (
  'ZUZU NAILS',
  'Complete your bridal look with our exclusive nail care partner. ZUZU NAILS specializes in bridal manicures and nail art, ensuring you look perfect from head to toe on your special day.',
  'https://logo.clearbit.com/zuzunails.ca',
  'https://zuzunails.ca',
  'https://zuzunails.ca/appointments',
  '123 Beauty Lane, New York, NY 10001',
  '(555) 123-4567',
  'Mon-Sat: 9:00 AM - 7:00 PM',
  'bridal',
  true
)
ON CONFLICT DO NOTHING;