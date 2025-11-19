import { z } from 'zod'

/**
 * Validation schemas for API request inputs
 * Using Zod for runtime type validation and sanitization
 */

// Email validation schema
export const emailSchema = z
  .string()
  .email('Invalid email format')
  .max(255, 'Email too long')
  .transform(val => val.toLowerCase().trim())

// Pack creation schema
export const packCreationSchema = z.object({
  size: z
    .number()
    .int('Pack size must be an integer')
    .min(1, 'Pack size must be at least 1')
    .max(100, 'Pack size cannot exceed 100'),
  userEmail: emailSchema,
  level: z
    .number()
    .int('Level must be an integer')
    .min(1, 'Level must be at least 1')
    .max(5, 'Level cannot exceed 5')
    .optional()
    .default(1),
})

// Chat message schema
export const chatMessageSchema = z.object({
  message: z
    .string()
    .min(1, 'Message cannot be empty')
    .max(5000, 'Message too long'),
  questionId: z
    .number()
    .int('Question ID must be an integer')
    .positive('Question ID must be positive')
    .optional(),
  questionText: z.string().max(10000, 'Question text too long').optional(),
  userAnswer: z.string().max(1000, 'User answer too long').optional(),
  correctAnswer: z.string().max(1000, 'Correct answer too long').optional(),
  userEmail: emailSchema.optional(),
})

// Completed pack schema
export const completedPackSchema = z.object({
  userEmail: emailSchema,
  packId: z
    .string()
    .uuid('Invalid pack ID format')
    .or(z.string().min(1, 'Pack ID required')),
  score: z
    .number()
    .int('Score must be an integer')
    .min(0, 'Score cannot be negative')
    .max(100, 'Score cannot exceed 100'),
  totalQuestions: z
    .number()
    .int('Total questions must be an integer')
    .min(1, 'Must have at least 1 question')
    .max(100, 'Cannot exceed 100 questions'),
  correctAnswers: z
    .number()
    .int('Correct answers must be an integer')
    .min(0, 'Correct answers cannot be negative'),
  packLevel: z
    .number()
    .int('Level must be an integer')
    .min(1, 'Level must be at least 1')
    .max(5, 'Level cannot exceed 5'),
  completedAt: z
    .string()
    .datetime('Invalid datetime format')
    .optional(),
  answers: z
    .array(
      z.object({
        questionId: z.number().int().positive(),
        userAnswer: z.string().max(1000),
        correctAnswer: z.string().max(1000),
        isCorrect: z.boolean(),
        questionText: z.string().max(10000),
      })
    )
    .optional(),
})

// Stripe checkout schema
export const checkoutSessionSchema = z.object({
  email: emailSchema,
  priceId: z
    .string()
    .min(1, 'Price ID required')
    .max(255, 'Price ID too long')
    .regex(/^price_[a-zA-Z0-9]+$/, 'Invalid Stripe price ID format'),
})

// User answer schema
export const userAnswerSchema = z.object({
  userEmail: emailSchema,
  questionId: z.number().int().positive('Invalid question ID'),
  packId: z.string().min(1, 'Pack ID required'),
  userAnswer: z.string().max(1000, 'Answer too long'),
  correctAnswer: z.string().max(1000, 'Correct answer too long'),
  isCorrect: z.boolean(),
})

// Pack ID parameter schema
export const packIdSchema = z
  .string()
  .min(1, 'Pack ID required')
  .max(255, 'Pack ID too long')

// Generic ID schema
export const idSchema = z
  .number()
  .int('ID must be an integer')
  .positive('ID must be positive')
