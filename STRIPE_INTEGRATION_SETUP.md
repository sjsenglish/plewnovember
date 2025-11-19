# Stripe Payment Integration Setup

This guide explains how to complete the Stripe integration with the user tracking system.

## What's Already Connected

The following has been integrated:

1. **Upgrade Modal** → Your existing `/payment` page
2. **Payment Page** → Passes user email to Stripe checkout
3. **Success Page** → Automatically calls `/api/upgrade-to-premium`
4. **Webhook Handler** → Upgrades users when payment succeeds
5. **Checkout Session** → Includes customer email for tracking

## Setup Steps

### 1. Apply Database Migration

First, apply the Supabase migration to create the tracking tables:

1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Open and run the file: `supabase/migrations/add_user_tracking_and_limits.sql`
4. Verify tables are created:
   - `user_profiles`
   - `conversations`
   - `conversation_messages`

### 2. Configure Stripe Webhook

The webhook handler is at `/api/stripe-webhook` and needs to be registered with Stripe:

#### Option A: Using Stripe CLI (Development)

```bash
# Install Stripe CLI if not already installed
brew install stripe/stripe-brew/stripe

# Login to Stripe
stripe login

# Forward webhooks to your local server
stripe listen --forward-to http://localhost:3000/api/stripe-webhook

# Copy the webhook signing secret (starts with whsec_)
# Add it to your .env.local as STRIPE_WEBHOOK_SECRET
```

#### Option B: Stripe Dashboard (Production)

