# User Tracking and Limits System

This document describes the comprehensive user tracking, conversation storage, and tier-based access limit system implemented for the PLEW language learning platform.

## Overview

The system implements:
1. **User Profile Tracking** - Tracks user tier (free/premium) and usage
2. **Conversation Storage** - Stores all AI chat conversations in Supabase
3. **Pack Completion Tracking** - Records all completed question packs and individual answers
4. **Usage Limits** - Enforces free tier limits (demo + 1 question)
5. **Premium Upgrade Flow** - UI components for upgrading to premium

## Database Schema

### New Tables

#### 1. `user_profiles`
Stores user tier information and usage tracking.

```sql
- id: UUID (primary key)
- user_id: UUID (references auth.users)
- email: VARCHAR (unique)
- tier: VARCHAR (free/premium)
- questions_completed: INTEGER
- demo_completed: BOOLEAN
- upgraded_at: TIMESTAMP
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

#### 2. `conversations`
Stores AI conversation sessions.

```sql
- id: UUID (primary key)
- user_email: VARCHAR
- pack_id: VARCHAR (nullable)
- question_object_id: VARCHAR (nullable)
- is_demo: BOOLEAN
- started_at: TIMESTAMP
- updated_at: TIMESTAMP
```

#### 3. `conversation_messages`
Stores individual messages within conversations.

```sql
- id: UUID (primary key)
- conversation_id: UUID (references conversations)
- role: VARCHAR (user/assistant/system)
- content: TEXT
- tokens_used: INTEGER (nullable)
- created_at: TIMESTAMP
```

### Database Functions

#### `initialize_user_profile()`
Automatically creates a user profile when a new user signs up.
- Triggered on INSERT to `auth.users`
- Sets default tier to 'free'
- Initializes questions_completed to 0

#### `can_user_access_question(email)`
Checks if a user can access a question based on their tier and usage.
- Returns `BOOLEAN`
- Free users: allowed if questions_completed < 1
- Premium users: always allowed

#### `increment_questions_completed(email, count)`
Increments the questions completed counter.
- Called after pack completion (except for demo)
- Creates profile if it doesn't exist

#### `mark_demo_completed(email)`
Marks the demo as completed for a user.

#### `upgrade_user_to_premium(email)`
Upgrades a user from free to premium tier.
- Sets tier to 'premium'
- Records upgraded_at timestamp

## API Endpoints

### New Endpoints

#### `GET /api/user-profile?userEmail={email}`
Returns user profile and access status.

**Response:**
```json
{
  "profile": {
    "email": "user@example.com",
    "tier": "free",
    "questions_completed": 0,
    "demo_completed": true
  },
  "access": {
    "canAccess": true,
    "tier": "free",
    "questionsCompleted": 0,
    "questionsRemaining": 1,
    "demoCompleted": true
  }
}
```

#### `POST /api/upgrade-to-premium`
Upgrades a user to premium (called after successful payment).

**Request:**
```json
{
  "userEmail": "user@example.com"
}
```

#### `POST /api/mark-demo-completed`
Marks demo as completed for a user.

**Request:**
```json
{
  "userEmail": "user@example.com"
}
```

### Updated Endpoints

#### `POST /api/chat`
Now accepts and saves conversation data.

**New Parameters:**
- `userEmail` - User's email for conversation tracking
- `packId` - Pack ID for context
- `questionObjectId` - Question ID for context

**Behavior:**
- Finds or creates conversation session
- Saves both user message and AI response to database
- Links conversation to pack and question

#### `POST /api/demo-chat`
Now accepts and saves demo conversation data.

**New Parameters:**
- `userEmail` - User's email for conversation tracking

**Behavior:**
- Creates demo conversation session
- Saves messages with `is_demo: true`

#### `POST /api/packs`
Now enforces usage limits before creating packs.

**New Parameters:**
- `isDemo` - Boolean flag to skip limit check for demo

**Behavior:**
- Checks user access with `checkUserAccess()`
- Returns 403 with upgrade message if limit reached
- Free users can only create 1 non-demo pack

#### `POST /api/completed-packs`
Now tracks questions completed for usage limits.

**New Parameters:**
- `isDemo` - Boolean flag to skip question counting for demo

**Behavior:**
- Calls `incrementQuestionsCompleted()` after pack completion
- Demo packs don't count toward the limit
- Updates user profile with usage statistics

## Usage Limits

### Free Tier
- **Demo**: Unlimited access (doesn't count toward limit)
- **Questions**: 1 question pack only
- After 1 question pack is completed, user must upgrade

### Premium Tier
- **Unlimited** access to all features
- No restrictions on question packs
- Full AI tutoring support

## Frontend Components

### New Components

#### `UpgradeModal`
Modal shown when user hits free tier limit.

**Props:**
- `isOpen: boolean`
- `onClose: () => void`
- `questionsCompleted: number`
- `onUpgrade: () => void`

**Features:**
- Shows user's current usage
- Lists premium benefits
- CTA buttons for upgrade or dismiss

#### `AccessLimitBanner`
Warning banner shown to free users approaching limit.

**Props:**
- `questionsRemaining: number`
- `onUpgrade: () => void`

**Features:**
- Shows questions remaining
- Warning when at limit
- Upgrade CTA button

### Updated Components

#### `ChatPanel`
Now accepts and passes user email for conversation tracking.

**New Props:**
- `userEmail?: string`

**Behavior:**
- Passes userEmail, packId, and questionObjectId to chat APIs
- All conversations are automatically saved to database

#### `PackSizeSelector`
Now includes access checking and upgrade flow.

**New Features:**
- Uses `useUserAccess()` hook to check limits
- Shows `AccessLimitBanner` for free users
- Shows `UpgradeModal` when limit is hit
- Handles 403 response from pack creation API

## Custom Hooks

### `useUserAccess(userEmail)`
React hook for checking user access and limits.

**Returns:**
```typescript
{
  access: UserAccessCheck | null
  isLoading: boolean
  error: string | null
  refresh: () => Promise<void>
}
```

**Usage:**
```typescript
const { access, isLoading, refresh } = useUserAccess(userEmail)

