import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { headers } from 'next/headers'
import { logger } from '@/lib/logger'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-10-29.clover',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

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
      logger.error('Missing stripe-signature header')
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      )
    }

    if (!webhookSecret) {
      logger.error('STRIPE_WEBHOOK_SECRET not configured')
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
      logger.error('Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        logger.debug('Checkout session completed:', session.id)
        logger.debug('Customer email:', session.customer_email)
        logger.debug('Subscription ID:', session.subscription)

        // TODO: Update user subscription status in your database
        // Example:
        // await updateUserSubscription({
        //   email: session.customer_email,
        //   subscriptionId: session.subscription,
        //   status: 'active',
        // })

        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        logger.debug('Subscription updated:', subscription.id)
        logger.debug('Status:', subscription.status)

        // TODO: Update subscription status in database
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        logger.debug('Subscription cancelled:', subscription.id)

        // TODO: Update user subscription status to cancelled
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        logger.debug('Payment succeeded for invoice:', invoice.id)

        // TODO: Record successful payment
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        logger.debug('Payment failed for invoice:', invoice.id)

        // TODO: Notify user of payment failure
        break
      }

      default:
        logger.debug('Unhandled event type:', event.type)
    }

    // Return 200 to acknowledge receipt
    return NextResponse.json({ received: true })
  } catch (error) {
    logger.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
