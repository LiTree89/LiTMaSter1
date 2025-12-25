```typescript
// Sample test code for payments in your Node.js/TypeScript backend (api/ folder).
// Place this in tests/payment.test.ts or similar. Uses Jest for testing.
// Assumes you have dependencies like jest, @types/jest, stripe, coinbase-commerce-node, and google-pay libraries installed.
// All tests use sandbox/test modes to avoid real transactions.

// Setup: Install required packages if not already (npm i jest ts-jest @types/jest stripe coinbase-commerce-node @google-pay/button-react --save-dev)
// Configure Jest in package.json: "scripts": { "test": "jest" }, and tsconfig for tests.

// Import necessary modules
import { describe, it, expect, beforeAll } from '@jest/globals';
import Stripe from 'stripe';
import Client from 'coinbase-commerce-node'; // For Coinbase
// For Google Pay, use a mock or library like @google-pay/button-react for frontend, but backend verification below.

// Load environment variables (e.g., from .env or Azure Key Vault via lib/secrets.ts)
const stripe = new Stripe(process.env.STRIPE_TEST_SECRET_KEY || 'sk_test_...', { apiVersion: '2024-04-10' });
const coinbaseClient = new Client.init(process.env.COINBASE_TEST_API_KEY || 'your_sandbox_key');

// Mock Google Pay token verification (since Google Pay backend verification uses Google's API)
async function verifyGooglePayToken(token: string): Promise<boolean> {
  // In real code, use Google's API to decrypt/verify the payment token.
  // For test: Simulate success if token is 'test_token'
  return token === 'test_token';
}

describe('Payment Integrations Tests (Sandbox Mode)', () => {

  beforeAll(() => {
    // Ensure sandbox mode
    console.log('Running tests in sandbox mode - no real charges.');
  });

  describe('Stripe Webhook and Payment Testing', () => {
    it('should create a test checkout session', async () => {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{ price: 'price_12345', quantity: 1 }], // Use your test price ID
        mode: 'payment',
        success_url: 'https://example.com/success',
        cancel_url: 'https://example.com/cancel',
      });
      expect(session.id).toBeDefined();
      expect(session.payment_status).toBe('unpaid'); // Initial status
    });

    it('should handle a test webhook event', async () => {
      // Simulate webhook payload (use Stripe CLI to trigger real test events)
      const mockEvent = {
        type: 'checkout.session.completed',
        data: { object: { id: 'cs_test_...', amount_total: 1000 } },
      };
      // In your api/stripe-webhook.ts, handle this event (e.g., update DB)
      // For test: Assume a handler function
      const handleWebhook = (event: any) => {
        if (event.type === 'checkout.session.completed') {
          // Update Cosmos DB, log to App Insights
          return { success: true, message: 'Payment completed' };
        }
        return { success: false };
      };
      const result = handleWebhook(mockEvent);
      expect(result.success).toBe(true);
    });
  });

  describe('Coinbase Payment Testing', () => {
    it('should create a test charge', async () => {
      const Charge = Client.resources.Charge;
      const chargeData = {
        name: 'Test NFT Purchase',
        description: 'Sandbox test charge',
        local_price: { amount: '10.00', currency: 'USD' },
        pricing_type: 'fixed_price',
      };
      const charge = await Charge.create(chargeData);
      expect(charge.id).toBeDefined();
      expect(charge.hosted_url).toBeDefined(); // URL for payment
    });

    it('should verify a test charge completion', async () => {
      // Simulate a completed charge ID from previous creation
      const testChargeId = 'test_charge_id'; // Replace with real from above
      const charge = await Client.resources.Charge.retrieve(testChargeId);
      // In real: Check timelines for 'CONFIRMED'
      expect(charge.status).toBe('NEW'); // Initial, or mock to 'CONFIRMED'
    });
  });

  describe('Google Pay Token Verification', () => {
    it('should verify a valid test token', async () => {
      const validToken = 'test_token';
      const isValid = await verifyGooglePayToken(validToken);
      expect(isValid).toBe(true);
    });

    it('should reject an invalid token', async () => {
      const invalidToken = 'bad_token';
      const isValid = await verifyGooglePayToken(invalidToken);
      expect(isValid).toBe(false);
    });
  });

});
```

To run: `npm test` in your project root. This tests creation and basic handling in sandbox—expand with mocks for full E2E (e.g., using nock for API mocking). For frontend, add React Testing Library tests for payment buttons. If you need samples for NFT minting or SignalR, let me know!