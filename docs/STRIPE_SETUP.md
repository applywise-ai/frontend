# Secure Stripe Integration Setup Guide

This guide will help you set up the secure Stripe integration for your subscription modal.

## Prerequisites

1. A Stripe account (create one at https://stripe.com)
2. Node.js and npm/yarn installed
3. Next.js application running

## Step 1: Install Stripe Dependencies

```bash
npm install stripe @stripe/stripe-js
# or
yarn add stripe @stripe/stripe-js
```

## Step 2: Environment Variables

Add the following environment variables to your `.env.local` file:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Stripe Price IDs (create these in your Stripe dashboard)
STRIPE_WEEKLY_PRICE_ID=price_your_weekly_price_id_here
STRIPE_MONTHLY_PRICE_ID=price_your_monthly_price_id_here
STRIPE_QUARTERLY_PRICE_ID=price_your_quarterly_price_id_here

# Public Stripe Key (for frontend)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here

# Public Price IDs (for frontend validation)
NEXT_PUBLIC_STRIPE_WEEKLY_PRICE_ID=price_your_weekly_price_id_here
NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID=price_your_monthly_price_id_here
NEXT_PUBLIC_STRIPE_QUARTERLY_PRICE_ID=price_your_quarterly_price_id_here

# Application URLs
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Step 3: Create Stripe Products and Prices

1. Log into your Stripe Dashboard
2. Go to Products → Create Product
3. Create a product called "ApplyWise Pro"
4. Create three recurring prices:
   - Weekly: $7.00 every week
   - Monthly: $25.00 every month  
   - Quarterly: $60.00 every 3 months
5. Copy the price IDs and add them to your environment variables

## Step 4: Set Up Webhook Endpoint

1. In Stripe Dashboard, go to Developers → Webhooks
2. Click "Add endpoint"
3. Set the endpoint URL to: `https://yourdomain.com/api/webhooks/stripe`
4. Select these events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the webhook signing secret and add it to your environment variables

## Step 5: Security Features Implemented

### API Route Security (`/api/create-checkout-session`)
- ✅ Origin header validation
- ✅ Request body validation with TypeScript interfaces
- ✅ Price ID validation against allowed values
- ✅ Amount verification against Stripe prices
- ✅ Proper error handling without exposing internal details
- ✅ Session expiration (30 minutes)
- ✅ HTTP method restrictions (POST only)

### Webhook Security (`/api/webhooks/stripe`)
- ✅ Stripe signature verification
- ✅ Event type validation
- ✅ Proper error handling
- ✅ HTTP method restrictions (POST only)

### Frontend Security
- ✅ Input validation before API calls
- ✅ Error state management
- ✅ Loading states to prevent double submissions
- ✅ Price validation on client side
- ✅ Secure redirect to Stripe Checkout

## Step 6: Testing

### Test Mode
1. Use Stripe test keys (starting with `sk_test_` and `pk_test_`)
2. Use test card numbers from Stripe documentation
3. Test successful payments: `4242 4242 4242 4242`
4. Test declined payments: `4000 0000 0000 0002`

### Webhook Testing
1. Use Stripe CLI for local testing:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
2. Use the webhook signing secret from the CLI output

## Step 7: Production Deployment

### Before Going Live:
1. Replace all test keys with live keys
2. Update webhook endpoint URL to production domain
3. Test the complete flow in production environment
4. Set up monitoring for webhook failures
5. Implement proper logging for payment events

### Security Checklist:
- ✅ All environment variables are properly set
- ✅ Webhook signature verification is working
- ✅ HTTPS is enabled in production
- ✅ Error handling doesn't expose sensitive information
- ✅ Price validation is working on both client and server
- ✅ Origin validation is configured for production domain

## Step 8: Database Integration (Optional)

To track user subscriptions, implement the helper functions in the webhook handler:

```typescript
// Example implementation
async function updateUserSubscription(session: Stripe.Checkout.Session) {
  // Get user from session.customer_email or session.client_reference_id
  // Update user's subscription status in your database
}

async function handleSubscriptionCancellation(subscription: Stripe.Subscription) {
  // Update user's plan to free tier
  // Set cancellation date
}
```

## Troubleshooting

### Common Issues:
1. **"Invalid price ID"** - Check that price IDs in environment variables match Stripe dashboard
2. **"Unauthorized origin"** - Ensure NEXT_PUBLIC_BASE_URL matches your domain
3. **Webhook signature verification failed** - Check webhook secret and endpoint URL
4. **Payment not processing** - Verify all environment variables are set correctly

### Debug Mode:
Enable debug logging by adding to your environment:
```env
STRIPE_LOG_LEVEL=debug
```

## Support

For issues with this integration:
1. Check Stripe Dashboard logs
2. Review server console logs
3. Test with Stripe CLI
4. Consult Stripe documentation: https://stripe.com/docs

## Security Best Practices

1. **Never expose secret keys** in client-side code
2. **Always validate** webhook signatures
3. **Verify amounts** on the server side
4. **Use HTTPS** in production
5. **Implement proper logging** for monitoring
6. **Set up alerts** for failed payments
7. **Regularly rotate** webhook secrets
8. **Monitor** for suspicious activity 