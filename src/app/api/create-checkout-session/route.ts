import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';

// Initialize Stripe with proper error handling
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-05-28.basil',
  typescript: true,
});

// Define allowed price IDs for security
const ALLOWED_PRICE_IDS = {
  weekly: process.env.STRIPE_WEEKLY_PRICE_ID,
  monthly: process.env.STRIPE_MONTHLY_PRICE_ID,
  quarterly: process.env.STRIPE_QUARTERLY_PRICE_ID,
} as const;

// Validate plan data
interface CreateCheckoutRequest {
  priceId: string;
  planId: 'weekly' | 'monthly' | 'quarterly';
  planName: string;
  amount: number;
}

function validateRequest(data: any): data is CreateCheckoutRequest {
  return (
    typeof data.priceId === 'string' &&
    typeof data.planId === 'string' &&
    ['weekly', 'monthly', 'quarterly'].includes(data.planId) &&
    typeof data.planName === 'string' &&
    typeof data.amount === 'number' &&
    data.amount > 0
  );
}

export async function POST(request: NextRequest) {
  try {
    // Security: Check origin header
    const headersList = await headers();
    const origin = headersList.get('origin');
    const allowedOrigins = [
      process.env.NEXT_PUBLIC_BASE_URL
    ].filter(Boolean);

    if (!origin || !allowedOrigins.includes(origin)) {
      return NextResponse.json(
        { error: 'Unauthorized origin' },
        { status: 403 }
      );
    }

    // Parse and validate request body
    let requestData;
    try {
      requestData = await request.json();
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    if (!validateRequest(requestData)) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }

    const { priceId, planId, planName, amount } = requestData;

    // Security: Validate that the priceId matches our allowed price IDs
    console.log('priceId', priceId, ALLOWED_PRICE_IDS);
    const allowedPriceId = ALLOWED_PRICE_IDS[planId];
    if (!allowedPriceId || priceId !== allowedPriceId) {
      return NextResponse.json(
        { error: 'Invalid price ID for selected plan' },
        { status: 400 }
      );
    }

    // Verify the price exists in Stripe and get its details
    let stripePrice;
    try {
      stripePrice = await stripe.prices.retrieve(priceId);
    } catch (error) {
      console.error('Error retrieving Stripe price:', error);
      return NextResponse.json(
        { error: 'Invalid price ID' },
        { status: 400 }
      );
    }

    // Security: Validate that the amount matches the Stripe price
    const stripePriceAmount = stripePrice.unit_amount ? stripePrice.unit_amount / 100 : 0;
    if (stripePriceAmount !== amount) {
      return NextResponse.json(
        { error: 'Price mismatch detected' },
        { status: 400 }
      );
    }

    // Create checkout session with security measures
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/jobs?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/jobs?canceled=true`,
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      metadata: {
        planId,
        planName,
        amount: amount.toString(),
        created_at: new Date().toISOString(),
      },
      subscription_data: {
        metadata: {
          planId,
          planName,
          amount: amount.toString(),
        },
      },
      // Security: Set expiration time for the checkout session
      expires_at: Math.floor(Date.now() / 1000) + (30 * 60), // 30 minutes
    });

    // Log the session creation for monitoring (without sensitive data)
    console.log(`Checkout session created: ${session.id} for plan: ${planId}`);

    return NextResponse.json({ 
      url: session.url,
      sessionId: session.id 
    });

  } catch (error) {
    console.error('Error creating checkout session:', error);
    
    // Don't expose internal error details to client
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
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

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
} 