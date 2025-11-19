// Shared packs accessible to all users
// These packs can be accessed without authentication or tier restrictions
// Data is now stored in Supabase for easy management

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Type definitions to match the database schema
export interface SharedPackQuestion {
  questionNumber: number
  year: string
  questionText: string
  actualQuestion: string
  answerOptions: string[]
  correctAnswer: string
  correctAnswerNumber: number
  imageFile: string
  videoSolutionLink: string
  source: string
  primarySubjectArea: string
  passageType: string
  questionSkill: string
  objectID: string
  questionId: string
  passage: string
  difficulty: string
  subject: string
  topic: string
  requiresPLEW: boolean
}

export interface SharedPack {
  packId: string
  name: string
  description: string
  size: number
  level: number
  questions: SharedPackQuestion[]
  createdAt: string
}

/**
 * Create Supabase client for fetching public packs
 * Uses anon key since public packs are accessible to everyone
 */
async function createPublicPacksClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch {
            // Ignore cookie errors in Server Components
          }
        },
      },
    }
  )
}

/**
 * Fetch a shared pack by its ID from Supabase
 */
export async function getSharedPack(packId: string): Promise<SharedPack | null> {
  try {
    const supabase = await createPublicPacksClient()

    // Fetch pack metadata
    const { data: pack, error: packError } = await supabase
      .from('public_packs')
      .select('*')
      .eq('pack_id', packId)
      .single()

    if (packError || !pack) {
      console.error('Error fetching shared pack:', packError)
      return null
    }

    // Fetch pack questions
    const { data: questions, error: questionsError } = await supabase
      .from('public_pack_questions')
      .select('*')
      .eq('pack_id', packId)

    if (questionsError) {
      console.error('Error fetching shared pack questions:', questionsError)
      return null
    }

    // Transform database format to application format
    const transformedQuestions: SharedPackQuestion[] = (questions || []).map((q: any) => ({
      questionNumber: q.question_number,
      year: q.year,
      questionText: q.question_text,
      actualQuestion: q.actual_question,
      answerOptions: q.answer_options,
      correctAnswer: q.correct_answer,
      correctAnswerNumber: q.correct_answer_number,
      imageFile: q.image_file,
      videoSolutionLink: q.video_solution_link,
      source: q.source,
      primarySubjectArea: q.primary_subject_area,
      passageType: q.passage_type,
      questionSkill: q.question_skill,
      objectID: q.object_id,
      questionId: q.question_id,
      passage: q.passage,
      difficulty: q.difficulty,
      subject: q.subject,
      topic: q.topic,
      requiresPLEW: q.requires_plew,
    }))

    return {
      packId: pack.pack_id,
      name: pack.name,
      description: pack.description,
      size: pack.size,
      level: pack.level,
      questions: transformedQuestions,
      createdAt: pack.created_at,
    }
  } catch (error) {
    console.error('Error in getSharedPack:', error)
    return null
  }
}

/**
 * Check if a pack ID is a shared pack
 */
export async function isSharedPack(packId: string): Promise<boolean> {
  try {
    const supabase = await createPublicPacksClient()

    const { data, error } = await supabase
      .from('public_packs')
      .select('pack_id')
      .eq('pack_id', packId)
      .single()

    if (error || !data) {
      return false
    }

    return true
  } catch (error) {
    console.error('Error checking if pack is shared:', error)
    return false
  }
}

/**
 * Get all available shared packs
 */
export async function getAllSharedPacks(): Promise<SharedPack[]> {
  try {
    const supabase = await createPublicPacksClient()

    const { data: packs, error } = await supabase
      .from('public_packs')
      .select('*')
      .order('created_at', { ascending: false })

    if (error || !packs) {
      console.error('Error fetching all shared packs:', error)
      return []
    }

    // Fetch questions for each pack
    const packsWithQuestions = await Promise.all(
      packs.map(async (pack) => {
        const { data: questions } = await supabase
          .from('public_pack_questions')
          .select('*')
          .eq('pack_id', pack.pack_id)

        const transformedQuestions: SharedPackQuestion[] = (questions || []).map((q: any) => ({
          questionNumber: q.question_number,
          year: q.year,
          questionText: q.question_text,
          actualQuestion: q.actual_question,
          answerOptions: q.answer_options,
          correctAnswer: q.correct_answer,
          correctAnswerNumber: q.correct_answer_number,
          imageFile: q.image_file,
          videoSolutionLink: q.video_solution_link,
          source: q.source,
          primarySubjectArea: q.primary_subject_area,
          passageType: q.passage_type,
          questionSkill: q.question_skill,
          objectID: q.object_id,
          questionId: q.question_id,
          passage: q.passage,
          difficulty: q.difficulty,
          subject: q.subject,
          topic: q.topic,
          requiresPLEW: q.requires_plew,
        }))

        return {
          packId: pack.pack_id,
          name: pack.name,
          description: pack.description,
          size: pack.size,
          level: pack.level,
          questions: transformedQuestions,
          createdAt: pack.created_at,
        }
      })
    )

    return packsWithQuestions
  } catch (error) {
    console.error('Error in getAllSharedPacks:', error)
    return []
  }
}
