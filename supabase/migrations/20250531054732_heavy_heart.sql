-- Create blog_categories table
CREATE TABLE IF NOT EXISTS blog_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT,
  author_id UUID REFERENCES auth.users(id),
  featured_image TEXT,
  status TEXT NOT NULL CHECK (status IN ('draft', 'published', 'archived')) DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create blog_post_categories junction table
CREATE TABLE IF NOT EXISTS blog_post_categories (
  post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES blog_categories(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (post_id, category_id)
);

-- Create pages table for CMS
CREATE TABLE IF NOT EXISTS pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  author_id UUID REFERENCES auth.users(id),
  status TEXT NOT NULL CHECK (status IN ('draft', 'published')) DEFAULT 'draft',
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create FAQ table
CREATE TABLE IF NOT EXISTS faqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT NOT NULL,
  position INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create chatbot_scripts table
CREATE TABLE IF NOT EXISTS chatbot_scripts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  section TEXT NOT NULL,
  trigger_keywords TEXT[] NOT NULL,
  response TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create chatbot_settings table
CREATE TABLE IF NOT EXISTS chatbot_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  welcome_message TEXT NOT NULL,
  fallback_message TEXT NOT NULL,
  is_enabled BOOLEAN DEFAULT true,
  auto_response_delay INTEGER DEFAULT 1000,
  human_handoff_threshold INTEGER DEFAULT 3,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create newsletter_subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  first_name TEXT,
  last_name TEXT,
  status TEXT NOT NULL CHECK (status IN ('active', 'unsubscribed')) DEFAULT 'active',
  tags TEXT[],
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  subscribed_at TIMESTAMPTZ DEFAULT now()
);

-- Create newsletters table
CREATE TABLE IF NOT EXISTS newsletters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('draft', 'sent', 'scheduled')) DEFAULT 'draft',
  sent_at TIMESTAMPTZ,
  scheduled_for TIMESTAMPTZ,
  recipient_count INTEGER DEFAULT 0,
  open_count INTEGER DEFAULT 0,
  click_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create newsletter_templates table
CREATE TABLE IF NOT EXISTS newsletter_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create storage bucket for blog images
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for blog images (with checks to avoid duplicates)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND schemaname = 'storage' 
        AND policyname = 'Blog images are publicly accessible'
    ) THEN
        CREATE POLICY "Blog images are publicly accessible"
        ON storage.objects FOR SELECT
        TO public
        USING (bucket_id = 'blog-images');
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND schemaname = 'storage' 
        AND policyname = 'Blog images are uploadable by admins'
    ) THEN
        CREATE POLICY "Blog images are uploadable by admins"
        ON storage.objects FOR INSERT
        TO public
        WITH CHECK (
          bucket_id = 'blog-images' AND
          EXISTS (
            SELECT 1 FROM admin_users
            WHERE admin_users.user_id = auth.uid()
          )
        );
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND schemaname = 'storage' 
        AND policyname = 'Blog images are deletable by admins'
    ) THEN
        CREATE POLICY "Blog images are deletable by admins"
        ON storage.objects FOR DELETE
        TO public
        USING (
          bucket_id = 'blog-images' AND
          EXISTS (
            SELECT 1 FROM admin_users
            WHERE admin_users.user_id = auth.uid()
          )
        );
    END IF;
END $$;

-- Add RLS policies for blog posts (with checks to avoid duplicates)
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'blog_posts' 
        AND schemaname = 'public' 
        AND policyname = 'Published blog posts are viewable by everyone'
    ) THEN
        CREATE POLICY "Published blog posts are viewable by everyone"
        ON blog_posts FOR SELECT
        TO public
        USING (status = 'published');
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'blog_posts' 
        AND schemaname = 'public' 
        AND policyname = 'Blog posts are editable by admins only'
    ) THEN
        CREATE POLICY "Blog posts are editable by admins only"
        ON blog_posts FOR ALL
        TO public
        USING (
          EXISTS (
            SELECT 1 FROM admin_users
            WHERE admin_users.user_id = auth.uid()
          )
        );
    END IF;
END $$;

-- Add RLS policies for pages (with checks to avoid duplicates)
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'pages' 
        AND schemaname = 'public' 
        AND policyname = 'Published pages are viewable by everyone'
    ) THEN
        CREATE POLICY "Published pages are viewable by everyone"
        ON pages FOR SELECT
        TO public
        USING (status = 'published');
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'pages' 
        AND schemaname = 'public' 
        AND policyname = 'Pages are editable by admins only'
    ) THEN
        CREATE POLICY "Pages are editable by admins only"
        ON pages FOR ALL
        TO public
        USING (
          EXISTS (
            SELECT 1 FROM admin_users
            WHERE admin_users.user_id = auth.uid()
          )
        );
    END IF;
END $$;

-- Add RLS policies for FAQs (with checks to avoid duplicates)
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'faqs' 
        AND schemaname = 'public' 
        AND policyname = 'Active FAQs are viewable by everyone'
    ) THEN
        CREATE POLICY "Active FAQs are viewable by everyone"
        ON faqs FOR SELECT
        TO public
        USING (is_active = true);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'faqs' 
        AND schemaname = 'public' 
        AND policyname = 'FAQs are editable by admins only'
    ) THEN
        CREATE POLICY "FAQs are editable by admins only"
        ON faqs FOR ALL
        TO public
        USING (
          EXISTS (
            SELECT 1 FROM admin_users
            WHERE admin_users.user_id = auth.uid()
          )
        );
    END IF;
