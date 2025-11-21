import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { headers } from 'next/headers'
import { createClient } from '@supabase/supabase-js'
import { upgradeUserToPremium } from '@/lib/user-tracking'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-10-29.clover',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

// Create admin client to update user metadata
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

/**
 * Update user subscription metadata in Supabase
 */
async function updateUserSubscriptionMetadata(
  email: string,
  status: string,
  endDate: Date | null
) {
  // Find user by email
  const { data: users, error: listError } = await supabaseAdmin.auth.admin.listUsers()

  if (listError) {
    console.error('Error listing users:', listError)
    return
  }

  const user = users.users.find(u => u.email === email)
  if (!user) {
    console.error('User not found:', email)
    return
  }

  // Update user metadata
  const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
    user.id,
    {
      user_metadata: {
        ...user.user_metadata,
        subscription_status: status,
        subscription_end_date: endDate ? endDate.toISOString() : null
      }
    }
  )

  if (updateError) {
    console.error('Error updating user metadata:', updateError)
  } else {
    console.log(`Updated subscription for ${email}: status=${status}, endDate=${endDate?.toISOString()}`)
  }
}

/**
 * Stripe Webhook Handler
 * Handles incoming webhook events from Stripe with signature verification
 *
 * IMPORTANT: This endpoint must be publicly accessible (no auth required)
 * but uses cryptographic signature verification for security
 */
export async function POST(request: NextRequest) {
  try {
    // Get the raw body for signature verification
    const body = await request.text()
    const headersList = await headers()
    const signature = headersList.get('stripe-signature')

    if (!signature) {
      console.error('Missing stripe-signature header')
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      )
    }

    if (!webhookSecret) {
      console.error('STRIPE_WEBHOOK_SECRET not configured')
      return NextResponse.json(
        { error: 'Webhook not configured' },
        { status: 500 }
      )
    }

    // Verify webhook signature
    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        console.log('Checkout session completed:', session.id)
        console.log('Customer email:', session.customer_email)
        console.log('Subscription ID:', session.subscription)

        if (session.customer_email && session.subscription) {
          // Get subscription details to find end date
          const subscriptionData = await stripe.subscriptions.retrieve(
            session.subscription as string
          ) as unknown as { current_period_end: number }

          const endDate = new Date(subscriptionData.current_period_end * 1000)

          // Update user profile in database
          await upgradeUserToPremium(session.customer_email)

          // Update user metadata for auth context
          await updateUserSubscriptionMetadata(
            session.customer_email,
            'Active',
            endDate
          )
        }

        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as unknown as {
          id: string
          status: string
          customer: string
          current_period_end: number
          cancel_at_period_end: boolean
        }
        console.log('Subscription updated:', subscription.id)
        console.log('Status:', subscription.status)

        // Get customer email
        const customer = await stripe.customers.retrieve(
          subscription.customer
        ) as unknown as { email: string | null }
        const email = customer.email

        if (email) {
          const endDate = new Date(subscription.current_period_end * 1000)
          const status = subscription.status === 'active' ? 'Active' :
                        subscription.cancel_at_period_end ? 'Cancelling' : subscription.status

          await updateUserSubscriptionMetadata(email, status, endDate)
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as unknown as { id: string; customer: string }
        console.log('Subscription cancelled:', subscription.id)

        // Get customer email
        const customer = await stripe.customers.retrieve(
          subscription.customer
        ) as unknown as { email: string | null }
        const email = customer.email

        if (email) {
          await updateUserSubscriptionMetadata(email, 'Cancelled', null)
        }
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        console.log('Payment succeeded for invoice:', invoice.id)

        // TODO: Record successful payment
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        console.log('Payment failed for invoice:', invoice.id)

        // TODO: Notify user of payment failure
        break
      }

      default:
        console.log('Unhandled event type:', event.type)
    }

    // Return 200 to acknowledge receipt
    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
