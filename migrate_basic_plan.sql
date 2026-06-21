-- ═══════════════════════════════════════════════
--  EliteClub — Basic Plan Migration
--  Run this ENTIRE script in Supabase SQL Editor
-- ═══════════════════════════════════════════════

-- 1. Drop and re-create the CHECK constraint on profiles.plan to allow 'basic'
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_plan_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_plan_check CHECK (plan IN ('prime', 'shareable', 'basic') OR plan IS NULL);

-- 2. Add visits_used column to track Basic Plan visit consumption
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS visits_used integer DEFAULT 0;

-- 3. Create basic_plan_venues table — stores which hotels Basic Plan members can visit
CREATE TABLE IF NOT EXISTS basic_plan_venues (
  id serial PRIMARY KEY,
  hotel_id integer NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(hotel_id)
);

-- 4. Enable RLS on basic_plan_venues
ALTER TABLE basic_plan_venues ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies for basic_plan_venues
-- Admin can do everything
CREATE POLICY "basic_venues_admin_all" ON basic_plan_venues FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

-- Hotels can read (to know if they are a Basic Plan venue)
CREATE POLICY "basic_venues_hotel_select" ON basic_plan_venues FOR SELECT
  USING (EXISTS (SELECT 1 FROM hotels h WHERE h.auth_user_id = auth.uid() AND h.status = 'verified'));

-- Members can read (to see which venues they can visit)
CREATE POLICY "basic_venues_member_select" ON basic_plan_venues FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'member'));

-- ═══ Done! ═══
-- After running this, the frontend changes can go live.