if (access?.canAccess) {
  // User can create packs
} else {
  // Show upgrade modal
}
```

## Utility Libraries

### `/lib/user-tracking.ts`
User profile and access management utilities.

**Functions:**
- `getUserProfile(email)` - Get user profile
- `checkUserAccess(email)` - Check if user can access questions
- `incrementQuestionsCompleted(email, count)` - Update usage counter
- `markDemoCompleted(email)` - Mark demo as done
- `upgradeUserToPremium(email)` - Upgrade user tier
- `getUserProfileWithAccess(email)` - Get both profile and access check

### `/lib/conversation-tracking.ts`
Conversation storage utilities.

**Functions:**
- `createConversation(userEmail, packId?, questionObjectId?, isDemo)` - Create new conversation
- `addConversationMessage(conversationId, role, content, tokensUsed?)` - Add message
- `getConversationWithMessages(conversationId)` - Get full conversation
- `getUserConversations(userEmail, limit, offset)` - Get user's conversations
- `getPackConversations(userEmail, packId)` - Get conversations for a pack
- `findOrCreateConversation(...)` - Find recent or create new conversation

### `/lib/types/user-tracking.ts`
TypeScript type definitions.

**Types:**
- `UserTier` - 'free' | 'premium'
- `UserProfile` - User profile interface
- `Conversation` - Conversation interface
- `ConversationMessage` - Message interface
- `UserAccessCheck` - Access check result

**Constants:**
- `FREE_USER_QUESTION_LIMIT = 1` - Free tier question limit

## Migration

### Running the Migration

1. **Apply the SQL migration:**
```bash
# If using Supabase CLI
supabase db push

# Or apply the migration file directly in Supabase Dashboard
# File: /supabase/migrations/add_user_tracking_and_limits.sql
```

2. **The migration will:**
   - Create new tables with RLS policies
   - Create database functions
   - Set up automatic profile creation trigger
   - Grant necessary permissions

### Backwards Compatibility

- Existing users: Profile will be created on first API call
- All new features are additive - no breaking changes
- Demo flag is optional (defaults to false)
- User email is optional in chat APIs (gracefully degrades)

## Testing

### Test Free Tier Limits

1. Create a new user account
2. Complete the demo (doesn't count toward limit)
3. Create and complete 1 question pack
4. Try to create another pack - should show upgrade modal
5. Check user profile: `questions_completed` should be 1

### Test Conversation Storage

1. Start a practice session
2. Send messages in chat
3. Check database: `conversations` and `conversation_messages` tables
4. Verify messages are properly linked to pack and question

### Test Premium Upgrade

1. Call `/api/upgrade-to-premium` with user email
2. Check user profile: tier should be 'premium'
3. Verify unlimited access (no upgrade modal shown)

## Security

### Row Level Security (RLS)

All tables have RLS enabled:
- Users can view their own data
- Service role has full access
- Prevents unauthorized data access

### API Authentication

- User email is retrieved from localStorage (client-side)
- Server-side APIs use service role for database access
- Future: Add JWT token validation for enhanced security

## Future Enhancements

1. **Payment Integration**
   - Connect upgrade modal to Stripe checkout
   - Auto-upgrade on successful payment
   - Subscription management

2. **Analytics Dashboard**
   - Show user their conversation history
   - Display learning progress over time
   - Export conversation transcripts

3. **Enhanced Limits**
   - Time-based limits (daily/weekly)
   - Feature-gating for premium (e.g., advanced AI features)
   - Trial periods

4. **Admin Tools**
   - Admin dashboard to view user stats
   - Manual tier management
   - Usage analytics

## Support

For questions or issues:
1. Check this documentation
2. Review the migration file
3. Check Supabase logs for errors
4. Verify environment variables are set

## Summary

This implementation provides:
- ✅ Complete user tracking in Supabase
- ✅ All AI conversations stored permanently
- ✅ Pack completion and stats tracking
- ✅ Free tier limits (demo + 1 question)
- ✅ Premium upgrade flow with UI
- ✅ Backwards compatible with existing code
- ✅ Row-level security for data protection
- ✅ TypeScript types for type safety
