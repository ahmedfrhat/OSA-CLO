-- ============================================================
-- ASO CLO — Supabase Setup Script
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- ══════════════════════════════════════════════════════════════
-- STEP 1: Storage Bucket Setup (Fixes Broken Images Bug)
-- ══════════════════════════════════════════════════════════════

-- Create the product-images bucket (public = true so URLs work)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,                        -- ✅ PUBLIC: required for image URLs to work
  5242880,                     -- 5MB max file size
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,               -- If bucket exists, ensure it's public
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

-- ── Storage RLS Policies ─────────────────────────────────────

-- Allow anyone to READ (view) images from the bucket
CREATE POLICY "Public read access on product-images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- Allow service_role to UPLOAD images (admin uploads via service key)
CREATE POLICY "Service role can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'product-images');

-- Allow service_role to UPDATE images
CREATE POLICY "Service role can update product images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'product-images');

-- Allow service_role to DELETE images
CREATE POLICY "Service role can delete product images"
ON storage.objects FOR DELETE
USING (bucket_id = 'product-images');


-- ══════════════════════════════════════════════════════════════
-- STEP 2: Products Table RLS (Fixes Sync/DB Write Bug)
-- ══════════════════════════════════════════════════════════════

-- Enable RLS on products (if not already enabled)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Allow ANYONE to read available products (storefront)
CREATE POLICY "Public can read available products"
ON products FOR SELECT
USING (is_available = true AND in_stock = true);

-- Allow service_role (admin API) to do EVERYTHING
-- This is what allows the admin dashboard to INSERT/UPDATE/DELETE
CREATE POLICY "Service role full access on products"
ON products
USING (true)
WITH CHECK (true);

-- ── Orders Table ──────────────────────────────────────────────

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Service role full access
CREATE POLICY "Service role full access on orders"
ON orders USING (true) WITH CHECK (true);

-- Allow anyone to insert orders (checkout)
CREATE POLICY "Anyone can create an order"
ON orders FOR INSERT WITH CHECK (true);

-- Allow anyone to read their own order by ID (order tracking)
CREATE POLICY "Anyone can read orders for tracking"
ON orders FOR SELECT USING (true);

-- ── Order Items Table ─────────────────────────────────────────

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on order_items"
ON order_items USING (true) WITH CHECK (true);

CREATE POLICY "Anyone can create order items"
ON order_items FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can read order items"
ON order_items FOR SELECT USING (true);


-- ══════════════════════════════════════════════════════════════
-- STEP 3: Enable Realtime (Fixes Instant Sync)
-- ══════════════════════════════════════════════════════════════
-- NOTE: Supabase SQL Editor cannot enable Realtime via SQL.
-- You must do this manually:
--
-- 1. Go to: Supabase Dashboard → Database → Replication
-- 2. Under "Source", click "0 tables" next to "supabase_realtime"
-- 3. Toggle ON the "products" table
-- 4. Click Save
--
-- This enables postgres_changes for the products table,
-- which is required for the storefront's live update feature.


-- ══════════════════════════════════════════════════════════════
-- STEP 4: Verify Everything Works
-- ══════════════════════════════════════════════════════════════

-- Check bucket exists and is public:
SELECT id, name, public FROM storage.buckets WHERE id = 'product-images';

-- Check products table policies:
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'products';

-- Check a sample product image URL exists:
SELECT id, name_en, image_url FROM products WHERE image_url IS NOT NULL LIMIT 3;
