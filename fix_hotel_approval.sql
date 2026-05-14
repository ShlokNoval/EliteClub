-- ════════════════════════════════════════════════════
--  EliteClub — EMERGENCY CLEANUP + FULL RESET
--  Run ENTIRE script in Supabase SQL Editor
-- ════════════════════════════════════════════════════

-- Step 1: Clean up broken auth records (type-safe casts)

DELETE FROM auth.identities 
WHERE user_id IN (
  SELECT id FROM auth.users 
  WHERE email IN ('hotel@gmail.com', 'debugtest123@gmail.com')
);

DELETE FROM auth.sessions 
WHERE user_id IN (
  SELECT id FROM auth.users 
  WHERE email IN ('hotel@gmail.com', 'debugtest123@gmail.com')
);

-- refresh_tokens.user_id is varchar, so cast uuid to text
DELETE FROM auth.refresh_tokens 
WHERE user_id IN (
  SELECT id::text FROM auth.users 
  WHERE email IN ('hotel@gmail.com', 'debugtest123@gmail.com')
);

-- Also clean up the diagnostic test user by ID
DELETE FROM auth.identities WHERE user_id = 'ba44dc4a-0187-4ead-a5a0-fd7f321afe3b'::uuid;
DELETE FROM auth.sessions   WHERE user_id = 'ba44dc4a-0187-4ead-a5a0-fd7f321afe3b'::uuid;
DELETE FROM auth.refresh_tokens WHERE user_id = 'ba44dc4a-0187-4ead-a5a0-fd7f321afe3b';
DELETE FROM auth.users WHERE id = 'ba44dc4a-0187-4ead-a5a0-fd7f321afe3b'::uuid;

DELETE FROM auth.users WHERE email IN ('hotel@gmail.com', 'debugtest123@gmail.com');

-- ════════════════════════════════════════════════════
-- Step 2: Recreate create_hotel_user RPC
-- ════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION create_hotel_user(p_email text, p_password text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_uid uuid;
  v_is_admin boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ) INTO v_is_admin;

  IF NOT v_is_admin THEN
    RAISE EXCEPTION 'Not authorized.';
  END IF;

  IF EXISTS (SELECT 1 FROM auth.users WHERE email = p_email) THEN
    RAISE EXCEPTION 'User with this email already exists.';
  END IF;

  v_uid := gen_random_uuid();

  INSERT INTO auth.users (
    id, instance_id, aud, role,
    email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin, created_at, updated_at,
    confirmation_token, recovery_token, email_change_token_new, email_change
  ) VALUES (
    v_uid,
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    p_email,
    crypt(p_password, gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    false,
    now(), now(),
    '', '', '', ''
  );

  INSERT INTO auth.identities (
    id, user_id, provider_id, identity_data, provider,
    last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(),
    v_uid,
    v_uid::text,
    format('{"sub":"%s","email":"%s","email_verified":true,"phone_verified":false}', v_uid::text, p_email)::jsonb,
    'email',
    now(), now(), now()
  );

  RETURN v_uid;
END;
$$;

-- ════════════════════════════════════════════════════
-- Step 3: Recreate create_member_user RPC
-- ════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION create_member_user(p_email text, p_password text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_uid uuid;
  v_is_admin boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ) INTO v_is_admin;

  IF NOT v_is_admin THEN
    RAISE EXCEPTION 'Not authorized.';
  END IF;

  IF EXISTS (SELECT 1 FROM auth.users WHERE email = p_email) THEN
    RAISE EXCEPTION 'User with this email already exists.';
  END IF;

  v_uid := gen_random_uuid();

  INSERT INTO auth.users (
    id, instance_id, aud, role,
    email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin, created_at, updated_at,
    confirmation_token, recovery_token, email_change_token_new, email_change
  ) VALUES (
    v_uid,
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    p_email,
    crypt(p_password, gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    false,
    now(), now(),
    '', '', '', ''
  );

  INSERT INTO auth.identities (
    id, user_id, provider_id, identity_data, provider,
    last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(),
    v_uid,
    v_uid::text,
    format('{"sub":"%s","email":"%s","email_verified":true,"phone_verified":false}', v_uid::text, p_email)::jsonb,
    'email',
    now(), now(), now()
  );

  RETURN v_uid;
END;
$$;

SELECT 'SUCCESS: Cleanup done, functions updated. Re-approve hotels now.' AS status;
