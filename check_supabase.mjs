import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf-8');
const env = {};
envContent.split(/\r?\n/).forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    env[match[1].trim()] = match[2].trim();
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY;

if(!supabaseAnonKey || !supabaseServiceKey) {
  console.error("Failed to parse keys:", env);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function check() {
  console.log('Testing Supabase Connection...');
  
  // 1. Test Anon Key on Products
  const { data: products, error: pError } = await supabase.from('products').select('*').limit(1);
  if (pError) {
    console.log('❌ Error connecting to products (Anon Key):', pError.message);
  } else {
    console.log('✅ Connected to products table successfully. Found', products.length, 'products.');
  }

  // 2. Test Admin Key on Orders 
  const { data: orders, error: oError } = await supabaseAdmin.from('orders').select('*').limit(1);
  if (oError) {
    console.log('❌ Error connecting to orders (Admin Key):', oError.message);
  } else {
    console.log('✅ Connected to orders table successfully. Found', orders.length, 'orders.');
  }
}

check();