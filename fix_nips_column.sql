-- Fix: Allow fractional nips (e.g. 1.5 nips = 3 beers)
-- Run this once in Supabase SQL Editor
ALTER TABLE bills ALTER COLUMN nips_consumed TYPE numeric USING nips_consumed::numeric;
