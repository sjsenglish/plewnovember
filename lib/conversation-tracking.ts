/**
 * Conversation tracking utilities for storing AI chats in Supabase
 */

import { createClient } from '@/lib/supabase/server';
import { Conversation, ConversationMessage, ConversationWithMessages } from '@/lib/types/user-tracking';

/**
 * Create a new conversation session
 */
export async function createConversation(
  userEmail: string,
  packId?: string,
  questionObjectId?: string,
  isDemo: boolean = false
): Promise<string | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('conversations')
    .insert({
      user_email: userEmail,
      pack_id: packId || null,
      question_object_id: questionObjectId || null,
      is_demo: isDemo,
    })
    .select('id')
    .single();

  if (error) {
    console.error('Error creating conversation:', error);
    return null;
  }

  return data.id;
}

/**
 * Add a message to a conversation
 */
export async function addConversationMessage(
  conversationId: string,
  role: 'user' | 'assistant' | 'system',
  content: string,
  tokensUsed?: number
): Promise<boolean> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('conversation_messages')
    .insert({
      conversation_id: conversationId,
      role,
      content,
      tokens_used: tokensUsed || null,
    });

  if (error) {
    console.error('Error adding conversation message:', error);
    return false;
  }

  // Update conversation updated_at timestamp
  await supabase
    .from('conversations')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', conversationId);

  return true;
}

/**
 * Get a conversation with all its messages
 */
export async function getConversationWithMessages(
  conversationId: string
): Promise<ConversationWithMessages | null> {
  const supabase = await createClient();

  // Get conversation
  const { data: conversation, error: convError } = await supabase
    .from('conversations')
    .select('*')
    .eq('id', conversationId)
    .single();

  if (convError || !conversation) {
    console.error('Error fetching conversation:', convError);
    return null;
  }

  // Get messages
  const { data: messages, error: msgError } = await supabase
    .from('conversation_messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  if (msgError) {
    console.error('Error fetching messages:', msgError);
    return null;
  }

  return {
    ...conversation,
    messages: messages || [],
  };
}

/**
 * Get all conversations for a user
 */
export async function getUserConversations(
  userEmail: string,
  limit: number = 50,
  offset: number = 0
): Promise<Conversation[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('user_email', userEmail)
    .order('started_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('Error fetching user conversations:', error);
    return [];
  }

  return data || [];
}

/**
 * Get conversations for a specific pack
 */
export async function getPackConversations(
  userEmail: string,
  packId: string
): Promise<ConversationWithMessages[]> {
  const supabase = await createClient();

  const { data: conversations, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('user_email', userEmail)
    .eq('pack_id', packId)
    .order('started_at', { ascending: false });

  if (error || !conversations) {
    console.error('Error fetching pack conversations:', error);
    return [];
  }

  // Get messages for each conversation
  const conversationsWithMessages = await Promise.all(
    conversations.map(async (conv) => {
      const { data: messages } = await supabase
        .from('conversation_messages')
        .select('*')
        .eq('conversation_id', conv.id)
        .order('created_at', { ascending: true });

      return {
        ...conv,
        messages: messages || [],
      };
    })
  );

  return conversationsWithMessages;
}

/**
 * Find or create conversation for a pack/question
 * Returns existing conversation if found within the last 24 hours, otherwise creates new
 */
export async function findOrCreateConversation(
  userEmail: string,
  packId?: string,
  questionObjectId?: string,
  isDemo: boolean = false
): Promise<string | null> {
  const supabase = await createClient();

  // Look for recent conversation (within 24 hours)
  const oneDayAgo = new Date();
  oneDayAgo.setHours(oneDayAgo.getHours() - 24);

  let query = supabase
    .from('conversations')
    .select('id')
    .eq('user_email', userEmail)
    .eq('is_demo', isDemo)
    .gte('updated_at', oneDayAgo.toISOString())
    .order('updated_at', { ascending: false })
    .limit(1);

  if (packId) {
    query = query.eq('pack_id', packId);
  }

  if (questionObjectId) {
    query = query.eq('question_object_id', questionObjectId);
  }

  const { data, error } = await query;

  // If found, return existing conversation
  if (!error && data && data.length > 0) {
    return data[0].id;
  }

  // Otherwise create new conversation
  return createConversation(userEmail, packId, questionObjectId, isDemo);
}
