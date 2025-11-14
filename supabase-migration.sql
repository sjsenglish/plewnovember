-- Migration: Create API usage tracking table
-- Run this SQL in your Supabase SQL Editor

-- Create api_usage table to track all Claude API calls
CREATE TABLE IF NOT EXISTS api_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  model TEXT NOT NULL,
  input_tokens INTEGER NOT NULL,
  output_tokens INTEGER NOT NULL,
  cost_usd DECIMAL(10, 6) NOT NULL,
  endpoint TEXT NOT NULL,
  session_id TEXT,
  CONSTRAINT positive_tokens CHECK (input_tokens >= 0 AND output_tokens >= 0),
  CONSTRAINT positive_cost CHECK (cost_usd >= 0)
);

-- Create index for faster queries on created_at
CREATE INDEX IF NOT EXISTS idx_api_usage_created_at ON api_usage(created_at DESC);

-- Create a view for total usage
CREATE OR REPLACE VIEW api_usage_summary AS
SELECT
  COUNT(*) as total_requests,
  SUM(input_tokens) as total_input_tokens,
  SUM(output_tokens) as total_output_tokens,
  SUM(cost_usd) as total_cost_usd,
  MAX(created_at) as last_request_at
FROM api_usage;

-- Create a function to check if usage limit is exceeded
CREATE OR REPLACE FUNCTION is_usage_limit_exceeded(limit_usd DECIMAL DEFAULT 10.0)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (SELECT COALESCE(SUM(cost_usd), 0) FROM api_usage) >= limit_usd;
END;
$$ LANGUAGE plpgsql;

COMMENT ON TABLE api_usage IS 'Tracks all Anthropic API usage and costs';
COMMENT ON VIEW api_usage_summary IS 'Provides quick summary of total API usage';
COMMENT ON FUNCTION is_usage_limit_exceeded IS 'Returns true if total usage exceeds the specified limit (default $10)';
