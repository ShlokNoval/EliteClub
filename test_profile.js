import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envContent = fs.readFileSync('.env', 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    env[match[1].trim()] = match[2].trim();
  }
});

const supabase = createClient(env['VITE_SUPABASE_URL'], env['VITE_SUPABASE_ANON_KEY']);

async function testProfile() {
  console.log('Testing Profile Fetch...');
  const startTime = Date.now();
  
  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', 'f84ef0bd-df53-4fc4-8047-815e6eb65c28')
    .single();

  const duration = Date.now() - startTime;
  console.log(`Request completed in ${duration}ms`);

  if (error) {
    console.error('ERROR:', error);
  } else {
    console.log('SUCCESS! Role:', data.role);
  }
}

testProfile();
