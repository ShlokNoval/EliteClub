-- ═══════════════════════════════════════════════
--  EliteClub — Fix Admin Profile (The Ultimate Fix)
--  Run this in Supabase SQL Editor
-- ═══════════════════════════════════════════════

DO $$
DECLARE
  admin_uid uuid := 'f84ef0bd-df53-4fc4-8047-815e6eb65c28'; -- Consistent ID
BEGIN
  -- 1. Insert into auth.users if not exists
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'parthpawareliteclub@gmail.com') THEN
    INSERT INTO auth.users (
      id,
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      role,
      aud,
      confirmation_token
    ) VALUES (
      admin_uid,
      '00000000-0000-0000-0000-000000000000',
      'parthpawareliteclub@gmail.com',
      crypt('ParthInFifaWorldCup', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{}',
      now(),
      now(),
      'authenticated',
      'authenticated',
      ''
    );
  ELSE
    -- If user exists, get their ID, update password, and confirm email
    SELECT id INTO admin_uid FROM auth.users WHERE email = 'parthpawareliteclub@gmail.com';
    
    UPDATE auth.users 
    SET encrypted_password = crypt('ParthInFifaWorldCup', gen_salt('bf')),
        email_confirmed_at = COALESCE(email_confirmed_at, now())
    WHERE id = admin_uid;
  END IF;

  -- 2. Insert into public.profiles
  INSERT INTO public.profiles (id, email, full_name, role, status)
  VALUES (
    admin_uid,
    'parthpawareliteclub@gmail.com',
    'EliteClubCSN',
    'admin',
    'active'
  )
  ON CONFLICT (id) DO UPDATE 
  SET role = 'admin', status = 'active';

END $$;
