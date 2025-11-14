# Rate Limiting & Password Protection Setup

This document explains the rate limiting, password protection, and usage tracking features that have been added to the PLEW application.

## Features Implemented

### 1. Universal Password Protection
- **Password**: `SUNNY2025`
- **Location**: Site-wide protection at the root layout level
- **Storage**: Session-based (cleared when browser session ends)
- **Implementation**: `/components/PasswordProtection.tsx` wraps all content

Users must enter the password to access any part of the site. The password is stored in `sessionStorage`, so it persists during the browser session but is cleared when the browser is closed.

### 2. API Usage Tracking
All Anthropic Claude API calls are tracked in Supabase with the following information:
- Model used
- Input tokens
- Output tokens
- Cost in USD
- Endpoint called
- Timestamp

### 3. Rate Limiting ($10 Limit)
- **Budget**: $10 USD total
- **Scope**: Site-wide across all users
- **Behavior**: Once $10 is spent, all API calls are blocked with a 429 status
- **Tracking**: Real-time cost calculation based on Claude Sonnet 4 pricing

#### Current Pricing (January 2025)
- **Input tokens**: $3.00 per million tokens
- **Output tokens**: $15.00 per million tokens

## Setup Instructions

### Step 1: Run SQL Migration in Supabase

1. Log in to your Supabase dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `/supabase-migration.sql`
4. Paste and execute the SQL to create:
   - `api_usage` table
   - `api_usage_summary` view
   - `is_usage_limit_exceeded()` function

**SQL to run:**
```sql
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

-- Create index for faster queries
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
```

### Step 2: Verify Environment Variables

Ensure these are set in your `.env.local` (development) or Vercel environment variables (production):

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Anthropic
ANTHROPIC_API_KEY=your_anthropic_api_key
```

### Step 3: Deploy

After running the SQL migration, deploy your application. The features will be active immediately.

## Usage Monitoring

### Check Current Usage

You can monitor API usage by visiting:
```
GET /api/usage
```

**Example Response:**
```json
{
  "totalCost": 2.456789,
  "totalRequests": 145,
  "remainingBudget": 7.543211,
  "limitExceeded": false,
  "limit": 10.0,
  "percentageUsed": "24.57%"
}
```

### Query Usage in Supabase

You can also check usage directly in Supabase SQL Editor:

```sql
-- Get total usage summary
SELECT * FROM api_usage_summary;

-- Get recent requests
SELECT * FROM api_usage ORDER BY created_at DESC LIMIT 10;

-- Check if limit exceeded
SELECT is_usage_limit_exceeded(10.0);

-- Get usage by endpoint
SELECT
  endpoint,
  COUNT(*) as requests,
  SUM(cost_usd) as total_cost
FROM api_usage
GROUP BY endpoint;
```

## Resetting the Usage Limit

If you need to reset usage (e.g., after adding more budget):

```sql
-- Option 1: Delete all usage records (complete reset)
DELETE FROM api_usage;

-- Option 2: Delete records older than a certain date
DELETE FROM api_usage WHERE created_at < '2025-01-01';

-- Option 3: Archive old data and start fresh
-- (Create backup table first)
CREATE TABLE api_usage_archive AS SELECT * FROM api_usage;
DELETE FROM api_usage;
```

## Changing the Password

To change the site password, edit `/components/PasswordProtection.tsx`:

```typescript
const CORRECT_PASSWORD = 'SUNNY2025' // Change this
```

## Changing the Usage Limit

To change the $10 limit, edit `/lib/usage-tracking.ts`:

```typescript
const USAGE_LIMIT_USD = 10.0 // Change this value
```

## How It Works

### Password Protection Flow
1. User visits site
2. `PasswordProtection` component checks `sessionStorage` for valid token
3. If not found, shows password prompt
4. User enters password `SUNNY2025`
5. On correct password, token is stored and content is revealed
6. Token persists for browser session only

### Rate Limiting Flow
1. User sends chat message
2. API route checks if limit exceeded via `isUsageLimitExceeded()`
3. If limit exceeded, returns 429 error with usage summary
4. If limit OK, processes request
5. After API response, calculates cost based on token usage
6. Tracks usage in Supabase via `trackUsage()`
7. Returns response to user

## Files Modified/Created

### Created Files
- `/components/PasswordProtection.tsx` - Password gate component
- `/lib/usage-tracking.ts` - Usage tracking utilities
- `/app/api/usage/route.ts` - Usage monitoring endpoint
- `/supabase-migration.sql` - Database schema
- `/RATE_LIMITING_SETUP.md` - This documentation

### Modified Files
- `/app/layout.tsx` - Added PasswordProtection wrapper
- `/app/api/chat/route.ts` - Added rate limiting and usage tracking
- `/app/api/demo-chat/route.ts` - Added rate limiting and usage tracking

## Troubleshooting

### "Usage limit reached" but budget shows less than $10
- Check Supabase connection
- Verify `api_usage` table exists
- Run: `SELECT SUM(cost_usd) FROM api_usage;` in SQL Editor

### Password not working
- Ensure exact match: `SUNNY2025` (all caps)
- Check browser console for errors
- Try incognito mode to clear session

### Usage not being tracked
- Verify Supabase credentials are correct
- Check `SUPABASE_SERVICE_ROLE_KEY` is set
- Look for errors in server logs
- Verify table permissions in Supabase

## Security Considerations

1. **Password Storage**: The password is stored in code. For production, consider environment variables or a more secure auth system.
2. **Rate Limiting**: Currently global across all users. Consider per-user limits for better control.
3. **Service Role Key**: Keep `SUPABASE_SERVICE_ROLE_KEY` secret - never commit to git or expose client-side.

## Future Enhancements

Potential improvements:
- Per-user rate limiting
- Daily/weekly reset schedules
- Usage alerts/notifications
- More secure authentication (JWT, OAuth)
- Usage analytics dashboard
- Configurable limits via admin panel
