import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';

// Initialize Stripe
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
}

if (!process.env.STRIPE_WEBHOOK_SECRET) {
  throw new Error('STRIPE_WEBHOOK_SECRET is not set in environment variables');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-05-28.basil',
  typescript: true,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      console.error('Missing Stripe signature');
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    // Verify webhook signature for security
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (error) {
      console.error('Webhook signature verification failed:', error);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('Payment successful for session:', session.id);
        
        // TODO: Update user subscription in your database
        // await updateUserSubscription(session);
        
        break;
      }

      case 'customer.subscription.created': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log('Subscription created:', subscription.id);
        
        // TODO: Handle new subscription
        // await handleNewSubscription(subscription);
        
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log('Subscription updated:', subscription.id);
        
        // TODO: Handle subscription update
        // await handleSubscriptionUpdate(subscription);
        
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log('Subscription cancelled:', subscription.id);
        
        // TODO: Handle subscription cancellation
        // await handleSubscriptionCancellation(subscription);
        
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        console.log('Payment succeeded for invoice:', invoice.id);
        
        // TODO: Handle successful payment
        // await handlePaymentSuccess(invoice);
        
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        console.log('Payment failed for invoice:', invoice.id);
        
        // TODO: Handle failed payment
        // await handlePaymentFailure(invoice);
        
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

// Security: Only allow POST requests
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

// Helper functions (implement these based on your database)
/*
async function updateUserSubscription(session: Stripe.Checkout.Session) {
  // Update user's subscription status in your database
  // You can get the customer ID from session.customer
  // and the subscription ID from session.subscription
}

async function handleNewSubscription(subscription: Stripe.Subscription) {
  // Handle new subscription creation
  // Update user's plan, set subscription start date, etc.
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  // Handle subscription changes (plan changes, etc.)
}

async function handleSubscriptionCancellation(subscription: Stripe.Subscription) {
  // Handle subscription cancellation
  // Update user's plan to free, set cancellation date, etc.
}

async function handlePaymentSuccess(invoice: Stripe.Invoice) {
  // Handle successful recurring payment
  // Extend subscription period, send confirmation email, etc.
}

async function handlePaymentFailure(invoice: Stripe.Invoice) {
  // Handle failed payment
  // Send payment failure notification, update subscription status, etc.
}
*/ 