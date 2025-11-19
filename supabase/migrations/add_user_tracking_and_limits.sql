-- Migration: Add user tracking, conversations, and tier system
-- Created: 2025-11-19

-- =====================================================
-- 1. USER PROFILES TABLE
-- =====================================================
-- Stores user tier information and usage limits
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

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_tier ON user_profiles(tier);

-- =====================================================
-- 2. CONVERSATIONS TABLE
-- =====================================================
-- Stores all AI conversation sessions
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email VARCHAR NOT NULL,
  pack_id VARCHAR,
  question_object_id VARCHAR,
  is_demo BOOLEAN NOT NULL DEFAULT false,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_conversations_user_email ON conversations(user_email);
CREATE INDEX IF NOT EXISTS idx_conversations_pack_id ON conversations(pack_id);
CREATE INDEX IF NOT EXISTS idx_conversations_started_at ON conversations(started_at DESC);

-- =====================================================
-- 3. CONVERSATION MESSAGES TABLE
-- =====================================================
-- Stores individual messages within conversations
CREATE TABLE IF NOT EXISTS conversation_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  role VARCHAR NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  tokens_used INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_conversation_messages_conversation_id ON conversation_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_conversation_messages_created_at ON conversation_messages(created_at);

-- =====================================================
-- 4. FUNCTION: Initialize user profile on signup
-- =====================================================
CREATE OR REPLACE FUNCTION initialize_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (user_id, email, tier, questions_completed, demo_completed)
  VALUES (
    NEW.id,
    NEW.email,
    'free',
    0,
    false
  )
  ON CONFLICT (email) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION initialize_user_profile();

-- =====================================================
-- 5. FUNCTION: Update user profile timestamp
-- =====================================================
CREATE OR REPLACE FUNCTION update_user_profile_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update timestamp
DROP TRIGGER IF EXISTS update_user_profiles_timestamp ON user_profiles;
CREATE TRIGGER update_user_profiles_timestamp
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_user_profile_timestamp();

-- =====================================================
-- 6. FUNCTION: Check if user can access content
-- =====================================================
CREATE OR REPLACE FUNCTION can_user_access_question(p_user_email VARCHAR)
RETURNS BOOLEAN AS $$
DECLARE
  v_tier VARCHAR;
  v_questions_completed INTEGER;
  v_demo_completed BOOLEAN;
BEGIN
  -- Get user profile
  SELECT tier, questions_completed, demo_completed
  INTO v_tier, v_questions_completed, v_demo_completed
  FROM user_profiles
  WHERE email = p_user_email;

  -- If no profile found, create one (for backwards compatibility)
  IF NOT FOUND THEN
    RETURN true; -- Allow access for now, profile will be created
  END IF;

  -- Premium users have unlimited access
  IF v_tier = 'premium' THEN
    RETURN true;
  END IF;

  -- Free users can access demo + 1 question
  -- Demo doesn't count toward the limit
  -- After 1 completed question, they're locked
  IF v_questions_completed >= 1 THEN
    RETURN false;
  END IF;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 7. FUNCTION: Increment questions completed
-- =====================================================
CREATE OR REPLACE FUNCTION increment_questions_completed(p_user_email VARCHAR, p_count INTEGER DEFAULT 1)
RETURNS void AS $$
BEGIN
  UPDATE user_profiles
  SET questions_completed = questions_completed + p_count
  WHERE email = p_user_email;

  -- If no profile exists, create one
  IF NOT FOUND THEN
    INSERT INTO user_profiles (user_id, email, questions_completed)
    SELECT id, p_user_email, p_count
    FROM auth.users
    WHERE email = p_user_email
    ON CONFLICT (email) DO UPDATE
    SET questions_completed = user_profiles.questions_completed + p_count;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 8. FUNCTION: Mark demo as completed
-- =====================================================
CREATE OR REPLACE FUNCTION mark_demo_completed(p_user_email VARCHAR)
RETURNS void AS $$
BEGIN
  UPDATE user_profiles
  SET demo_completed = true
  WHERE email = p_user_email;

  -- If no profile exists, create one
  IF NOT FOUND THEN
    INSERT INTO user_profiles (user_id, email, demo_completed)
    SELECT id, p_user_email, true
    FROM auth.users
    WHERE email = p_user_email
    ON CONFLICT (email) DO UPDATE
    SET demo_completed = true;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 9. FUNCTION: Upgrade user to premium
-- =====================================================
CREATE OR REPLACE FUNCTION upgrade_user_to_premium(p_user_email VARCHAR)
RETURNS void AS $$
BEGIN
  UPDATE user_profiles
  SET tier = 'premium',
      upgraded_at = NOW()
  WHERE email = p_user_email;

  -- If no profile exists, create one as premium
  IF NOT FOUND THEN
    INSERT INTO user_profiles (user_id, email, tier, upgraded_at)
    SELECT id, p_user_email, 'premium', NOW()
    FROM auth.users
    WHERE email = p_user_email
    ON CONFLICT (email) DO UPDATE
    SET tier = 'premium',
        upgraded_at = NOW();
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 10. ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on new tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_messages ENABLE ROW LEVEL SECURITY;

-- User profiles: Users can read their own profile
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.email() = email);

-- User profiles: Service role can do anything
CREATE POLICY "Service role full access to profiles" ON user_profiles
  FOR ALL USING (auth.role() = 'service_role');

-- Conversations: Users can view their own conversations
CREATE POLICY "Users can view own conversations" ON conversations
  FOR SELECT USING (auth.email() = user_email);

-- Conversations: Service role can do anything
CREATE POLICY "Service role full access to conversations" ON conversations
  FOR ALL USING (auth.role() = 'service_role');

-- Conversation messages: Users can view messages in their conversations
CREATE POLICY "Users can view own conversation messages" ON conversation_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = conversation_messages.conversation_id
      AND conversations.user_email = auth.email()
    )
  );

-- Conversation messages: Service role can do anything
CREATE POLICY "Service role full access to messages" ON conversation_messages
  FOR ALL USING (auth.role() = 'service_role');

-- =====================================================
-- 11. GRANT PERMISSIONS
-- =====================================================

-- Grant access to authenticated users
GRANT SELECT ON user_profiles TO authenticated;
GRANT SELECT ON conversations TO authenticated;
GRANT SELECT ON conversation_messages TO authenticated;

-- Grant full access to service role
GRANT ALL ON user_profiles TO service_role;
GRANT ALL ON conversations TO service_role;
GRANT ALL ON conversation_messages TO service_role;

-- =====================================================
-- 12. COMMENTS
-- =====================================================

COMMENT ON TABLE user_profiles IS 'Stores user tier information and usage tracking for free/premium limits';
COMMENT ON TABLE conversations IS 'Stores AI conversation sessions linked to packs and questions';
COMMENT ON TABLE conversation_messages IS 'Individual messages within conversations';
COMMENT ON FUNCTION can_user_access_question IS 'Returns true if free user hasnt exceeded their 1 question limit, or if premium';
COMMENT ON FUNCTION increment_questions_completed IS 'Increments the questions_completed counter for usage limits';
COMMENT ON FUNCTION mark_demo_completed IS 'Marks the demo as completed for a user';
COMMENT ON FUNCTION upgrade_user_to_premium IS 'Upgrades a user from free to premium tier';
