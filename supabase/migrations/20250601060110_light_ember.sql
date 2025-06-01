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
  'We provide detailed size guides on our product pages to help you find the perfect fit. For clothing and footwear, you can find specific measurements and fit recommendations. If you''re between sizes, we generally recommend sizing up. For more specific sizing questions, please contact our customer service team.',
  true);
  
INSERT INTO chatbot_scripts (name, section, trigger_keywords, response, is_active) VALUES
('Product Customization', 'Products', 
  ARRAY['customization', 'personalize', 'custom', 'monogram', 'engraving', 'personalization'],
  'Select products offer customization options such as monogramming or engraving. If customization is available, you''ll see the option on the product page. Please note that customized items cannot be returned unless they arrive damaged or defective.',
  true);

-- ORDERS
INSERT INTO chatbot_scripts (name, section, trigger_keywords, response, is_active) VALUES
('Order Status', 'Orders', 
  ARRAY['order status', 'where is my order', 'track order', 'tracking', 'order update', 'check order'],
  'You can check your order status by logging into your account and visiting the "Orders" section. Once your order ships, you''ll receive a confirmation email with tracking information. If you have specific questions about your order, please contact our customer service team with your order number.',
  true);
  
INSERT INTO chatbot_scripts (name, section, trigger_keywords, response, is_active) VALUES
('Order Cancellation', 'Orders', 
  ARRAY['cancel order', 'cancellation', 'cancel my order', 'stop order', 'change order'],
  'Orders can be cancelled within 1 hour of placement. To cancel an order, please log into your account, go to "Orders," and select the cancel option if available. If your order has already been processed, you may need to return the items once they arrive. For immediate assistance with cancellations, please contact our customer service team.',
  true);
  
INSERT INTO chatbot_scripts (name, section, trigger_keywords, response, is_active) VALUES
('Order Modification', 'Orders', 
  ARRAY['change order', 'modify order', 'edit order', 'update order', 'change shipping address', 'change items'],
  'Order modifications such as changing shipping address or adding/removing items are possible within 1 hour of placement. Please contact our customer service team immediately with your order number for assistance. Once an order has been processed, modifications may not be possible.',
  true);
  
INSERT INTO chatbot_scripts (name, section, trigger_keywords, response, is_active) VALUES
('Order Processing Time', 'Orders', 
  ARRAY['processing time', 'how long to process', 'when will my order ship', 'order preparation', 'processing'],
  'Most orders are processed within 1-2 business days. During peak seasons or promotional periods, processing may take up to 3 business days. Once your order ships, you''ll receive a confirmation email with tracking information.',
  true);
  
INSERT INTO chatbot_scripts (name, section, trigger_keywords, response, is_active) VALUES
('Order Confirmation', 'Orders', 
  ARRAY['order confirmation', 'confirm order', 'confirmation email', 'order receipt', 'order email'],
  'After placing an order, you should receive an order confirmation email within minutes. If you don''t see it, please check your spam folder. You can also view your order confirmation by logging into your account and visiting the "Orders" section.',
  true);

-- SHIPPING
INSERT INTO chatbot_scripts (name, section, trigger_keywords, response, is_active) VALUES
('Shipping Options', 'Shipping', 
  ARRAY['shipping options', 'delivery options', 'shipping methods', 'express shipping', 'standard shipping', 'overnight shipping'],
  'We offer several shipping options: Standard (5-7 business days), Express (2-3 business days), and Overnight (next business day if ordered before 2 PM ET). Shipping options and rates are displayed during checkout and vary based on your location and order value.',
  true);
  
INSERT INTO chatbot_scripts (name, section, trigger_keywords, response, is_active) VALUES
('Shipping Costs', 'Shipping', 
  ARRAY['shipping cost', 'shipping fee', 'delivery cost', 'shipping charges', 'how much is shipping', 'free shipping'],
  'Shipping costs depend on your location, selected shipping method, and order value. We offer free standard shipping on orders over $75. Exact shipping costs will be calculated and displayed during checkout before you complete your purchase.',
  true);
  
