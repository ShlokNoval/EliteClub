-- ═══════════════════════════════════════════════
--  EliteClub — Migration Script for Quotas & OTP
--  Run this in the Supabase SQL Editor
-- ═══════════════════════════════════════════════

-- 1. Modify PROFILES table
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_plan_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_plan_check CHECK (plan IN ('dainik', 'decka', 'solo', 'shareable') OR plan IS NULL);

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS unlimited_day_used_at timestamptz;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS otp_code text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS otp_expires_at timestamptz;

-- 2. Modify HOTELS table
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS nip_limit integer DEFAULT 4;
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS beer_limit integer DEFAULT 8;

-- 3. Modify BILLS table
ALTER TABLE bills ADD COLUMN IF NOT EXISTS nips_consumed integer DEFAULT 0;
ALTER TABLE bills ADD COLUMN IF NOT EXISTS beers_consumed integer DEFAULT 0;

-- 4. Update existing records with default values if necessary
UPDATE hotels SET nip_limit = 4, beer_limit = 8 WHERE nip_limit IS NULL;
UPDATE bills SET nips_consumed = 0, beers_consumed = 0 WHERE nips_consumed IS NULL;

ALTER TABLE visits ADD COLUMN IF NOT EXISTS is_manual boolean DEFAULT false;

-- 5. Fix Admin RLS for Manual Approvals
DROP POLICY IF EXISTS "visits_admin_all" ON visits;
CREATE POLICY "visits_admin_all" ON visits FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

DROP POLICY IF EXISTS "scans_admin_all" ON scans;
CREATE POLICY "scans_admin_all" ON scans FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));
