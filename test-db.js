import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://yrosfodnrioikimbkcck.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_l-jWiEeak2FY6owLawFUdg_DmpJxIPx';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkDB() {
  const { data, error } = await supabase.from('hero').select('hidden_fields').limit(1);
  if (error) {
    console.error("Error:", error);
  } else {
    console.log("Success! Data:", data);
  }
}

checkDB();