INSERT INTO chatbot_scripts (name, section, trigger_keywords, response, is_active) VALUES
('International Shipping', 'Shipping', 
  ARRAY['international shipping', 'ship internationally', 'global shipping', 'worldwide shipping', 'shipping to other countries'],
  'Yes, we ship to most countries worldwide. International shipping typically takes 7-14 business days. Please note that international orders may be subject to import duties and taxes, which are the responsibility of the recipient. These charges are not included in our shipping fees.',
  true);
  
INSERT INTO chatbot_scripts (name, section, trigger_keywords, response, is_active) VALUES
('Shipping Restrictions', 'Shipping', 
  ARRAY['shipping restrictions', 'where do you ship', 'countries you don''t ship to', 'shipping limitations', 'restricted locations'],
  'We ship to most countries, but there are some restrictions due to international regulations. Currently, we cannot ship to North Korea, Iran, Cuba, Syria, and Sudan. Additionally, certain products may have specific shipping restrictions. These will be noted on the product page.',
  true);
  
INSERT INTO chatbot_scripts (name, section, trigger_keywords, response, is_active) VALUES
('Shipping Delays', 'Shipping', 
  ARRAY['shipping delay', 'delayed shipment', 'late delivery', 'package delayed', 'shipping problems'],
  'Occasionally, shipping delays may occur due to weather conditions, customs processing, or carrier issues. If your tracking information hasn''t updated in 48 hours or your package is significantly delayed, please contact our customer service team with your order number for assistance.',
  true);

-- RETURNS & REFUNDS
INSERT INTO chatbot_scripts (name, section, trigger_keywords, response, is_active) VALUES
('Return Policy', 'Returns', 
  ARRAY['return policy', 'can i return', 'how to return', 'return process', 'send back', 'return period', 'return window'],
  'We offer a 30-day return policy for most items. Products must be unused, undamaged, and in their original packaging with all tags attached. Some items, such as intimate apparel, final sale items, and customized products, are not eligible for return. Please visit our Returns page for complete details.',
  true);
  
INSERT INTO chatbot_scripts (name, section, trigger_keywords, response, is_active) VALUES
('Refund Process', 'Returns', 
  ARRAY['refund process', 'how long for refund', 'when will i get my money back', 'refund timeline', 'refund status'],
  'Once we receive and process your return, refunds are typically issued to your original payment method within 5-7 business days. For store credit refunds, the credit is usually applied to your account within 1-2 business days after processing. You''ll receive an email notification when your refund has been processed.',
  true);
  
INSERT INTO chatbot_scripts (name, section, trigger_keywords, response, is_active) VALUES
('Exchange Process', 'Returns', 
  ARRAY['exchange process', 'how to exchange', 'swap sizes', 'exchange for different size', 'exchange for different color'],
  'To exchange an item, please initiate a return through your account and place a new order for the desired item. This ensures the fastest processing time. If the new item is unavailable, you can request store credit for your return to use when the item becomes available.',
  true);
  
INSERT INTO chatbot_scripts (name, section, trigger_keywords, response, is_active) VALUES
('Return Shipping', 'Returns', 
  ARRAY['return shipping', 'who pays for return shipping', 'return shipping cost', 'free return shipping', 'return label'],
  'Return shipping costs are the responsibility of the customer unless the return is due to our error (wrong item shipped or defective product). You can use your preferred carrier to return items. For your convenience, we offer prepaid return labels for a flat fee of $7.95, which will be deducted from your refund amount.',
  true);
  
INSERT INTO chatbot_scripts (name, section, trigger_keywords, response, is_active) VALUES
('Damaged or Defective Items', 'Returns', 
  ARRAY['damaged item', 'defective product', 'wrong item', 'not as described', 'quality issue', 'broken', 'faulty'],
  'If you receive a damaged, defective, or incorrect item, please contact our customer service team within 48 hours of delivery. Please include photos of the issue and your order number. We''ll provide a prepaid return label and process a replacement or refund as soon as possible.',
  true);

