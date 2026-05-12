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

async function testLogin() {
  console.log('Testing Supabase Auth Login...');
  const startTime = Date.now();
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'parthpawareliteclub@gmail.com',
    password: 'ParthInFifaWorldCup'
  });

  const duration = Date.now() - startTime;
  console.log(`Request completed in ${duration}ms`);

  if (error) {
    console.error('ERROR:', error.message);
  } else {
    console.log('SUCCESS! Logged in as:', data.user.id);
  }
}

testLogin();
