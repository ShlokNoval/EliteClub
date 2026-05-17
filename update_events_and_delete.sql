-- 1. Events Table
CREATE TABLE IF NOT EXISTS events (
  id serial PRIMARY KEY,
  title text NOT NULL,
  date timestamptz NOT NULL,
  location text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'completed')),
  created_at timestamptz DEFAULT now()
);

-- 2. Event Responses Table
CREATE TABLE IF NOT EXISTS event_responses (
  id serial PRIMARY KEY,
  event_id integer REFERENCES events(id) ON DELETE CASCADE,
  member_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  status text NOT NULL CHECK (status IN ('interested', 'not_interested')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(event_id, member_id)
);

-- Enable RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_responses ENABLE ROW LEVEL SECURITY;

-- Events Policies
CREATE POLICY "events_admin_all" ON events FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

CREATE POLICY "events_member_select" ON events FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'member'));

-- Event Responses Policies
CREATE POLICY "responses_admin_all" ON event_responses FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

CREATE POLICY "responses_member_select" ON event_responses FOR SELECT
  USING (member_id = auth.uid());

CREATE POLICY "responses_member_insert" ON event_responses FOR INSERT
  WITH CHECK (member_id = auth.uid());

CREATE POLICY "responses_member_update" ON event_responses FOR UPDATE
  USING (member_id = auth.uid());

-- 3. Admin Delete Member RPC
-- Because profiles is ON DELETE CASCADE, deleting auth.users deletes the profile.
-- qr_cards.assigned_to is ON DELETE SET NULL, so the card gets detached.
CREATE OR REPLACE FUNCTION admin_delete_member(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin') THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  -- 1. Set the assigned card back to available BEFORE we delete the user
  UPDATE qr_cards 
  SET status = 'available', assigned_to = NULL, assigned_at = NULL 
  WHERE assigned_to = p_user_id;

  -- 2. Delete the user from auth.users (cascades to profiles)
  DELETE FROM auth.users WHERE id = p_user_id;
END;
$$;
