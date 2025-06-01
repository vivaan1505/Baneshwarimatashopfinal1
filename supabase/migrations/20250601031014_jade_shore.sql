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
  'Welcome to MinddShopp! How can I assist you today? You can ask me about products, orders, shipping, returns, or our services.',
  'I''m sorry, I don''t understand your question. Could you please rephrase it or ask about our products, shipping, returns, or account information?',
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
  'At MinddShopp, we offer a wide range of premium products including footwear, clothing, jewelry, and beauty items. We also have specialty collections like our Bridal Boutique and Festive Store. You can browse all categories from our main navigation menu.',
  true);
  
INSERT INTO chatbot_scripts (name, section, trigger_keywords, response, is_active) VALUES
('Product Quality', 'Products', 
  ARRAY['product quality', 'quality', 'how good are', 'materials', 'durability', 'how long will last'],
  'We pride ourselves on offering only the highest quality products. All items are carefully selected from reputable brands and undergo quality checks before being listed on our site. Our product descriptions include detailed information about materials and care instructions.',
  true);
  
INSERT INTO chatbot_scripts (name, section, trigger_keywords, response, is_active) VALUES
('Product Availability', 'Products', 
  ARRAY['availability', 'in stock', 'out of stock', 'when available', 'back in stock', 'restock'],
  'Product availability is indicated on each product page. If an item is out of stock, you can sign up for notifications to be alerted when it becomes available again. We regularly restock popular items, typically within 2-4 weeks.',
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

-- ORDERS
INSERT INTO chatbot_scripts (name, section, trigger_keywords, response, is_active) VALUES
('Order Status', 'Orders', 
  ARRAY['order status', 'where is my order', 'track order', 'tracking', 'order update', 'check order'],
  E'You can check your order status by logging into your account and visiting the "Orders" section. Once your order ships, you\'ll receive a confirmation email with tracking information. If you have specific questions about your order, please contact our customer service team with your order number.',
  true);
  
INSERT INTO chatbot_scripts (name, section, trigger_keywords, response, is_active) VALUES
('Order Cancellation', 'Orders', 
  ARRAY['cancel order', 'cancellation', 'cancel my order', 'stop order', 'change order'],
  E'Orders can be cancelled within 1 hour of placement. To cancel an order, please log into your account, go to "Orders," and select the cancel option if available. If your order has already been processed, you may need to return the items once they arrive. For immediate assistance with cancellations, please contact our customer service team.',
  true);
  
INSERT INTO chatbot_scripts (name, section, trigger_keywords, response, is_active) VALUES
('Order Modification', 'Orders', 
  ARRAY['change order', 'modify order', 'edit order', 'update order', 'change shipping address', 'change items'],
  E'Order modifications such as changing shipping address or adding/removing items are possible within 1 hour of placement. Please contact our customer service team immediately with your order number for assistance. Once an order has been processed, modifications may not be possible.',
  true);
  
INSERT INTO chatbot_scripts (name, section, trigger_keywords, response, is_active) VALUES
('Order Processing Time', 'Orders', 
  ARRAY['processing time', 'how long to process', 'when will my order ship', 'order preparation', 'processing'],
  E'Most orders are processed within 1-2 business days. During peak seasons or promotional periods, processing may take up to 3 business days. Once your order ships, you\'ll receive a confirmation email with tracking information.',
  true);
  
INSERT INTO chatbot_scripts (name, section, trigger_keywords, response, is_active) VALUES
('Order Confirmation', 'Orders', 
  ARRAY['order confirmation', 'confirm order', 'confirmation email', 'order receipt', 'order email'],
  E'After placing an order, you should receive an order confirmation email within minutes. If you don\'t see it, please check your spam folder. You can also view your order confirmation by logging into your account and visiting the "Orders" section.',
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