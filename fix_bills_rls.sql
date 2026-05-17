-- Fix: Admin can now read AND write all bills
-- Hotel can read their own bills properly
-- Run this in Supabase SQL Editor

-- Drop old incomplete admin policy
DROP POLICY IF EXISTS "bills_admin_select" ON bills;
DROP POLICY IF EXISTS "bills_hotel_all" ON bills;
DROP POLICY IF EXISTS "bills_hotel_insert" ON bills;
DROP POLICY IF EXISTS "bills_member_select" ON bills;

-- Admin: full access to all bills
CREATE POLICY "bills_admin_all" ON bills FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

-- Hotel: full access to their own hotel's bills
CREATE POLICY "bills_hotel_all" ON bills FOR ALL
  USING (EXISTS (SELECT 1 FROM hotels h WHERE h.auth_user_id = auth.uid() AND h.id = bills.hotel_id));

-- Member: can only see their own bills
CREATE POLICY "bills_member_select" ON bills FOR SELECT
  USING (member_id = auth.uid());
