import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xkhhgapetvgssjvyspkk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhraGhnYXBldHZnc3NqdnlzcGtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1MDQ5MDIsImV4cCI6MjA5NDA4MDkwMn0.86gyZGiCoQsa5CP8mUaxvBSywTaUYIpplzclxweQphQ';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function clearVisits() {
  console.log('Logging in as admin...');
  const { data: adminData, error: adminError } = await supabase.auth.signInWithPassword({
    email: 'parthpawareliteclub@gmail.com',
    password: 'ParthInFifaWorldCup'
  });
  
  if (adminError) {
    console.error('Login failed:', adminError.message);
    process.exit(1);
  }
  
  console.log('Logged in. Deleting open visits...');
  const { error } = await supabase.from('visits').delete().eq('status', 'open');
  
  if (error) {
    console.error('Failed to delete visits:', error.message);
  } else {
    console.log('✅ Successfully removed the stuck open visits!');
  }
  
  await supabase.auth.signOut();
}

clearVisits().catch(console.error);
