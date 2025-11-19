/**
 * TypeScript types for user tracking, conversations, and tier system
 */

export type UserTier = 'free' | 'premium';

export interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  tier: UserTier;
  questions_completed: number;
  demo_completed: boolean;
  upgraded_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  id: string;
  user_email: string;
  pack_id: string | null;
  question_object_id: string | null;
  is_demo: boolean;
  started_at: string;
  updated_at: string;
}

export interface ConversationMessage {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  tokens_used: number | null;
  created_at: string;
}

export interface ConversationWithMessages extends Conversation {
  messages: ConversationMessage[];
}

export interface UserAccessCheck {
  canAccess: boolean;
  tier: UserTier;
  questionsCompleted: number;
  questionsRemaining: number;
  demoCompleted: boolean;
  reason?: string;
}

// Constants
export const FREE_USER_QUESTION_LIMIT = 1; // Demo + 1 question for free users
