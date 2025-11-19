-- ============================================================================
-- Script to create a premium user with full unlimited access
-- Run this in Supabase Dashboard > SQL Editor
-- ============================================================================

-- User email to create/upgrade
-- Change this email if needed
DO $$
DECLARE
  v_email VARCHAR := 'seajungson0@gmail.com';
  v_user_id UUID;
  v_user_exists BOOLEAN;
BEGIN
  -- Step 1: Check if user already exists in auth.users
  SELECT EXISTS(
    SELECT 1 FROM auth.users WHERE email = v_email
  ) INTO v_user_exists;

  IF v_user_exists THEN
    RAISE NOTICE '✓ User already exists in auth.users with email: %', v_email;

    -- Get the user ID
    SELECT id INTO v_user_id FROM auth.users WHERE email = v_email;
  ELSE
    RAISE NOTICE '❌ User does not exist in auth.users';
    RAISE NOTICE 'You need to create the user first through the Supabase Dashboard:';
    RAISE NOTICE '  1. Go to Authentication > Users';
    RAISE NOTICE '  2. Click "Create user"';
    RAISE NOTICE '  3. Email: %', v_email;
    RAISE NOTICE '  4. Set a password';
    RAISE NOTICE '  5. Then run this script again';
    RAISE EXCEPTION 'User must be created first';
  END IF;

  -- Step 2: Check if user profile exists
  IF EXISTS(SELECT 1 FROM user_profiles WHERE email = v_email) THEN
    RAISE NOTICE '✓ User profile already exists';
  ELSE
    RAISE NOTICE '⚠ User profile does not exist, creating it now...';
    INSERT INTO user_profiles (id, user_id, email, tier, questions_completed, demo_completed)
    VALUES (v_user_id, v_user_id, v_email, 'free', 0, false);
    RAISE NOTICE '✓ Created user profile';
  END IF;

  -- Step 3: Upgrade user to premium
  PERFORM upgrade_user_to_premium(v_email);
  RAISE NOTICE '✓ Upgraded user to premium tier';

  -- Step 4: Display final status
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ SUCCESS! User created with full access';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Email: %', v_email;
  RAISE NOTICE 'Tier: premium';
  RAISE NOTICE '🎉 User has UNLIMITED access!';
  RAISE NOTICE '';
END $$;

-- Verify the user was upgraded correctly
SELECT
  email,
  tier,
  questions_completed,
  demo_completed,
  upgraded_at,
  created_at
FROM user_profiles
WHERE email = 'seajungson0@gmail.com';