-- ACCOUNT & LOYALTY
INSERT INTO chatbot_scripts (name, section, trigger_keywords, response, is_active) VALUES
('Account Creation', 'Account', 
  ARRAY['create account', 'sign up', 'register', 'create profile', 'join', 'make an account'],
  'Creating an account is easy and free! Click on the profile icon in the top right corner of our website and select "Create Account." You''ll need to provide your email address and create a password. Having an account allows you to track orders, save favorites, and check out faster.',
  true);
  
INSERT INTO chatbot_scripts (name, section, trigger_keywords, response, is_active) VALUES
('Password Reset', 'Account', 
  ARRAY['reset password', 'forgot password', 'change password', 'password recovery', 'can''t login', 'login problems'],
  'If you''ve forgotten your password, click on "Sign In," then select "Forgot Password." Enter your email address, and we''ll send you a link to reset your password. The link is valid for 24 hours. If you don''t receive the email, please check your spam folder.',
  true);
  
INSERT INTO chatbot_scripts (name, section, trigger_keywords, response, is_active) VALUES
('Loyalty Program', 'Account', 
  ARRAY['loyalty program', 'rewards program', 'points', 'reward points', 'earn points', 'redeem points'],
  'Our MinddShopp Rewards program lets you earn points on every purchase. For every $1 spent, you earn 1 point. Points can be redeemed for discounts on future purchases (500 points = $25 off). You also receive exclusive offers and early access to sales. Join by creating an account and opting into the rewards program.',
  true);
  
INSERT INTO chatbot_scripts (name, section, trigger_keywords, response, is_active) VALUES
('Referral Program', 'Account', 
  ARRAY['referral program', 'refer a friend', 'referral bonus', 'referral discount', 'invite friends'],
  'Our referral program rewards you for sharing MinddShopp with friends and family. When you refer someone, they receive $10 off their first purchase of $50+, and you''ll earn $10 in store credit when they complete their order. You can refer friends through your account dashboard under "Referrals."',
  true);
  
INSERT INTO chatbot_scripts (name, section, trigger_keywords, response, is_active) VALUES
('Account Privacy', 'Account', 
  ARRAY['account privacy', 'data protection', 'information security', 'protect my data', 'privacy settings'],
  'We take your privacy seriously. Your personal information is secured using industry-standard encryption. We never sell your data to third parties. You can review our complete Privacy Policy for details on how we collect, use, and protect your information. You can manage your communication preferences in your account settings.',
  true);

-- PAYMENT
INSERT INTO chatbot_scripts (name, section, trigger_keywords, response, is_active) VALUES
('Payment Methods', 'Payment', 
  ARRAY['payment methods', 'payment options', 'how to pay', 'accepted payment', 'credit card', 'paypal'],
  'We accept all major credit cards (Visa, Mastercard, American Express, Discover), PayPal, Apple Pay, Google Pay, and Shop Pay. Gift cards and store credit can also be applied to your purchase. All transactions are secured with industry-standard encryption.',
  true);
  
INSERT INTO chatbot_scripts (name, section, trigger_keywords, response, is_active) VALUES
('Payment Security', 'Payment', 
  ARRAY['payment security', 'secure payment', 'safe to use credit card', 'payment protection', 'encrypted'],
  'Your payment information is always secure with us. We use industry-standard SSL encryption and comply with PCI DSS standards. We never store your full credit card details on our servers. Our payment processing is handled by trusted third-party providers with robust security measures.',
  true);
  
INSERT INTO chatbot_scripts (name, section, trigger_keywords, response, is_active) VALUES
('Installment Payment', 'Payment', 
  ARRAY['installment payment', 'pay in installments', 'buy now pay later', 'afterpay', 'klarna', 'affirm', 'payment plan'],
  'We offer installment payment options through Afterpay, Klarna, and Affirm, allowing you to split your purchase into multiple payments. These options are available at checkout for orders over $50. Please note that approval is subject to a quick credit check by the financing provider.',
  true);
  
