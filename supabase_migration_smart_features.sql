-- ═══════════════════════════════════════════════════════════════
-- ASO CLO — Migration: Smart Features
-- Run this in your Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════

-- ── 1. WhatsApp OTP table ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS whatsapp_otps (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  phone       text        UNIQUE NOT NULL,          -- +201XXXXXXXXX format
  otp         text        NOT NULL,
  expires_at  timestamptz NOT NULL,
  verified    boolean     DEFAULT false,
  created_at  timestamptz DEFAULT now()
);

-- Index for fast lookup
CREATE INDEX IF NOT EXISTS idx_whatsapp_otps_phone ON whatsapp_otps(phone);

-- Auto-delete expired OTPs after 1 hour (keep DB clean)
-- You can also set up a pg_cron job for this:
-- SELECT cron.schedule('delete-expired-otps', '0 * * * *', $$DELETE FROM whatsapp_otps WHERE expires_at < now() - interval '1 hour'$$);

-- ── 2. Customers table ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS customers (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  phone        text        UNIQUE NOT NULL,
  name         text,
  email        text,
  last_login   timestamptz DEFAULT now(),
  created_at   timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);

-- ── 3. Row Level Security (RLS) ──────────────────────────────────
-- Allow service role full access (used by our API routes)
ALTER TABLE whatsapp_otps ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers      ENABLE ROW LEVEL SECURITY;

-- Service role policy (anon can't access directly)
CREATE POLICY "service_role_all_otps"
  ON whatsapp_otps FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "service_role_all_customers"
  ON customers FOR ALL
  USING (auth.role() = 'service_role');

-- ── Done ─────────────────────────────────────────────────────────
-- After running this migration:
-- 1. Add your Twilio credentials to .env.local:
--    TWILIO_ACCOUNT_SID=...
--    TWILIO_AUTH_TOKEN=...
--    TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
-- 2. Deploy your Next.js app with the new API routes
-- ═══════════════════════════════════════════════════════════════
