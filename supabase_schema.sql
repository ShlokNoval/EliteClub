-- ═══════════════════════════════════════════════
--  EliteClub — Complete Database Schema
--  Run this ENTIRE script in Supabase SQL Editor
-- ═══════════════════════════════════════════════

-- 1. Profiles (admin + member users)
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text NOT NULL DEFAULT '',
  phone text DEFAULT '',
  role text NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('active', 'inactive', 'pending', 'expired')),
  plan text CHECK (plan IN ('dainik', 'decka') OR plan IS NULL),
  card_id text UNIQUE,
  member_id text UNIQUE,
  join_date timestamptz,
  expiry_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. QR Card Inventory
CREATE TABLE qr_cards (
  id serial PRIMARY KEY,
  card_id text UNIQUE NOT NULL,
  status text NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'assigned', 'suspended')),
  assigned_to uuid REFERENCES profiles(id) ON DELETE SET NULL,
  assigned_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- 3. Hotels
CREATE TABLE hotels (
  id serial PRIMARY KEY,
  auth_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  name text NOT NULL,
  contact_person text NOT NULL DEFAULT '',
  phone text DEFAULT '',
  email text NOT NULL,
  location text DEFAULT '',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
  scan_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 4. Scans log
CREATE TABLE scans (
  id serial PRIMARY KEY,
  card_id text NOT NULL,
  hotel_id integer REFERENCES hotels(id),
  member_id uuid REFERENCES profiles(id),
  scan_type text NOT NULL CHECK (scan_type IN ('check_in', 'check_out')),
  result text NOT NULL CHECK (result IN ('valid', 'expired', 'invalid', 'blocked', 'not_found')),
  created_at timestamptz DEFAULT now()
);

-- 5. Visits
CREATE TABLE visits (
  id serial PRIMARY KEY,
  member_id uuid NOT NULL REFERENCES profiles(id),
  hotel_id integer NOT NULL REFERENCES hotels(id),
  check_in timestamptz NOT NULL DEFAULT now(),
  check_out timestamptz,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed')),
  created_at timestamptz DEFAULT now()
);

-- 6. Bills
CREATE TABLE bills (
  id serial PRIMARY KEY,
  visit_id integer REFERENCES visits(id),
  hotel_id integer NOT NULL REFERENCES hotels(id),
  member_id uuid NOT NULL REFERENCES profiles(id),
  food_bev_cost numeric NOT NULL DEFAULT 0,
  liquor_cost_original numeric NOT NULL DEFAULT 0,
  liquor_cost_billed numeric NOT NULL DEFAULT 0,
  savings numeric GENERATED ALWAYS AS (liquor_cost_original - liquor_cost_billed) STORED,
  bill_image_url text,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- ═══ Database Functions ═══

-- Look up email by member ID (for member login)
CREATE OR REPLACE FUNCTION get_email_by_member_id(p_member_id text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_email text;
BEGIN
  SELECT email INTO v_email FROM profiles
  WHERE member_id = p_member_id AND role = 'member';
  RETURN v_email;
END;
$$;

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER hotels_updated_at
  BEFORE UPDATE ON hotels
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ═══ Row Level Security ═══

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE bills ENABLE ROW LEVEL SECURITY;

-- PROFILES policies
CREATE POLICY "profiles_admin_all" ON profiles FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

CREATE POLICY "profiles_own_select" ON profiles FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "profiles_hotel_read" ON profiles FOR SELECT
  USING (EXISTS (SELECT 1 FROM hotels h WHERE h.auth_user_id = auth.uid() AND h.status = 'verified'));

-- QR_CARDS policies
CREATE POLICY "qr_admin_all" ON qr_cards FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

CREATE POLICY "qr_own_select" ON qr_cards FOR SELECT
  USING (assigned_to = auth.uid());

CREATE POLICY "qr_hotel_select" ON qr_cards FOR SELECT
  USING (EXISTS (SELECT 1 FROM hotels h WHERE h.auth_user_id = auth.uid() AND h.status = 'verified'));

-- HOTELS policies
CREATE POLICY "hotels_admin_all" ON hotels FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

CREATE POLICY "hotels_anon_insert" ON hotels FOR INSERT
  WITH CHECK (true);

CREATE POLICY "hotels_own_select" ON hotels FOR SELECT
  USING (auth_user_id = auth.uid());

-- SCANS policies
CREATE POLICY "scans_admin_select" ON scans FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

CREATE POLICY "scans_hotel_all" ON scans FOR ALL
  USING (EXISTS (SELECT 1 FROM hotels h WHERE h.auth_user_id = auth.uid() AND h.id = scans.hotel_id));

CREATE POLICY "scans_hotel_insert" ON scans FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM hotels h WHERE h.auth_user_id = auth.uid() AND h.status = 'verified'));

CREATE POLICY "scans_member_select" ON scans FOR SELECT
  USING (member_id = auth.uid());

-- VISITS policies
CREATE POLICY "visits_admin_select" ON visits FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

CREATE POLICY "visits_hotel_all" ON visits FOR ALL
  USING (EXISTS (SELECT 1 FROM hotels h WHERE h.auth_user_id = auth.uid() AND h.id = visits.hotel_id));

CREATE POLICY "visits_hotel_insert" ON visits FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM hotels h WHERE h.auth_user_id = auth.uid() AND h.status = 'verified'));

CREATE POLICY "visits_member_select" ON visits FOR SELECT
  USING (member_id = auth.uid());

-- BILLS policies
CREATE POLICY "bills_admin_select" ON bills FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

CREATE POLICY "bills_hotel_all" ON bills FOR ALL
  USING (EXISTS (SELECT 1 FROM hotels h WHERE h.auth_user_id = auth.uid() AND h.id = bills.hotel_id));

CREATE POLICY "bills_hotel_insert" ON bills FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM hotels h WHERE h.auth_user_id = auth.uid() AND h.status = 'verified'));

CREATE POLICY "bills_member_select" ON bills FOR SELECT
  USING (member_id = auth.uid());

-- ═══ Seed Admin Profile ═══
INSERT INTO profiles (id, email, full_name, role, status)
VALUES (
  'f84ef0bd-df53-4fc4-8047-815e6eb65c28',
  'parthpawareliteclub@gmail.com',
  'EliteClubCSN',
  'admin',
  'active'
);

-- ═══ Generate 1111 QR Cards (K002098 to K003208) ═══
INSERT INTO qr_cards (card_id, status)
SELECT 'K' || LPAD((2098 + g)::text, 6, '0'), 'available'
FROM generate_series(0, 1110) AS g;
