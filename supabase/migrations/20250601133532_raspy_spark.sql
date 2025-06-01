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