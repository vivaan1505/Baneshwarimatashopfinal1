-- Create newsletter_subscribers table if it doesn't exist
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  first_name TEXT,
  last_name TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed')),
  tags TEXT[],
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  subscribed_at TIMESTAMPTZ DEFAULT now()
);

-- Create newsletters table if it doesn't exist
CREATE TABLE IF NOT EXISTS newsletters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'scheduled')),
  sent_at TIMESTAMPTZ,
  scheduled_for TIMESTAMPTZ,
  recipient_count INTEGER DEFAULT 0,
  open_count INTEGER DEFAULT 0,
  click_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create newsletter_templates table if it doesn't exist
CREATE TABLE IF NOT EXISTS newsletter_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create updated_at trigger for newsletters if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_newsletters_updated_at'
  ) THEN
    CREATE TRIGGER update_newsletters_updated_at
    BEFORE UPDATE ON newsletters
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Insert sample newsletter templates
INSERT INTO newsletter_templates (name, content)
VALUES 
('Welcome Email', '<h1>Welcome to MinddShopp!</h1><p>Thank you for subscribing to our newsletter. We''re excited to share our latest products, exclusive offers, and style tips with you.</p><p>As a welcome gift, use code <strong>WELCOME10</strong> for 10% off your first purchase.</p><p>Happy shopping!</p><p>The MinddShopp Team</p>'),
('Monthly Newsletter', '<h1>This Month at MinddShopp</h1><p>Hello [First Name],</p><p>Check out our latest arrivals and exclusive offers this month:</p><ul><li>New summer collection now available</li><li>Exclusive discounts for subscribers</li><li>Style guide: Summer essentials</li></ul><p>Shop now and enjoy free shipping on orders over $75.</p><p>Best regards,<br>The MinddShopp Team</p>'),
('Sale Announcement', '<h1>Special Sale: Up to 50% Off!</h1><p>Dear [First Name],</p><p>Our seasonal sale has started! Enjoy discounts of up to 50% on selected items across all categories.</p><p>Don''t miss out on these amazing deals - sale ends Sunday!</p><p><a href="https://www.minddshopp.com/sale" style="background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block; margin-top: 10px;">Shop Now</a></p>');

-- Insert sample subscribers (only if the table is empty)
INSERT INTO newsletter_subscribers (email, first_name, last_name, status, tags, subscribed_at)
SELECT 
  'john.smith@example.com', 'John', 'Smith', 'active', ARRAY['VIP', 'New Customer'], NOW() - INTERVAL '30 days'
WHERE NOT EXISTS (SELECT 1 FROM newsletter_subscribers);

INSERT INTO newsletter_subscribers (email, first_name, last_name, status, tags, subscribed_at)
SELECT 
  'emily.johnson@example.com', 'Emily', 'Johnson', 'active', ARRAY['Promotion'], NOW() - INTERVAL '25 days'
WHERE NOT EXISTS (SELECT 1 FROM newsletter_subscribers WHERE email = 'emily.johnson@example.com');

INSERT INTO newsletter_subscribers (email, first_name, last_name, status, tags, subscribed_at)
SELECT 
  'michael.brown@example.com', 'Michael', 'Brown', 'active', ARRAY['Product Updates'], NOW() - INTERVAL '20 days'
WHERE NOT EXISTS (SELECT 1 FROM newsletter_subscribers WHERE email = 'michael.brown@example.com');

INSERT INTO newsletter_subscribers (email, first_name, last_name, status, tags, subscribed_at)
SELECT 
  'sarah.wilson@example.com', 'Sarah', 'Wilson', 'unsubscribed', ARRAY['VIP'], NOW() - INTERVAL '15 days'
WHERE NOT EXISTS (SELECT 1 FROM newsletter_subscribers WHERE email = 'sarah.wilson@example.com');

INSERT INTO newsletter_subscribers (email, first_name, last_name, status, tags, subscribed_at)
SELECT 
  'david.lee@example.com', 'David', 'Lee', 'active', ARRAY['Blog'], NOW() - INTERVAL '10 days'
WHERE NOT EXISTS (SELECT 1 FROM newsletter_subscribers WHERE email = 'david.lee@example.com');

-- Insert sample newsletter
INSERT INTO newsletters (subject, content, status, sent_at, recipient_count, open_count, click_count, created_at)
SELECT 
  'Welcome to MinddShopp - Your Luxury Fashion Destination', 
  '<h1>Welcome to MinddShopp!</h1><p>Thank you for subscribing to our newsletter. We''re excited to share our latest products, exclusive offers, and style tips with you.</p><p>As a welcome gift, use code <strong>WELCOME10</strong> for 10% off your first purchase.</p><p>Happy shopping!</p><p>The MinddShopp Team</p>', 
  'sent', 
  NOW() - INTERVAL '7 days', 
  5, 
  3, 
  2, 
  NOW() - INTERVAL '7 days'
WHERE NOT EXISTS (SELECT 1 FROM newsletters);

INSERT INTO newsletters (subject, content, status, created_at)
SELECT 
  'Summer Collection 2025 - Now Available!', 
  '<h1>Summer Collection 2025</h1><p>Dear Subscriber,</p><p>Our new summer collection has arrived! Discover the latest trends in fashion, footwear, and accessories.</p><p>Shop now and enjoy free shipping on orders over $75.</p><p>Best regards,<br>The MinddShopp Team</p>', 
  'draft', 
  NOW() - INTERVAL '2 days'
WHERE NOT EXISTS (SELECT 1 FROM newsletters WHERE subject = 'Summer Collection 2025 - Now Available!');