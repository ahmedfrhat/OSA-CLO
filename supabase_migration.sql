-- Run these SQL commands in your Supabase SQL Editor:

-- 1. Discount Codes table
CREATE TABLE IF NOT EXISTS discount_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('percent', 'fixed')),
  value NUMERIC NOT NULL CHECK (value > 0),
  min_order NUMERIC DEFAULT 0,
  max_uses INTEGER DEFAULT NULL,
  uses_count INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ DEFAULT NULL,
  is_active BOOLEAN DEFAULT true,
  partner_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Product Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Add image_urls column to products (for multi-image)
ALTER TABLE products ADD COLUMN IF NOT EXISTS image_urls TEXT[] DEFAULT '{}';

-- Enable RLS for new tables
ALTER TABLE discount_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Allow anon read on reviews (approved only)
CREATE POLICY "Public can read approved reviews" ON reviews
  FOR SELECT USING (is_approved = true);

-- Allow anon insert on reviews
CREATE POLICY "Anyone can submit a review" ON reviews
  FOR INSERT WITH CHECK (true);

-- Service role full access
CREATE POLICY "Service role full access on discount_codes" ON discount_codes
  USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access on reviews" ON reviews
  USING (true);
