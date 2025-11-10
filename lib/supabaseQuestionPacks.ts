/**
 * Supabase Question Packs Utility
 * Functions for managing question packs in Supabase
 */

import { createClient } from './supabase/client';

export interface QuestionPack {
  id: string;
  name: string;
  subject: string;
  created_at: string;
  user_id?: string;
  question_ids?: string[];
}

/**
 * Get all practice packs for the current user
 */
export async function getUserPracticePacks(): Promise<{
  success: boolean;
  packs?: QuestionPack[];
  error?: string;
}> {
  try {
    const supabase = createClient();

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError) {
      console.error('Error getting user:', userError);
      // Return empty packs if user is not logged in (practice is accessible without login)
      return { success: true, packs: [] };
    }

    // Fetch question packs
    const { data: packs, error: packsError } = await supabase
      .from('question_packs')
      .select('*')
      .order('created_at', { ascending: false });

    if (packsError) {
      console.error('Error fetching packs:', packsError);
      return { success: false, error: packsError.message };
    }

    return { success: true, packs: packs || [] };
  } catch (error) {
    console.error('Error in getUserPracticePacks:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

/**
 * Get a single question pack by ID
 */
export async function getQuestionPackById(packId: string): Promise<{
  success: boolean;
  pack?: QuestionPack;
  error?: string;
}> {
  try {
    const supabase = createClient();

    const { data: pack, error } = await supabase
      .from('question_packs')
      .select('*')
      .eq('id', packId)
      .single();

    if (error) {
      console.error('Error fetching pack:', error);
      return { success: false, error: error.message };
    }

    return { success: true, pack };
  } catch (error) {
    console.error('Error in getQuestionPackById:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

/**
 * Create a new question pack
 */
export async function createQuestionPack(
  name: string,
  subject: string,
  questionIds: string[] = []
): Promise<{
  success: boolean;
  pack?: QuestionPack;
  error?: string;
}> {
  try {
    const supabase = createClient();

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return { success: false, error: 'User must be logged in to create packs' };
    }

    const { data: pack, error } = await supabase
      .from('question_packs')
      .insert({
        name,
        subject,
        user_id: user.id,
        question_ids: questionIds,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating pack:', error);
      return { success: false, error: error.message };
    }

    return { success: true, pack };
  } catch (error) {
    console.error('Error in createQuestionPack:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

/**
 * Delete a question pack
 */
export async function deleteQuestionPack(packId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const supabase = createClient();

    const { error } = await supabase
      .from('question_packs')
      .delete()
      .eq('id', packId);

    if (error) {
      console.error('Error deleting pack:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error in deleteQuestionPack:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}
