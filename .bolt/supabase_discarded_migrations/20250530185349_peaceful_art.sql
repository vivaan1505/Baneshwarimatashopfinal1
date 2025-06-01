/*
  # Create jobs table and populate with initial data

  1. New Tables
    - `jobs`
      - `id` (uuid, primary key)
      - `title` (text)
      - `slug` (text, unique)
      - `department` (text)
      - `location` (text)
      - `type` (text)
      - `description` (text)
      - `requirements` (text[])
      - `responsibilities` (text[])
      - `status` (text)
      - `published_at` (timestamptz)
      - `expires_at` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `jobs` table
    - Add policy for public to view published jobs
    - Add policy for admins to manage all jobs

  3. Initial Data
    - Insert sample job listings
*/

-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  department text NOT NULL,
  location text NOT NULL,
  type text NOT NULL,
  description text NOT NULL,
  requirements text[] NOT NULL DEFAULT '{}',
  responsibilities text[] NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'draft',
  published_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT jobs_type_check CHECK (type IN ('full_time', 'part_time', 'contract', 'internship')),
  CONSTRAINT jobs_status_check CHECK (status IN ('draft', 'published', 'filled', 'expired'))
);

-- Enable RLS
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Published jobs are viewable by everyone" 
  ON jobs
  FOR SELECT
  TO public
  USING (status = 'published');

CREATE POLICY "Jobs are editable by admins only"
  ON jobs
  FOR ALL
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.user_id = auth.uid()
    )
  );

-- Insert initial job listings
INSERT INTO jobs (id, title, slug, department, location, type, description, requirements, responsibilities, status, published_at)
VALUES
  (
    'a1b2c3d4-e5f6-4789-8123-456789abcdef',
    'Senior Fashion Buyer',
    'senior-fashion-buyer',
    'Merchandising',
    'New York, NY',
    'full_time',
    'Lead the buying strategy for our luxury fashion categories.',
    ARRAY[
      'Bachelor''s degree in Fashion Merchandising or related field',
      '5+ years of experience in luxury fashion buying',
      'Strong analytical and negotiation skills',
      'Deep understanding of luxury market trends',
      'Experience with retail planning systems'
    ],
    ARRAY[
      'Develop and execute buying strategies',
      'Manage vendor relationships',
      'Analyze market trends',
      'Optimize inventory levels'
    ],
    'published',
    now()
  ),
  (
    'b1c2d3e4-f5a6-4890-9234-567890abcdef',
    'Luxury Merchandising Manager',
    'luxury-merchandising-manager',
    'Merchandising',
    'Los Angeles, CA',
    'full_time',
    'Join our merchandising team to curate and manage our luxury fashion collections.',
    ARRAY[
      'Bachelor''s degree in Fashion Merchandising or related field',
      'Minimum 3 years of experience in luxury retail merchandising',
      'Strong understanding of fashion trends and market analysis',
      'Excellent eye for design and product curation',
      'Experience with e-commerce platforms'
    ],
    ARRAY[
      'Curate product collections',
      'Monitor sales performance',
      'Coordinate with buyers',
      'Develop merchandising strategies'
    ],
    'published',
    now()
  ),
  (
    'c1d2e3f4-a5b6-4901-a345-67890abcdef0',
    'Digital Marketing Specialist',
    'digital-marketing-specialist',
    'Marketing',
    'Miami, FL',
    'full_time',
    'Drive our digital marketing initiatives for luxury fashion and beauty products.',
    ARRAY[
      'Bachelor''s degree in Marketing or related field',
      '3+ years of experience in digital marketing',
      'Proven track record in luxury brand marketing',
      'Experience with social media management and analytics',
      'Strong creative and analytical skills'
    ],
    ARRAY[
      'Develop digital marketing campaigns',
      'Manage social media presence',
      'Analyze marketing metrics',
      'Create content strategies'
    ],
    'published',
    now()
  );