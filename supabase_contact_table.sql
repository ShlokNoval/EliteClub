-- ═══════════════════════════════════════════════
--  EliteClub — Contact Messages Table
--  Run this in Supabase SQL Editor
-- ═══════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS contact_messages (
  id serial PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  phone text DEFAULT '',
  message text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Allow anyone to insert (public contact form)
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone_can_insert_contact" ON contact_messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "admin_can_read_contact" ON contact_messages
  FOR ALL USING (get_user_role(auth.uid()) = 'admin');
