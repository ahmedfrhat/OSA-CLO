import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// ── Environment Variable Guard ──────────────────────────────────────────────
if (!supabaseUrl) {
  throw new Error(
    "[Supabase] Missing environment variable: NEXT_PUBLIC_SUPABASE_URL\n" +
      "Please add it to your .env.local file and restart the dev server."
  );
}

if (!supabaseAnonKey) {
  throw new Error(
    "[Supabase] Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY\n" +
      "Please add it to your .env.local file and restart the dev server."
  );
}

// ── Supabase Client ─────────────────────────────────────────────────────────
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
  global: {
    headers: {
      "Cache-Control": "no-cache",
    },
  },
});

export default supabase;
