import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xkhhgapetvgssjvyspkk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhraGhnYXBldHZnc3NqdnlzcGtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1MDQ5MDIsImV4cCI6MjA5NDA4MDkwMn0.86gyZGiCoQsa5CP8mUaxvBSywTaUYIpplzclxweQphQ';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const TEST_EMAIL = `verify_test_${Date.now()}@eliteclub.local`;
const TEST_PASS = 'TestPass123!';

async function verify() {
  console.log('\n=== Verifying RPC → Login Flow ===\n');

  // Step 1: Admin login so RPC can verify we're admin
  console.log('Step 1: Logging in as admin...');
  const { data: adminData, error: adminError } = await supabase.auth.signInWithPassword({
    email: 'parthpawareliteclub@gmail.com',
    password: 'Parth@1234'
  });
  if (adminError) {
    console.error('Admin login failed:', adminError.message);
    console.log('Skipping RPC test (need admin session)');
    process.exit(1);
  }
  console.log('Admin logged in:', adminData.user?.id);

  // Step 2: Call the RPC as admin
  console.log(`\nStep 2: Creating test user via RPC: ${TEST_EMAIL}`);
  const { data: newUserId, error: rpcError } = await supabase.rpc('create_hotel_user', {
    p_email: TEST_EMAIL,
    p_password: TEST_PASS,
  });
  if (rpcError) {
    console.error('RPC error:', rpcError.message);
    process.exit(1);
  }
  console.log('RPC success! User created:', newUserId);

  // Step 3: Sign out admin, sign in as new user
  await supabase.auth.signOut();
  console.log('\nStep 3: Attempting login with newly created user...');
  const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
    email: TEST_EMAIL,
    password: TEST_PASS,
  });

  if (loginError) {
    console.error('LOGIN FAILED:', loginError.message);
    console.log('\n❌ The RPC function still produces unloggable users. Check SQL function.');
    process.exit(1);
  }

  console.log('✅ LOGIN SUCCEEDED! User ID:', loginData.user?.id);
  console.log('\nThe hotel approval flow is working correctly!');
  console.log(`\nCleanup: Delete test user "${TEST_EMAIL}" from Supabase Auth dashboard.`);
}

verify().catch(console.error);