INSERT INTO chatbot_scripts (name, section, trigger_keywords, response, is_active) VALUES
('Gift Cards', 'Payment', 
  ARRAY['gift cards', 'gift certificates', 'buy gift card', 'redeem gift card', 'gift card balance'],
  'Gift cards are available for purchase in denominations from $25 to $500. They can be delivered via email or printed at home. To redeem a gift card, enter the gift card code during checkout. You can check your gift card balance by entering the card number and PIN on our Gift Card page.',
  true);
  
INSERT INTO chatbot_scripts (name, section, trigger_keywords, response, is_active) VALUES
('Promo Codes', 'Payment', 
  ARRAY['promo code', 'discount code', 'coupon', 'voucher', 'apply code', 'promotion'],
  'To apply a promo code, enter it in the designated field during checkout before completing your purchase. Only one promo code can be used per order. Promo codes cannot be applied to previous purchases and cannot be combined with other offers unless specifically stated.',
  true);

-- PRODUCT CARE
INSERT INTO chatbot_scripts (name, section, trigger_keywords, response, is_active) VALUES
('Clothing Care', 'Product Care', 
  ARRAY['clothing care', 'how to wash', 'laundry instructions', 'care for clothes', 'washing instructions', 'garment care'],
  'For optimal longevity of your clothing items, please follow the care instructions on the garment label. Generally, we recommend washing in cold water, using mild detergent, and air drying when possible. For delicate items, hand washing or dry cleaning may be recommended. Specific care instructions are listed on each product page.',
  true);
  
INSERT INTO chatbot_scripts (name, section, trigger_keywords, response, is_active) VALUES
('Footwear Care', 'Product Care', 
  ARRAY['shoe care', 'footwear care', 'clean shoes', 'maintain shoes', 'shoe maintenance', 'protect shoes'],
  'To keep your footwear looking its best, regularly clean with appropriate products for the material (leather, suede, canvas, etc.). Use shoe trees to maintain shape, and apply protector spray before first wear. Allow shoes to air out between wears, and avoid wearing the same pair consecutive days. Specific care guides are available on our blog.',
  true);
  
INSERT INTO chatbot_scripts (name, section, trigger_keywords, response, is_active) VALUES
('Jewelry Care', 'Product Care', 
  ARRAY['jewelry care', 'clean jewelry', 'maintain jewelry', 'tarnish', 'polish', 'store jewelry'],
  'Keep jewelry away from chemicals including perfumes, lotions, and household cleaners. Store pieces separately to prevent scratching. For gold and silver, clean with a soft polishing cloth. For gemstones, use a soft brush with mild soap and water. We recommend professional cleaning once a year for fine jewelry.',
  true);
  
INSERT INTO chatbot_scripts (name, section, trigger_keywords, response, is_active) VALUES
('Beauty Product Storage', 'Product Care', 
  ARRAY['beauty storage', 'store makeup', 'store skincare', 'beauty product shelf life', 'expiration', 'preserve beauty products'],
  'Store beauty products in a cool, dry place away from direct sunlight and heat. Most products have a symbol indicating shelf life after opening (e.g., 12M means 12 months). Tightly close all containers after use. Refrigeration can extend the life of certain products like vitamin C serums and natural formulations.',
  true);
  
INSERT INTO chatbot_scripts (name, section, trigger_keywords, response, is_active) VALUES
('Product Repairs', 'Product Care', 
  ARRAY['repair service', 'fix product', 'product repair', 'damaged item', 'restoration', 'fix'],
  'We offer repair services for select premium products. Footwear can be resoled, clothing can be mended, and jewelry can be repaired or resized. Repair services start at $25, depending on the item and service needed. Please contact our customer service team to inquire about repair options for your specific item.',
  true);

-- SUSTAINABILITY
INSERT INTO chatbot_scripts (name, section, trigger_keywords, response, is_active) VALUES
('Sustainability Practices', 'Sustainability', 
  ARRAY['sustainability', 'sustainable practices', 'eco-friendly', 'environmental impact', 'green initiatives'],
  'MinddShopp is committed to sustainable practices. We''re working to reduce our carbon footprint through efficient shipping, eco-friendly packaging, and partnering with brands that prioritize sustainable production. By 2026, we aim to have 50% of our products meet our sustainability criteria.',
  true);
  
