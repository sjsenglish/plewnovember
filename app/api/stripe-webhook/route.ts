import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { upgradeUserToPremium } from '@/lib/user-tracking'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-10-29.clover',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'No signature provided' },
        { status: 400 }
      )
    }

    // Verify webhook signature
    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message)
      return NextResponse.json(
        { error: `Webhook Error: ${err.message}` },
        { status: 400 }
      )
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        // Get customer email from session (check multiple sources)
        const customerEmail =
          session.customer_email ||
          session.customer_details?.email ||
          session.metadata?.user_email

        if (!customerEmail) {
          console.error('No customer email in checkout session:', session.id)
          break
        }

        console.log('Payment successful for:', customerEmail)

        // Upgrade user to premium
        try {
          await upgradeUserToPremium(customerEmail)
          console.log('User upgraded to premium:', customerEmail)
        } catch (error) {
          console.error('Error upgrading user to premium:', error)
          // Don't fail the webhook - we'll handle this manually if needed
        }

        break
      }

      case 'customer.subscription.deleted': {
        // Handle subscription cancellation
        const subscription = event.data.object as Stripe.Subscription

        // Get customer email
        const customer = await stripe.customers.retrieve(subscription.customer as string)

        if ('deleted' in customer && customer.deleted) {
          console.error('Customer deleted:', subscription.customer)
          break
        }

        const customerEmail = customer.email

        if (!customerEmail) {
          console.error('No customer email for subscription:', subscription.id)
          break
        }

        console.log('Subscription cancelled for:', customerEmail)

        // TODO: Optionally downgrade user back to free tier
        // For now, we'll keep them as premium even after cancellation
        // You can implement downgrade logic here if needed

        break
      }

      case 'invoice.payment_failed': {
        // Handle failed payment
        const invoice = event.data.object as Stripe.Invoice

        console.log('Payment failed for invoice:', invoice.id)

        // TODO: Optionally notify user or take action
        // For now, just log it

        break
      }

      default:
        console.log('Unhandled event type:', event.type)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
