const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Load environment variables from .env.local
const envPath = '.env.local';
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    env[parts[0].trim()] = parts.slice(1).join('=').trim();
  }
});

const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'];
const serviceRoleKey = env['SUPABASE_SERVICE_ROLE_KEY'];

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function run() {
  console.log('--- ALL PATIENTS ---');
  const { data: patients } = await supabase.from('patients').select('*');
  console.log(JSON.stringify(patients, null, 2));

  console.log('--- ALL MAPPINGS ---');
  const { data: mappings } = await supabase.from('patient_auth_mapping').select('*');
  console.log(JSON.stringify(mappings, null, 2));
}

run().catch(console.error);