INSERT INTO chatbot_scripts (name, section, trigger_keywords, response, is_active) VALUES
('Recycling Program', 'Sustainability', 
  ARRAY['recycling program', 'recycle products', 'product recycling', 'sustainable disposal', 'circular fashion'],
  'Our recycling program allows you to send back used products for proper recycling. For eligible items, you''ll receive store credit based on the item''s condition. Visit the Recycling page in your account to start the process. We partner with specialized recycling facilities to ensure materials are properly processed.',
  true);
  
INSERT INTO chatbot_scripts (name, section, trigger_keywords, response, is_active) VALUES
('Sustainable Brands', 'Sustainability', 
  ARRAY['sustainable brands', 'eco brands', 'ethical brands', 'environmentally friendly brands', 'green brands'],
  'We partner with numerous sustainable brands that prioritize ethical production, use of eco-friendly materials, and fair labor practices. Look for our "Sustainable Choice" badge on product pages. You can also filter your search results to show only sustainable products.',
  true);
  
INSERT INTO chatbot_scripts (name, section, trigger_keywords, response, is_active) VALUES
('Packaging', 'Sustainability', 
  ARRAY['sustainable packaging', 'eco packaging', 'recyclable packaging', 'packaging materials', 'plastic free'],
  'We use recyclable and biodegradable packaging materials whenever possible. Our shipping boxes are made from recycled cardboard, and we''ve reduced plastic use by 75% since 2023. Product packaging is being transitioned to sustainable alternatives in partnership with our brands.',
  true);
  
INSERT INTO chatbot_scripts (name, section, trigger_keywords, response, is_active) VALUES
('Carbon Offset', 'Sustainability', 
  ARRAY['carbon offset', 'carbon neutral', 'carbon footprint', 'climate neutral', 'emissions'],
  'We offset the carbon emissions from all shipments through investments in verified environmental projects. At checkout, you can view the carbon footprint of your order and learn about the specific offset projects we support. We''re working toward becoming fully carbon neutral by 2027.',
  true);

-- SPECIAL SERVICES
INSERT INTO chatbot_scripts (name, section, trigger_keywords, response, is_active) VALUES
('Gift Wrapping', 'Services', 
  ARRAY['gift wrapping', 'wrap as gift', 'gift packaging', 'present wrapping', 'gift option'],
  'We offer premium gift wrapping services for $5.95 per item. You can select this option during checkout. Our gift wrap includes elegant paper, a ribbon, and a personalized message card. During holiday seasons, we offer special themed gift wrapping options.',
  true);
  
INSERT INTO chatbot_scripts (name, section, trigger_keywords, response, is_active) VALUES
('Personal Shopping', 'Services', 
  ARRAY['personal shopper', 'personal shopping', 'shopping assistance', 'style advice', 'fashion consultant'],
  'Our personal shopping service provides one-on-one assistance with a style expert. They can help you find specific items, coordinate outfits, or build a wardrobe. This complimentary service is available by appointment for all customers. Contact customer service to schedule a virtual consultation.',
  true);
  
INSERT INTO chatbot_scripts (name, section, trigger_keywords, response, is_active) VALUES
('Bridal Services', 'Services', 
  ARRAY['bridal services', 'wedding shopping', 'bridal registry', 'bridal stylist', 'wedding gifts'],
  'Our Bridal Boutique offers specialized services including bridal styling consultations, registry creation, and coordination of wedding party attire. Our bridal specialists can help with everything from the engagement to the honeymoon. Schedule a consultation through our Bridal Boutique page.',
  true);
  
INSERT INTO chatbot_scripts (name, section, trigger_keywords, response, is_active) VALUES
('Corporate Gifting', 'Services', 
  ARRAY['corporate gifts', 'business gifts', 'corporate orders', 'bulk orders', 'company gifts'],
  'Our corporate gifting program offers curated gift selections for businesses of all sizes. We provide volume discounts, custom branding options, and international shipping. Our corporate concierge can help you select the perfect gifts for clients, employees, or events. Email corporate@minddshopp.com for details.',
  true);
  
