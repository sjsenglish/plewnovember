#!/usr/bin/env tsx

/**
 * Script to create a user with full premium access
 * Usage: npx tsx scripts/create-premium-user.ts <email> [password]
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

async function createPremiumUser(email: string, password?: string) {
  // Create admin client (bypasses RLS)
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  console.log(`\n🚀 Creating premium user: ${email}\n`)

  try {
    // Step 1: Check if user already exists in auth
    const { data: existingUsers } = await supabase.auth.admin.listUsers()
    const existingUser = existingUsers?.users?.find(u => u.email === email)

    let userId: string

    if (existingUser) {
      console.log(`✓ User already exists in auth.users`)
      userId = existingUser.id
    } else {
      // Create new auth user
      const userPassword = password || `temp${Math.random().toString(36).slice(2)}Pass!`
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password: userPassword,
        email_confirm: true // Auto-confirm email
      })

      if (authError) {
        throw new Error(`Failed to create auth user: ${authError.message}`)
      }

      if (!authData.user) {
        throw new Error('No user data returned from auth creation')
      }

      userId = authData.user.id
      console.log(`✓ Created auth user (ID: ${userId})`)
      if (!password) {
        console.log(`  Password: ${userPassword}`)
      }
    }

    // Step 2: Check if user profile exists
    const { data: existingProfile, error: profileCheckError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('email', email)
      .single()

    if (profileCheckError && profileCheckError.code !== 'PGRST116') {
      // PGRST116 = no rows returned, which is fine
      console.warn(`Warning checking profile: ${profileCheckError.message}`)
    }

    if (existingProfile) {
      console.log(`✓ User profile already exists`)
    } else {
      // Profile should be auto-created by trigger, but create it manually if needed
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          id: userId,
          user_id: userId,
          email,
          tier: 'free',
          questions_completed: 0,
          demo_completed: false
        })

      if (profileError) {
        console.log(`Note: Profile creation returned: ${profileError.message}`)
        console.log(`This is normal if the trigger already created it.`)
      } else {
        console.log(`✓ Created user profile`)
      }
    }

    // Step 3: Upgrade to premium
    const { error: upgradeError } = await supabase.rpc('upgrade_user_to_premium', {
      p_user_email: email
    })

    if (upgradeError) {
      throw new Error(`Failed to upgrade user to premium: ${upgradeError.message}`)
    }

    console.log(`✓ Upgraded to premium tier`)

    // Step 4: Verify the upgrade
    const { data: profile, error: verifyError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('email', email)
      .single()

    if (verifyError) {
      throw new Error(`Failed to verify user: ${verifyError.message}`)
    }

    console.log(`\n✅ SUCCESS! User created with full access:\n`)
    console.log(`   Email: ${profile.email}`)
    console.log(`   Tier: ${profile.tier}`)
    console.log(`   Questions: ${profile.questions_completed}`)
    console.log(`   Upgraded at: ${profile.upgraded_at || 'N/A'}`)
    console.log(`\n🎉 User has unlimited access!\n`)

  } catch (error) {
    console.error(`\n❌ ERROR: ${error instanceof Error ? error.message : error}\n`)
    process.exit(1)
  }
}

// Main execution
const email = process.argv[2]
const password = process.argv[3]

if (!email) {
  console.error('Usage: npx tsx scripts/create-premium-user.ts <email> [password]')
  process.exit(1)
}

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('ERROR: Missing environment variables NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

createPremiumUser(email, password)
