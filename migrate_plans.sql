-- 1. Drop the existing constraint
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_plan_check;

-- 2. Migrate existing records to the new plan names
UPDATE profiles SET plan = 'prime' WHERE plan IN ('dainik', 'solo');
UPDATE profiles SET plan = 'shareable' WHERE plan IN ('decka', 'deca');

-- 3. Add the strict constraint with only the new plan names
ALTER TABLE profiles ADD CONSTRAINT profiles_plan_check CHECK (plan IN ('prime', 'shareable') OR plan IS NULL);