INSERT INTO chatbot_scripts (name, section, trigger_keywords, response, is_active) VALUES
('Alterations', 'Services', 
  ARRAY['alterations', 'tailoring', 'hemming', 'adjust fit', 'resize', 'custom fit'],
  'We offer professional alteration services for clothing purchased from MinddShopp. Basic alterations start at $15, with pricing based on the complexity of the work needed. Turnaround time is typically 5-7 business days. Please contact customer service to arrange alterations for your purchase.',
  true);

-- TECHNICAL ISSUES
INSERT INTO chatbot_scripts (name, section, trigger_keywords, response, is_active) VALUES
('Website Issues', 'Technical', 
  ARRAY['website not working', 'site down', 'website error', 'page won''t load', 'technical problem', 'website bug'],
  'If you''re experiencing website issues, please try clearing your browser cache and cookies, or try using a different browser. Our website is optimized for the latest versions of Chrome, Firefox, Safari, and Edge. If problems persist, please contact our technical support team with details about the issue and screenshots if possible.',
  true);
  
INSERT INTO chatbot_scripts (name, section, trigger_keywords, response, is_active) VALUES
('Payment Failures', 'Technical', 
  ARRAY['payment failed', 'card declined', 'payment not working', 'transaction error', 'payment issue', 'can''t pay'],
  'Payment failures can occur for several reasons: insufficient funds, incorrect card details, expired card, or bank security measures. Please verify your payment information and try again. If the issue persists, try a different payment method or contact your bank to ensure there are no restrictions on your card.',
  true);
  
INSERT INTO chatbot_scripts (name, section, trigger_keywords, response, is_active) VALUES
('Account Access Issues', 'Technical', 
  ARRAY['can''t log in', 'login problems', 'account locked', 'access denied', 'account issues', 'sign in problems'],
  'If you''re having trouble accessing your account, try resetting your password using the "Forgot Password" link. Ensure you''re using the correct email address associated with your account. If you continue to experience issues, contact our customer service team who can help verify your account and restore access.',
  true);
  
INSERT INTO chatbot_scripts (name, section, trigger_keywords, response, is_active) VALUES
('Mobile App Issues', 'Technical', 
  ARRAY['app not working', 'mobile app', 'app crash', 'app error', 'update app', 'app problem'],
  'For mobile app issues, please ensure you''re using the latest version by updating through the App Store or Google Play Store. Try restarting the app or your device. If problems persist, you can uninstall and reinstall the app (your account information will be preserved). For ongoing issues, please contact our technical support team.',
  true);
  
INSERT INTO chatbot_scripts (name, section, trigger_keywords, response, is_active) VALUES
('Browser Compatibility', 'Technical', 
  ARRAY['browser compatibility', 'browser not supported', 'website display issues', 'layout problems', 'browser error'],
  'Our website is optimized for the latest versions of Chrome, Firefox, Safari, and Edge. If you''re experiencing display issues, please update your browser to the latest version. Some features may not work correctly in older browsers or Internet Explorer. For the best experience, we recommend using Google Chrome or Mozilla Firefox.',
  true);

-- COMPANY INFORMATION
INSERT INTO chatbot_scripts (name, section, trigger_keywords, response, is_active) VALUES
('About Us', 'Company', 
  ARRAY['about company', 'company history', 'about minddshopp', 'who are you', 'company information', 'when founded'],
  'MinddShopp was founded in 2020 with a vision to create a premium online shopping destination for fashion and beauty enthusiasts. We curate collections from established luxury brands and emerging designers, focusing on quality, sustainability, and exceptional customer experience. Learn more on our About Us page.',
  true);
  
INSERT INTO chatbot_scripts (name, section, trigger_keywords, response, is_active) VALUES
('Store Locations', 'Company', 
  ARRAY['store locations', 'physical stores', 'retail locations', 'showroom', 'brick and mortar', 'visit store'],
  'While we primarily operate online, we have flagship showrooms in New York, Los Angeles, and Miami where you can experience select products in person and meet with our style consultants. Visit our Store Locations page for addresses, hours, and services available at each location.',
  true);
  
