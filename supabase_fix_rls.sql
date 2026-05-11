-- ═══════════════════════════════════════════════
--  EliteClub — FIX RLS Policies (Infinite Recursion)
--  Run this in Supabase SQL Editor
-- ═══════════════════════════════════════════════

-- Drop ALL existing policies first
DROP POLICY IF EXISTS "profiles_admin_all" ON profiles;
DROP POLICY IF EXISTS "profiles_own_select" ON profiles;
DROP POLICY IF EXISTS "profiles_hotel_read" ON profiles;

DROP POLICY IF EXISTS "qr_admin_all" ON qr_cards;
DROP POLICY IF EXISTS "qr_own_select" ON qr_cards;
DROP POLICY IF EXISTS "qr_hotel_select" ON qr_cards;

DROP POLICY IF EXISTS "hotels_admin_all" ON hotels;
DROP POLICY IF EXISTS "hotels_anon_insert" ON hotels;
DROP POLICY IF EXISTS "hotels_own_select" ON hotels;

DROP POLICY IF EXISTS "scans_admin_select" ON scans;
DROP POLICY IF EXISTS "scans_hotel_all" ON scans;
DROP POLICY IF EXISTS "scans_hotel_insert" ON scans;
DROP POLICY IF EXISTS "scans_member_select" ON scans;

DROP POLICY IF EXISTS "visits_admin_select" ON visits;
DROP POLICY IF EXISTS "visits_hotel_all" ON visits;
DROP POLICY IF EXISTS "visits_hotel_insert" ON visits;
DROP POLICY IF EXISTS "visits_member_select" ON visits;

DROP POLICY IF EXISTS "bills_admin_select" ON bills;
DROP POLICY IF EXISTS "bills_hotel_all" ON bills;
DROP POLICY IF EXISTS "bills_hotel_insert" ON bills;
DROP POLICY IF EXISTS "bills_member_select" ON bills;

-- ═══ Helper function to check role without recursion ═══
CREATE OR REPLACE FUNCTION get_user_role(user_id uuid)
RETURNS text
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT role FROM profiles WHERE id = user_id LIMIT 1;
$$;

-- Helper to get hotel id for current user
CREATE OR REPLACE FUNCTION get_my_hotel_id()
RETURNS integer
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT id FROM hotels WHERE auth_user_id = auth.uid() LIMIT 1;
$$;

-- ═══ PROFILES Policies ═══
-- Admin full access (uses function to avoid recursion)
CREATE POLICY "profiles_admin_all" ON profiles FOR ALL
  USING (get_user_role(auth.uid()) = 'admin');

-- Users read own profile
CREATE POLICY "profiles_own_select" ON profiles FOR SELECT
  USING (id = auth.uid());

-- ═══ QR_CARDS Policies ═══
CREATE POLICY "qr_admin_all" ON qr_cards FOR ALL
  USING (get_user_role(auth.uid()) = 'admin');

CREATE POLICY "qr_own_select" ON qr_cards FOR SELECT
  USING (assigned_to = auth.uid());

CREATE POLICY "qr_hotel_select" ON qr_cards FOR SELECT
  USING (get_my_hotel_id() IS NOT NULL);

-- Allow anonymous read for scan page (public QR scan)
CREATE POLICY "qr_anon_select" ON qr_cards FOR SELECT
  USING (true);

-- ═══ HOTELS Policies ═══
CREATE POLICY "hotels_admin_all" ON hotels FOR ALL
  USING (get_user_role(auth.uid()) = 'admin');

-- Anyone can insert hotel registration request
CREATE POLICY "hotels_anon_insert" ON hotels FOR INSERT
  WITH CHECK (true);

-- Hotels read own record
CREATE POLICY "hotels_own_select" ON hotels FOR SELECT
  USING (auth_user_id = auth.uid());

-- ═══ SCANS Policies ═══
CREATE POLICY "scans_admin_select" ON scans FOR SELECT
  USING (get_user_role(auth.uid()) = 'admin');

CREATE POLICY "scans_hotel_insert" ON scans FOR INSERT
  WITH CHECK (get_my_hotel_id() IS NOT NULL);

CREATE POLICY "scans_hotel_select" ON scans FOR SELECT
  USING (hotel_id = get_my_hotel_id());

CREATE POLICY "scans_member_select" ON scans FOR SELECT
  USING (member_id = auth.uid());

-- ═══ VISITS Policies ═══
CREATE POLICY "visits_admin_select" ON visits FOR SELECT
  USING (get_user_role(auth.uid()) = 'admin');

CREATE POLICY "visits_hotel_insert" ON visits FOR INSERT
  WITH CHECK (get_my_hotel_id() IS NOT NULL);

CREATE POLICY "visits_hotel_select" ON visits FOR SELECT
  USING (hotel_id = get_my_hotel_id());

CREATE POLICY "visits_hotel_update" ON visits FOR UPDATE
  USING (hotel_id = get_my_hotel_id());

CREATE POLICY "visits_member_select" ON visits FOR SELECT
  USING (member_id = auth.uid());

-- Anonymous can read visits for scan page check-in/check-out status
CREATE POLICY "visits_anon_select" ON visits FOR SELECT
  USING (true);

-- ═══ BILLS Policies ═══
CREATE POLICY "bills_admin_select" ON bills FOR SELECT
  USING (get_user_role(auth.uid()) = 'admin');

CREATE POLICY "bills_hotel_insert" ON bills FOR INSERT
  WITH CHECK (get_my_hotel_id() IS NOT NULL);

CREATE POLICY "bills_hotel_select" ON bills FOR SELECT
  USING (hotel_id = get_my_hotel_id());

CREATE POLICY "bills_member_select" ON bills FOR SELECT
  USING (member_id = auth.uid());

-- ═══ PROFILES: Allow hotel users to read member profiles for verification ═══
CREATE POLICY "profiles_hotel_read" ON profiles FOR SELECT
  USING (get_my_hotel_id() IS NOT NULL);

-- Allow anonymous read on profiles for scan page
CREATE POLICY "profiles_anon_select" ON profiles FOR SELECT
  USING (true);