1. Go to [Stripe Dashboard → Developers → Webhooks](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Enter your webhook URL:
   - Development: `https://your-dev-url.vercel.app/api/stripe-webhook`
   - Production: `https://your-domain.com/api/stripe-webhook`
4. Select events to listen to:
   - `checkout.session.completed` ✅ (Required - upgrades user)
   - `customer.subscription.deleted` (Optional - handle cancellations)
   - `invoice.payment_failed` (Optional - handle failed payments)
5. Copy the "Signing secret" (starts with `whsec_`)
6. Add to Vercel environment variables:
   - Key: `STRIPE_WEBHOOK_SECRET`
   - Value: `whsec_...`

### 3. Verify Environment Variables

Make sure you have all required environment variables:

```env
# Stripe
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PLUS_MONTHLY_PRICE_ID=price_...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://...supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Anthropic (for AI chat)
ANTHROPIC_API_KEY=sk-ant-...
```

## How It Works

### Flow 1: User Hits Free Limit

```
User completes 1 question pack
   ↓
Tries to create another pack
   ↓
API returns 403 (limit reached)
   ↓
Upgrade Modal appears
   ↓
User clicks "Upgrade to Premium"
   ↓
Redirects to /payment page
```

### Flow 2: Successful Payment

```
User completes Stripe checkout
   ↓
Redirects to /payment/success
   ↓
Success page calls /api/upgrade-to-premium
   ↓
User tier changed to 'premium' in database
   ↓
User can now create unlimited packs
```

### Flow 3: Webhook (Backup/Server-side)

```
Stripe sends checkout.session.completed event
   ↓
/api/stripe-webhook receives event
   ↓
Verifies webhook signature
   ↓
Extracts customer email
   ↓
Calls upgradeUserToPremium(email)
   ↓
User upgraded (even if client-side upgrade failed)
```

## Testing the Integration

### Test Free Tier Limits

1. Create a new user account (or use existing)
2. Complete the demo (doesn't count toward limit)
3. Create and complete 1 question pack
4. Try to create another pack
5. **Expected:** Upgrade modal should appear
6. Click "Upgrade to Premium"
7. **Expected:** Redirect to `/payment` page

### Test Payment Flow (Stripe Test Mode)

1. Make sure Stripe is in test mode
2. Click "Subscribe Now" on payment page
3. Use test card: `4242 4242 4242 4242`
4. Expiry: Any future date (e.g., 12/34)
5. CVC: Any 3 digits (e.g., 123)
6. Complete checkout
7. **Expected:** Redirect to success page
8. **Expected:** Message shows "Your subscription is now active"
9. Check database: User's tier should be 'premium'
10. Try creating unlimited packs - should work!

### Test Webhook

1. With Stripe CLI running (or production webhook configured)
2. Complete a test payment
3. Check your console/logs for:
   ```
   Payment successful for: user@example.com
   User upgraded to premium: user@example.com
   ```
4. Verify in Supabase:
   ```sql
   SELECT email, tier, upgraded_at
   FROM user_profiles
   WHERE email = 'user@example.com';
   ```
   Should show tier as 'premium'

## Troubleshooting

### Webhook Not Working

**Issue:** Payment succeeds but user not upgraded

**Solution:**
1. Check webhook is configured in Stripe Dashboard
2. Verify `STRIPE_WEBHOOK_SECRET` is set correctly
3. Check Vercel/server logs for webhook errors
4. Test webhook with Stripe CLI: `stripe trigger checkout.session.completed`

### User Not Upgraded on Success Page

**Issue:** Payment succeeds but success page shows error

**Solution:**
1. Check browser console for errors
2. Verify user email is in localStorage
3. Check network tab for `/api/upgrade-to-premium` call
4. Verify Supabase service role key has proper permissions

### Free Limit Not Working

**Issue:** User can create unlimited packs even on free tier

**Solution:**
1. Verify migration was applied correctly
2. Check `user_profiles` table exists
3. Test `/api/user-profile` endpoint manually
4. Verify user profile was created (should auto-create on signup)

### Demo Counting Toward Limit

**Issue:** Demo uses up the free question

**Solution:**
1. Make sure demo completion passes `isDemo: true` to APIs
2. Check `/api/completed-packs` receives `isDemo` flag
3. Verify demo doesn't increment questions_completed

## Monitoring

### Check User Stats

```sql
-- View all user profiles
SELECT email, tier, questions_completed, demo_completed, upgraded_at
FROM user_profiles
ORDER BY created_at DESC;

-- View premium users
SELECT email, upgraded_at
FROM user_profiles
WHERE tier = 'premium';

-- View users who hit the limit
SELECT email, questions_completed
FROM user_profiles
WHERE tier = 'free' AND questions_completed >= 1;
```

### Check Conversations

```sql
-- View all conversations
SELECT id, user_email, is_demo, started_at
FROM conversations
ORDER BY started_at DESC
LIMIT 20;

-- Count messages per conversation
SELECT c.user_email, c.id, COUNT(m.id) as message_count
FROM conversations c
LEFT JOIN conversation_messages m ON c.id = m.conversation_id
GROUP BY c.id, c.user_email
ORDER BY c.started_at DESC;
```

## Production Deployment

### Pre-Launch Checklist

- [ ] Database migration applied to production Supabase
- [ ] Stripe webhook configured with production URL
- [ ] All environment variables set in Vercel
- [ ] Test payment flow with Stripe test mode
- [ ] Switch to Stripe live mode
- [ ] Test real payment (then refund)
- [ ] Monitor first few real upgrades
- [ ] Set up Stripe email receipts
- [ ] Configure Stripe invoice settings

### Post-Launch Monitoring

1. Check webhook deliveries in Stripe Dashboard
2. Monitor user_profiles table for new premium users
3. Set up alerts for failed webhook deliveries
4. Review conversation storage (ensure it's working)
5. Monitor API usage costs (Anthropic)

## Future Enhancements

1. **Subscription Management**
   - Add cancel subscription flow
   - Handle subscription paused/resumed
   - Implement grace period after cancellation

2. **Usage Analytics**
   - Dashboard showing user tier distribution
   - Conversion rate (free → premium)
   - Conversation history viewer for users

3. **Enhanced Limits**
   - Time-based limits (daily/weekly)
   - Feature gating (e.g., advanced AI for premium only)
   - Trial periods (7-day free trial)

4. **Admin Tools**
   - Admin dashboard to manage users
   - Manual tier adjustments
   - View all conversations for support

## Support

If you encounter issues:
1. Check this documentation
2. Review logs in Vercel/console
3. Check Stripe webhook delivery logs
4. Verify Supabase table permissions
5. Test with Stripe CLI in local environment

## Summary

The integration is **fully functional** with these components:

✅ User tier tracking (free/premium)
✅ Usage limits enforcement (demo + 1 question)
✅ Upgrade modal and payment flow
✅ Automatic upgrade on successful payment
✅ Webhook handler for server-side upgrade
✅ Conversation storage
✅ Pack completion tracking

**Next Step:** Set up the Stripe webhook as described above, then test the complete flow!
