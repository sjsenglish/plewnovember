# Admin Scripts - Create Premium User

This directory contains scripts to create users with full premium access (unlimited questions and chats).

## Option 1: SQL Script (Recommended - Easiest)

The simplest way is to run the SQL script directly in Supabase:

### Steps:

1. **Go to Supabase Dashboard**
   - Open your Supabase project
   - Navigate to: **SQL Editor**

2. **Create the Auth User First** (if not already created)
   - Go to: **Authentication > Users**
   - Click **"Create user"**
   - Enter email: `seajungson0@gmail.com`
   - Set a password
   - Click **"Create user"**

3. **Run the SQL Script**
   - Copy the contents of `scripts/create-premium-user.sql`
   - Paste it into the SQL Editor
   - Click **"Run"**

4. **Done!** The user now has unlimited access.

### What the SQL script does:
- ✅ Checks if user exists
- ✅ Creates user profile if needed
- ✅ Upgrades user to premium tier
- ✅ Verifies the upgrade
- ✅ Shows confirmation

---

## Option 2: TypeScript Script (Requires .env setup)

If you have environment variables configured, you can use the TypeScript script:

### Prerequisites:
1. Create `.env.local` file with:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Usage:
```bash
# Create user with auto-generated password
npx tsx scripts/create-premium-user.ts seajungson0@gmail.com

# Create user with specific password
npx tsx scripts/create-premium-user.ts seajungson0@gmail.com MyPassword123!
```

---

## Option 3: API Endpoint (For existing users)

If the user already exists and just needs to be upgraded:

```bash
curl -X POST http://localhost:3000/api/upgrade-to-premium \
  -H "Content-Type: application/json" \
  -d '{"userEmail":"seajungson0@gmail.com"}'
```

Or in production:
```bash
curl -X POST https://your-domain.com/api/upgrade-to-premium \
  -H "Content-Type: application/json" \
  -d '{"userEmail":"seajungson0@gmail.com"}'
```

---

## Verification

After running any method, verify the user has premium access:

### Check via API:
```bash
curl "http://localhost:3000/api/user-profile?userEmail=seajungson0@gmail.com"
```

Expected response:
```json
{
  "profile": {
    "email": "seajungson0@gmail.com",
    "tier": "premium",
    "questions_completed": 0
  },
  "access": {
    "canAccess": true,
    "tier": "premium",
    "questionsRemaining": -1,  // -1 means unlimited
    "questionsCompleted": 0
  }
}
```

### Check via SQL:
```sql
SELECT email, tier, questions_completed, upgraded_at
FROM user_profiles
WHERE email = 'seajungson0@gmail.com';
```

Expected result:
- `tier`: `premium`
- `upgraded_at`: (current timestamp)

---

## What "Premium" Means

Premium users have:
- ✅ **Unlimited questions** (no daily/monthly limits)
- ✅ **Unlimited chats** (no restrictions)
- ✅ **Full access** to all features
- ✅ **No prompts** to upgrade

Free users have:
- ❌ Limited to 1 question (plus 1 demo)
- ❌ Prompted to upgrade after limit

---

## Troubleshooting

### "User does not exist in auth.users"
- Create the user first via Supabase Dashboard > Authentication > Users

### "Profile already exists"
- This is fine! The script will upgrade the existing profile

### "Failed to upgrade user to premium"
- Check that the `upgrade_user_to_premium` function exists in your database
- Run the migration: `supabase/migrations/add_user_tracking_and_limits.sql`

### Environment variables not found (TypeScript script)
- Make sure `.env.local` exists with correct values
- Or use the SQL script instead (Option 1)

---

## Security Note

⚠️ **Important**: These scripts use admin/service role privileges. Only run them:
- In secure environments
- For legitimate admin purposes
- Never expose service role keys in client code

---

## Quick Reference

| Method | Complexity | Requires .env | Best For |
|--------|------------|---------------|----------|
| SQL Script | Low | ❌ No | Quick one-off user creation |
| TypeScript Script | Medium | ✅ Yes | Bulk user creation |
| API Endpoint | Low | ❌ No | Upgrading existing users |
