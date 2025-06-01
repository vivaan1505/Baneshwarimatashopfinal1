-- Create referral table
CREATE TABLE referrals (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  referrer_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_email text NOT NULL,
  status text CHECK (status IN ('pending', 'completed', 'expired')) DEFAULT 'pending',
  reward_amount numeric(10,2),
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  UNIQUE(referrer_id, referred_email)
);

-- Create recycling requests table
CREATE TABLE recycling_requests (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  status text CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  description text NOT NULL,
  images text[] NOT NULL,
  condition_rating integer CHECK (condition_rating BETWEEN 1 AND 5),
  estimated_value numeric(10,2),
  admin_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create storage bucket for recycling images
INSERT INTO storage.buckets (id, name, public)
VALUES ('recycling-images', 'recycling-images', true);

-- Add RLS policies
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE recycling_requests ENABLE ROW LEVEL SECURITY;

-- Referrals policies
CREATE POLICY "Users can view their own referrals"
ON referrals FOR SELECT
TO authenticated
USING (auth.uid() = referrer_id);

CREATE POLICY "Users can create referrals"
ON referrals FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = referrer_id);

-- Recycling requests policies
CREATE POLICY "Users can view their own recycling requests"
ON recycling_requests FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create recycling requests"
ON recycling_requests FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their pending recycling requests"
ON recycling_requests FOR UPDATE
TO authenticated
USING (auth.uid() = user_id AND status = 'pending');

-- Admin policies
CREATE POLICY "Admins can view all referrals"
ON referrals FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.user_id = auth.uid()
  )
);

CREATE POLICY "Admins can update referrals"
ON referrals FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.user_id = auth.uid()
  )
);

CREATE POLICY "Admins can view all recycling requests"
ON recycling_requests FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.user_id = auth.uid()
  )
);

CREATE POLICY "Admins can update recycling requests"
ON recycling_requests FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.user_id = auth.uid()
  )
);

-- Create function to update recycling request timestamps
CREATE OR REPLACE FUNCTION update_recycling_request_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating timestamps
CREATE TRIGGER update_recycling_requests_updated_at
  BEFORE UPDATE ON recycling_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_recycling_request_updated_at();