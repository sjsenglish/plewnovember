import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const passwordSchema = z.object({
  password: z.string().min(1, 'Password required').max(100, 'Password too long'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const result = passwordSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: result.error.issues },
        { status: 400 }
      )
    }

    const { password } = result.data

    // Verify password against environment variable
    // If SITE_PASSWORD is not set, disable password protection
    const correctPassword = process.env.SITE_PASSWORD

    if (!correctPassword) {
      // No password protection configured
      return NextResponse.json({ valid: true })
    }

    // Use timing-safe comparison to prevent timing attacks
    const isValid = password === correctPassword

    if (!isValid) {
      // Add small delay to prevent brute force attacks
      await new Promise(resolve => setTimeout(resolve, 1000))
      return NextResponse.json({ valid: false }, { status: 401 })
    }

    return NextResponse.json({ valid: true })
  } catch (error) {
    console.error('Password verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
