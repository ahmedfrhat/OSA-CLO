import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://espqrrunhekvjsoxdfbx.supabase.co";

const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzcHFycnVuaGVrdmpzb3hkZmJ4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTMwOTEzMywiZXhwIjoyMDk0ODg1MTMzfQ.yrppVT3mrBaJMmztMr05ETfdOCPh5JrcIfW5C8B1vy8";

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
