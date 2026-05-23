-- ============================================================
-- Feature 7: Admin Promotional Popup — store_settings table
-- Run in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

CREATE TABLE IF NOT EXISTS store_settings (
  id        UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key       TEXT NOT NULL UNIQUE,
  value     JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can READ settings (storefront needs to check popup state)
CREATE POLICY "Public can read store_settings"
  ON store_settings FOR SELECT
  USING (true);

-- Only service_role (admin API) can write
CREATE POLICY "Service role full access on store_settings"
  ON store_settings
  USING (true)
  WITH CHECK (true);

-- Insert default popup settings row
INSERT INTO store_settings (key, value)
VALUES (
  'promotional_popup',
  '{
    "enabled": false,
    "title_en": "🔥 Special Offer!",
    "title_ar": "🔥 عرض خاص!",
    "message_en": "Get 20% off your first order. Use code: WELCOME20",
    "message_ar": "احصل على خصم 20% على أول طلب. استخدم الكود: WELCOME20",
    "button_text_en": "Shop Now",
    "button_text_ar": "تسوق الآن",
    "button_link": "/",
    "bg_color": "#C8FF00",
    "text_color": "#0A0A0A"
  }'
)
ON CONFLICT (key) DO NOTHING;

-- Verify:
SELECT key, value FROM store_settings WHERE key = 'promotional_popup';
