import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://espqrrunhekvjsoxdfbx.supabase.co";

const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzcHFycnVuaGVrdmpzb3hkZmJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzMDkxMzMsImV4cCI6MjA5NDg4NTEzM30.FmqC18pZ7NrRy7bMN5EVZElev_K4pIKSHhBohGHBVlA";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const SUPABASE_SERVICE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzcHFycnVuaGVrdmpzb3hkZmJ4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTMwOTEzMywiZXhwIjoyMDk0ODg1MTMzfQ.yrppVT3mrBaJMmztMr05ETfdOCPh5JrcIfW5C8B1vy8";

export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
