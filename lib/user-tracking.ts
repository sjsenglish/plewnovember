/**
 * User tracking and tier management utilities
 */

import { createClient } from '@/lib/supabase/server';
import { UserProfile, UserAccessCheck, FREE_USER_QUESTION_LIMIT } from '@/lib/types/user-tracking';

/**
 * Get or create user profile
 */
export async function getUserProfile(email: string): Promise<UserProfile | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('email', email)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }

  return data;
}

/**
 * Check if user can access a question (enforces free tier limits)
 */
export async function checkUserAccess(email: string): Promise<UserAccessCheck> {
  const supabase = await createClient();

  // Get user profile
  const profile = await getUserProfile(email);

  // If no profile, they're new - allow access and create profile
  if (!profile) {
    return {
      canAccess: true,
      tier: 'free',
      questionsCompleted: 0,
      questionsRemaining: FREE_USER_QUESTION_LIMIT,
      demoCompleted: false,
    };
  }

  // Premium users have unlimited access
  if (profile.tier === 'premium') {
    return {
      canAccess: true,
      tier: 'premium',
      questionsCompleted: profile.questions_completed,
      questionsRemaining: -1, // Unlimited
      demoCompleted: profile.demo_completed,
    };
  }

  // Free users: demo + 1 question
  const canAccess = profile.questions_completed < FREE_USER_QUESTION_LIMIT;
  const questionsRemaining = Math.max(0, FREE_USER_QUESTION_LIMIT - profile.questions_completed);

  return {
    canAccess,
    tier: 'free',
    questionsCompleted: profile.questions_completed,
    questionsRemaining,
    demoCompleted: profile.demo_completed,
    reason: canAccess ? undefined : 'Free tier limit reached. Upgrade to premium for unlimited access.',
  };
}

/**
 * Increment questions completed count
 */
export async function incrementQuestionsCompleted(email: string, count: number = 1): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.rpc('increment_questions_completed', {
    p_user_email: email,
    p_count: count,
  });

  if (error) {
    console.error('Error incrementing questions completed:', error);
    throw error;
  }
}

/**
 * Mark demo as completed
 */
export async function markDemoCompleted(email: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.rpc('mark_demo_completed', {
    p_user_email: email,
  });

  if (error) {
    console.error('Error marking demo completed:', error);
    throw error;
  }
}

/**
 * Upgrade user to premium
 */
export async function upgradeUserToPremium(email: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.rpc('upgrade_user_to_premium', {
    p_user_email: email,
  });

  if (error) {
    console.error('Error upgrading user to premium:', error);
    throw error;
  }
}

/**
 * Get user profile with access check
 */
export async function getUserProfileWithAccess(email: string): Promise<{
  profile: UserProfile | null;
  access: UserAccessCheck;
}> {
  const [profile, access] = await Promise.all([
    getUserProfile(email),
    checkUserAccess(email),
  ]);

  return { profile, access };
}
