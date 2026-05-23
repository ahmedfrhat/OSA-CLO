// src/lib/supabase.ts
// Supabase clients — anon (public) + service_role (admin)

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://espqrrunhekvjsoxdfbx.supabase.co";

// ── Public (anon) client — for storefront ─────────────────────
// Uses the anon/publishable key — safe to expose in client JS
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ── Admin client — for server-side / admin dashboard ONLY ─────
// Uses the service_role key — NEVER expose to client bundles
// Only use in Server Components, API Routes, or Server Actions
const SUPABASE_SERVICE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
