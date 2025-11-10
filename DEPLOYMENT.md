# PLEW App - Vercel Deployment Guide

## The Issue
You're seeing a 404 error on Vercel because the required environment variables are not configured.

## Required Environment Variables

Your app needs these 3 environment variables to work:

### 1. Supabase Variables
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### 2. Anthropic API Key
```
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

## How to Fix the 404 Error on Vercel

### Step 1: Add Environment Variables to Vercel

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your `plewnovember` project
3. Click on **Settings** tab
4. Click on **Environment Variables** in the left sidebar
5. Add each variable:
   - **Key**: `NEXT_PUBLIC_SUPABASE_URL`
   - **Value**: Your Supabase project URL (from Supabase dashboard → Settings → API)
   - Click **Add**
   
   - **Key**: `SUPABASE_SERVICE_ROLE_KEY`
   - **Value**: Your Supabase service role key (from Supabase dashboard → Settings → API)
   - Click **Add**
   
   - **Key**: `ANTHROPIC_API_KEY`
   - **Value**: Your Anthropic API key (from https://console.anthropic.com/)
   - Click **Add**

### Step 2: Redeploy

After adding the environment variables:
1. Go to **Deployments** tab
2. Click the **...** menu on the latest deployment
3. Click **Redeploy**
4. Select **Use existing Build Cache** (optional)
5. Click **Redeploy**

### Step 3: Verify

Once redeployed, your app should work! Visit your Vercel URL and you should see:
- ✅ Landing page with book icon
- ✅ Pack maker working
- ✅ Practice interface functional

## Where to Get the API Keys

### Supabase Keys
1. Go to https://supabase.com/dashboard
2. Select your project
3. Click **Settings** (gear icon)
4. Click **API**
5. Copy:
   - **Project URL** → use for `NEXT_PUBLIC_SUPABASE_URL`
   - **service_role (secret)** → use for `SUPABASE_SERVICE_ROLE_KEY`

### Anthropic API Key
1. Go to https://console.anthropic.com/
2. Click **API Keys**
3. Click **Create Key**
4. Copy the key → use for `ANTHROPIC_API_KEY`

## Database Setup (Supabase)

Make sure you have these tables in your Supabase database:

### 1. `packs` table
```sql
create table packs (
  id uuid primary key default gen_random_uuid(),
  size integer not null,
  questions jsonb not null,
  current_question_index integer default 0,
  created_at timestamp with time zone default now()
);
```

### 2. `question_progress` table
```sql
create table question_progress (
  id uuid primary key default gen_random_uuid(),
  pack_id uuid references packs(id) on delete cascade,
  question_object_id text not null,
  selected_answer text not null,
  is_correct boolean not null,
  answered_at timestamp with time zone default now(),
  unique(pack_id, question_object_id)
);
```

### 3. `chat_messages` table (optional for now)
```sql
create table chat_messages (
  id uuid primary key default gen_random_uuid(),
  pack_id uuid references packs(id) on delete cascade,
  question_object_id text not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamp with time zone default now()
);
```

Run these SQL commands in your Supabase SQL Editor.

## Local Development

For local development, create a `.env.local` file:

```bash
cp .env.example .env.local
```

Then fill in your actual values in `.env.local`.

## Troubleshooting

### Still seeing 404?
- Check Vercel build logs for errors
- Verify all 3 environment variables are set correctly
- Make sure there are no typos in variable names
- Ensure Supabase tables are created

### Build failing?
- Check the Vercel deployment logs
- Make sure all dependencies are in package.json
- Verify Node.js version compatibility (should be 18+)

### API routes returning 500?
- Check if environment variables are accessible
- Verify Supabase and Anthropic API keys are valid
- Check Vercel function logs for specific errors
