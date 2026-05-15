import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xkhhgapetvgssjvyspkk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhraGhnYXBldHZnc3NqdnlzcGtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1MDQ5MDIsImV4cCI6MjA5NDA4MDkwMn0.86gyZGiCoQsa5CP8mUaxvBSywTaUYIpplzclxweQphQ';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkHotels() {
  const { data, error } = await supabase.from('hotels').select('id, name, status');
  if (error) console.error(error);
  console.log(data);
}
checkHotels();
