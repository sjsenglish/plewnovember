import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getAuthenticatedUser } from '@/lib/auth-helpers'
import { z } from 'zod'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-10-29.clover',
})

const checkoutSchema = z.object({
  priceId: z
    .string()
    .min(1, 'Price ID required')
    .max(255, 'Price ID too long')
    .regex(/^price_[a-zA-Z0-9_]+$/, 'Invalid Stripe price ID format'),
  email: z.string().email('Invalid email').optional(),
})

export async function POST(request: NextRequest) {
  try {
    // Verify user is authenticated
    const user = await getAuthenticatedUser()
    if (!user || !user.email) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in to subscribe' },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Validate input
    const result = checkoutSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: result.error.issues },
        { status: 400 }
      )
    }

    const { priceId } = result.data

    // Get the origin for redirect URLs
    const origin = request.headers.get('origin') || 'http://localhost:3000'

    // Create Checkout Session with customer email from authenticated user
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: user.email, // Use authenticated user's email
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/payment`,
      allow_promotion_codes: true,
      metadata: {
        user_email: user.email, // Store for webhook processing
      },
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error: any) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
