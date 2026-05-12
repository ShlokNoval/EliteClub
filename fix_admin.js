import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Simple manual .env parser since dotenv isn't installed
const envContent = fs.readFileSync('.env', 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    env[match[1].trim()] = match[2].trim();
  }
});

const supabase = createClient(env['VITE_SUPABASE_URL'], env['VITE_SUPABASE_ANON_KEY']);

async function fix() {
  const email = 'parthpawareliteclub@gmail.com';
  const password = 'ParthInFifaWorldCup';

  console.log('1. Attempting to sign up admin user...');
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });

  let userId;

  if (error) {
    if (error.message.includes('User already registered')) {
      console.log('User already exists. Attempting to log in...');
      const { data: loginData, error: loginErr } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (loginErr) {
        console.error('\nERROR: Cannot log in. The password might be wrong, or email confirmation is still required.');
        console.error('Login error message:', loginErr.message);
        console.log('\nACTION REQUIRED:');
        console.log('1. Go to Supabase Dashboard -> Authentication -> Users');
        console.log('2. Delete the user with email:', email);
        console.log('3. Run this script again.');
        process.exit(1);
      } else {
        console.log('Login successful!');
        userId = loginData.user.id;
      }
    } else {
      console.error('Signup error:', error.message);
      process.exit(1);
    }
  } else {
    console.log('Signup successful!');
    userId = data.user.id;
  }

  console.log(`2. Ensuring profile exists for user ${userId} with admin privileges...`);
  const { error: profileErr } = await supabase.from('profiles').upsert({
    id: userId,
    email: email,
    full_name: 'EliteClubCSN',
    role: 'admin',
    status: 'active'
  });

  if (profileErr) {
    console.error('Failed to update profile:', profileErr.message);
  } else {
    console.log('Profile successfully updated to ADMIN!');
    console.log('\nYou can now log in at http://localhost:5173/admin-login with:');
    console.log('Email:', email);
    console.log('Password:', password);
  }
}

fix();
