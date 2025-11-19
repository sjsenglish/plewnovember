-- Migration: Add rate limiting table
-- Created: 2025-11-19
-- Purpose: Replace in-memory rate limiting with persistent database storage

-- =====================================================
-- RATE LIMITS TABLE
-- =====================================================
-- Stores rate limit counters for various API endpoints
CREATE TABLE IF NOT EXISTS rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier VARCHAR NOT NULL UNIQUE, -- format: 'limiter_name:key' (e.g., 'ai-chat:user@example.com')
  count INTEGER NOT NULL DEFAULT 0,
  reset_time BIGINT NOT NULL, -- Unix timestamp in milliseconds
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast lookups by identifier
CREATE INDEX IF NOT EXISTS idx_rate_limits_identifier ON rate_limits(identifier);

-- Index for cleanup queries (finding expired entries)
CREATE INDEX IF NOT EXISTS idx_rate_limits_reset_time ON rate_limits(reset_time);

-- =====================================================
-- FUNCTION: Update timestamp on row update
-- =====================================================
CREATE OR REPLACE FUNCTION update_rate_limits_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update timestamp
DROP TRIGGER IF EXISTS update_rate_limits_timestamp ON rate_limits;
CREATE TRIGGER update_rate_limits_timestamp
  BEFORE UPDATE ON rate_limits
  FOR EACH ROW
  EXECUTE FUNCTION update_rate_limits_timestamp();

-- =====================================================
-- FUNCTION: Cleanup expired rate limit entries
-- =====================================================
CREATE OR REPLACE FUNCTION cleanup_expired_rate_limits()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  -- Delete entries where reset_time has passed
  DELETE FROM rate_limits
  WHERE reset_time < EXTRACT(EPOCH FROM NOW()) * 1000;

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================
-- Enable RLS on rate_limits table
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

-- Service role needs full access for rate limiting operations
CREATE POLICY "Service role full access to rate limits" ON rate_limits
  FOR ALL USING (auth.role() = 'service_role');

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================
-- Only service role should access this table
GRANT ALL ON rate_limits TO service_role;

-- =====================================================
-- COMMENTS
-- =====================================================
COMMENT ON TABLE rate_limits IS 'Persistent storage for API rate limiting across serverless instances';
COMMENT ON FUNCTION cleanup_expired_rate_limits IS 'Removes expired rate limit entries to keep table size manageable';
