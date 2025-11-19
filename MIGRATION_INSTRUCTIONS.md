# Database Migration Instructions

## Current Issues

Your application is experiencing errors because the recent database migration has not been applied to your Supabase instance.

### Errors You're Seeing:

1. **500 Error on Signup**: "Database error saving new user"
   - The `user_profiles` table doesn't exist yet
   - The `initialize_user_profile()` trigger can't run

2. **403 Errors on API Calls**: These may be caused by missing user profile data

## How to Apply the Migration

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Navigate to **SQL Editor**
3. Open the migration file: `supabase/migrations/add_user_tracking_and_limits.sql`
4. Copy the entire contents of that file
5. Paste it into the SQL Editor
6. Click **Run** to execute the migration

### Option 2: Using Supabase CLI

If you have the Supabase CLI installed:

```bash
# Login to Supabase
supabase login

# Link your project
supabase link --project-ref <your-project-ref>

# Push migrations
supabase db push
```

### Option 3: Manual Table Creation (Quick Fix)

If you just want to get unblocked quickly, you can create the tables manually:

1. Go to Supabase Dashboard → SQL Editor
2. Run this minimal migration:

```sql
-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR NOT NULL UNIQUE,
  tier VARCHAR NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'premium')),
  questions_completed INTEGER NOT NULL DEFAULT 0,
  demo_completed BOOLEAN NOT NULL DEFAULT false,
  upgraded_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trigger to initialize profiles on signup
CREATE OR REPLACE FUNCTION initialize_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (user_id, email, tier, questions_completed, demo_completed)
  VALUES (NEW.id, NEW.email, 'free', 0, false)
  ON CONFLICT (email) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION initialize_user_profile();
```

## Verification

After applying the migration, verify it worked:

1. Try signing up a new test user
2. Check that no "Database error saving new user" appears
3. Verify the user_profiles table exists and has data

## Next Steps

After the migration is applied:

1. Test user signup
2. Test pack creation
3. Test user stats and completed packs endpoints

If you continue to see 403 errors, check the browser console and server logs for the detailed error messages we added.
