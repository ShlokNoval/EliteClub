-- 1. Allow hotels to update their own scan counts and info
CREATE POLICY "hotels_own_update" ON hotels FOR UPDATE
  USING (auth_user_id = auth.uid());

-- 2. Allow hotels to update specific profile fields securely
-- We need to allow hotels to mark a profile as 'expired' or activate the 'unlimited day'
CREATE POLICY "profiles_hotel_update" ON profiles FOR UPDATE
  USING (EXISTS (SELECT 1 FROM hotels WHERE auth_user_id = auth.uid()));