END $$;

-- Add RLS policies for newsletter subscribers (with checks to avoid duplicates)
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'newsletter_subscribers' 
        AND schemaname = 'public' 
        AND policyname = 'Subscribers can view and update their own data'
    ) THEN
        CREATE POLICY "Subscribers can view and update their own data"
        ON newsletter_subscribers FOR SELECT
        TO public
        USING (user_id = auth.uid());
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'newsletter_subscribers' 
        AND schemaname = 'public' 
        AND policyname = 'Subscribers can update their own data'
    ) THEN
        CREATE POLICY "Subscribers can update their own data"
        ON newsletter_subscribers FOR UPDATE
        TO public
        USING (user_id = auth.uid());
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'newsletter_subscribers' 
        AND schemaname = 'public' 
        AND policyname = 'Anyone can subscribe'
    ) THEN
        CREATE POLICY "Anyone can subscribe"
        ON newsletter_subscribers FOR INSERT
        TO public
        WITH CHECK (true);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'newsletter_subscribers' 
        AND schemaname = 'public' 
        AND policyname = 'Admins can view all subscribers'
    ) THEN
        CREATE POLICY "Admins can view all subscribers"
        ON newsletter_subscribers FOR SELECT
        TO public
        USING (
          EXISTS (
            SELECT 1 FROM admin_users
            WHERE admin_users.user_id = auth.uid()
          )
        );
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'newsletter_subscribers' 
        AND schemaname = 'public' 
        AND policyname = 'Admins can manage all subscribers'
    ) THEN
        CREATE POLICY "Admins can manage all subscribers"
        ON newsletter_subscribers FOR ALL
        TO public
        USING (
          EXISTS (
            SELECT 1 FROM admin_users
            WHERE admin_users.user_id = auth.uid()
          )
        );
    END IF;
END $$;

-- Create trigger to update updated_at columns if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at columns (with checks to avoid duplicates)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_blog_posts_updated_at'
    ) THEN
        CREATE TRIGGER update_blog_posts_updated_at
        BEFORE UPDATE ON blog_posts
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_pages_updated_at'
    ) THEN
        CREATE TRIGGER update_pages_updated_at
        BEFORE UPDATE ON pages
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_faqs_updated_at'
    ) THEN
        CREATE TRIGGER update_faqs_updated_at
        BEFORE UPDATE ON faqs
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_chatbot_scripts_updated_at'
    ) THEN
        CREATE TRIGGER update_chatbot_scripts_updated_at
        BEFORE UPDATE ON chatbot_scripts
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
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

-- Insert initial blog categories
INSERT INTO blog_categories (name, slug, description)
VALUES 
  ('Product Reviews', 'product-reviews', 'In-depth reviews of our products'),
  ('Style Tips', 'style-tips', 'Fashion advice and styling recommendations'),
  ('Trends', 'trends', 'Latest fashion and beauty trends')
ON CONFLICT (slug) DO NOTHING;

-- Insert initial FAQ categories and questions
INSERT INTO faqs (question, answer, category, position, is_active)
VALUES
  ('How long does shipping take?', '<p>Standard shipping typically takes 3-5 business days within the continental US. Express shipping options are available at checkout for 1-2 business day delivery.</p>', 'Shipping', 1, true),
  ('Do you ship internationally?', '<p>Yes, we ship to most countries worldwide. International shipping times vary by location, typically taking 7-14 business days.</p>', 'Shipping', 2, true),
  ('What is your return policy?', '<p>We offer a 30-day return policy for most items. Products must be in original condition with tags attached. Some exclusions apply for intimate apparel and sale items.</p>', 'Returns', 1, true),
  ('How do I track my order?', '<p>Once your order ships, you will receive a confirmation email with tracking information. You can also track your order in your account dashboard.</p>', 'Orders', 1, true)
ON CONFLICT DO NOTHING;

-- Insert initial chatbot scripts
INSERT INTO chatbot_scripts (name, section, trigger_keywords, response, is_active)
VALUES
  ('Shipping Time', 'Shipping', ARRAY['shipping', 'delivery', 'how long', 'when will I receive'], 'Standard shipping typically takes 3-5 business days within the continental US. Express shipping options are available at checkout for 1-2 business day delivery.', true),
  ('Return Policy', 'Returns', ARRAY['return', 'send back', 'refund'], 'We offer a 30-day return policy for most items. Products must be in original condition with tags attached. Some exclusions apply for intimate apparel and sale items.', true),
  ('Order Tracking', 'Orders', ARRAY['track', 'where is my order', 'shipping status'], 'Once your order ships, you will receive a confirmation email with tracking information. You can also track your order in your account dashboard.', true),
  ('Payment Methods', 'Payment', ARRAY['payment', 'credit card', 'paypal', 'pay'], 'We accept all major credit cards, PayPal, Apple Pay, and Google Pay. All transactions are secure and encrypted.', true)
ON CONFLICT DO NOTHING;

-- Insert initial chatbot settings
INSERT INTO chatbot_settings (welcome_message, fallback_message, is_enabled, auto_response_delay, human_handoff_threshold)
VALUES (
  'Welcome to MinddShopp! How can I assist you today?',
  'I''m sorry, I don''t understand. Could you please rephrase your question or select from one of these common topics: shipping, returns, or order tracking.',
  true,
  1000,
  3
)
ON CONFLICT DO NOTHING;

-- Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';