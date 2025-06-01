-- Create chatbot_scripts table if it doesn't exist
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

-- Create chatbot_settings table if it doesn't exist
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

-- Insert default chatbot settings if none exist
INSERT INTO chatbot_settings (welcome_message, fallback_message, is_enabled, auto_response_delay, human_handoff_threshold)
SELECT 
  E'Welcome to MinddShopp! How can I assist you today? You can ask me about products, orders, shipping, returns, or our services.',
  E'I\'m sorry, I don\'t understand your question. Could you please rephrase it or ask about our products, shipping, returns, or account information?',
  true,
  1000,
  3
WHERE NOT EXISTS (SELECT 1 FROM chatbot_settings);

-- Clear existing scripts to avoid duplicates
DELETE FROM chatbot_scripts;

-- Insert comprehensive chatbot scripts for different categories
-- PRODUCTS
INSERT INTO chatbot_scripts (name, section, trigger_keywords, response, is_active) VALUES
('Product Categories', 'Products', 
  ARRAY['what products', 'product categories', 'what do you sell', 'what can i buy', 'types of products', 'categories'],
  E'At MinddShopp, we offer a wide range of premium products including footwear, clothing, jewelry, and beauty items. We also have specialty collections like our Bridal Boutique and Festive Store. You can browse all categories from our main navigation menu.',
  true);
  
INSERT INTO chatbot_scripts (name, section, trigger_keywords, response, is_active) VALUES
('Product Quality', 'Products', 
  ARRAY['product quality', 'quality', 'how good are', 'materials', 'durability', 'how long will last'],
  E'We pride ourselves on offering only the highest quality products. All items are carefully selected from reputable brands and undergo quality checks before being listed on our site. Our product descriptions include detailed information about materials and care instructions.',
  true);
  
INSERT INTO chatbot_scripts (name, section, trigger_keywords, response, is_active) VALUES
('Product Availability', 'Products', 
  ARRAY['availability', 'in stock', 'out of stock', 'when available', 'back in stock', 'restock'],
  E'Product availability is indicated on each product page. If an item is out of stock, you can sign up for notifications to be alerted when it becomes available again. We regularly restock popular items, typically within 2-4 weeks.',
  true);
  
INSERT INTO chatbot_scripts (name, section, trigger_keywords, response, is_active) VALUES
('Product Sizing', 'Products', 
  ARRAY['sizing', 'size guide', 'size chart', 'measurements', 'fit', 'runs small', 'runs large', 'true to size'],
  E'We provide detailed size guides on our product pages to help you find the perfect fit. For clothing and footwear, you can find specific measurements and fit recommendations. If you\'re between sizes, we generally recommend sizing up. For more specific sizing questions, please contact our customer service team.',
  true);
  
INSERT INTO chatbot_scripts (name, section, trigger_keywords, response, is_active) VALUES
('Product Customization', 'Products', 
  ARRAY['customization', 'personalize', 'custom', 'monogram', 'engraving', 'personalization'],
  E'Select products offer customization options such as monogramming or engraving. If customization is available, you\'ll see the option on the product page. Please note that customized items cannot be returned unless they arrive damaged or defective.',
  true);

-- Create updated_at trigger for chatbot_scripts if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_chatbot_scripts_updated_at'
  ) THEN
    CREATE TRIGGER update_chatbot_scripts_updated_at
    BEFORE UPDATE ON chatbot_scripts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;