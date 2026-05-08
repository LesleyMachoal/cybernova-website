import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const hasSupabaseConfig = !!supabaseUrl && !!serviceRoleKey;

if (!hasSupabaseConfig) {
  console.warn('Supabase env vars are missing. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in backend/.env');
}

export const supabase = hasSupabaseConfig
  ? createClient(supabaseUrl, serviceRoleKey)
  : null;