INSERT INTO chatbot_scripts (name, section, trigger_keywords, response, is_active) VALUES
('Career Opportunities', 'Company', 
  ARRAY['careers', 'jobs', 'employment', 'work at minddshopp', 'job openings', 'hiring'],
  'We''re always looking for passionate individuals to join our team. Current job openings are listed on our Careers page. We offer positions in areas including buying, marketing, customer service, technology, and operations. We provide competitive benefits and a dynamic work environment focused on growth and innovation.',
  true);
  
INSERT INTO chatbot_scripts (name, section, trigger_keywords, response, is_active) VALUES
('Press Inquiries', 'Company', 
  ARRAY['press', 'media', 'journalists', 'press kit', 'media inquiry', 'press contact'],
  'For press and media inquiries, please contact our PR team at press@minddshopp.com. Our press kit, including company information, high-resolution images, and recent press releases, is available upon request. For urgent media inquiries, please call our press office at (555) 123-4567.',
  true);
  
INSERT INTO chatbot_scripts (name, section, trigger_keywords, response, is_active) VALUES
('Partnerships', 'Company', 
  ARRAY['partnerships', 'collaborate', 'business opportunities', 'brand partnerships', 'become a partner', 'vendor'],
  'We''re open to strategic partnerships that align with our brand values. This includes brand partnerships, affiliate programs, and collaborative collections. For established brands interested in selling on MinddShopp, please email partners@minddshopp.com with information about your brand and products.',
  true);

-- CONTACT & SUPPORT
INSERT INTO chatbot_scripts (name, section, trigger_keywords, response, is_active) VALUES
('Contact Methods', 'Contact', 
  ARRAY['contact', 'reach you', 'customer service', 'support', 'help', 'contact information', 'phone number', 'email'],
  'You can reach our customer service team via email at support@minddshopp.com, by phone at (555) 123-4567 (Mon-Fri, 9 AM - 6 PM ET), or through live chat on our website (available 24/7). For the fastest response, please include your order number if your inquiry is related to a specific purchase.',
  true);
  
INSERT INTO chatbot_scripts (name, section, trigger_keywords, response, is_active) VALUES
('Response Time', 'Contact', 
  ARRAY['response time', 'how long to respond', 'when will you reply', 'waiting for response', 'no response'],
  'We aim to respond to all inquiries within 24 hours during business days. During peak seasons, response times may extend to 48 hours. Live chat typically has the fastest response time. For urgent matters, please call our customer service line during business hours.',
  true);
  
INSERT INTO chatbot_scripts (name, section, trigger_keywords, response, is_active) VALUES
('Feedback', 'Contact', 
  ARRAY['feedback', 'suggestions', 'improve', 'recommendation', 'customer feedback', 'survey'],
  'We value your feedback! You can share your thoughts and suggestions by emailing feedback@minddshopp.com or by completing the feedback form on our Contact page. After each purchase, you''ll also receive a short survey where you can rate your experience. Your input helps us continuously improve our services.',
  true);
  
INSERT INTO chatbot_scripts (name, section, trigger_keywords, response, is_active) VALUES
('Complaints', 'Contact', 
  ARRAY['complaint', 'not satisfied', 'unhappy', 'disappointed', 'poor service', 'bad experience'],
  'We''re sorry to hear you''re not completely satisfied. Please email complaints@minddshopp.com with details about your experience, including any relevant order numbers. A senior customer service representative will review your case and respond within 24 hours. We''re committed to resolving any issues to your satisfaction.',
  true);
  
INSERT INTO chatbot_scripts (name, section, trigger_keywords, response, is_active) VALUES
('Live Chat', 'Contact', 
  ARRAY['live chat', 'chat support', 'chat with agent', 'online chat', 'instant support'],
  'Our live chat support is available 24/7. To start a chat, click the chat icon in the bottom right corner of any page on our website. During peak times, there may be a short wait to connect with an agent. You can also leave a message outside of hours, and we''ll respond via email.',
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