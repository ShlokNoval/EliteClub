-- ==============================================================================
-- DANGER: PRODUCTION DATABASE CLEANUP SCRIPT
-- This will delete ALL users (except admin), hotels, visits, and scans.
-- It will also recreate exactly 300 QR codes starting from K002098.
-- ==============================================================================

-- 1. Delete all dependent records
DELETE FROM bills;
DELETE FROM visits;
DELETE FROM scans;

-- 2. Delete all hotels
DELETE FROM hotels;

-- 3. Delete all QR cards
DELETE FROM qr_cards;

-- 4. Delete all non-admin profiles
DELETE FROM profiles WHERE role != 'admin';

-- 5. Delete from auth.users (the core authentication table), except admin
DELETE FROM auth.users 
WHERE id NOT IN (
    SELECT id FROM profiles WHERE role = 'admin'
);

-- 6. Generate 300 QR Cards (K002098 to K002397)
INSERT INTO qr_cards (card_id, status)
SELECT 'K' || LPAD((2098 + g)::text, 6, '0'), 'available'
FROM generate_series(0, 299) AS g;
