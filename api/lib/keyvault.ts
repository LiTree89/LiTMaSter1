// Minimal mock for getSecret. Replace with real Azure Key Vault integration as needed.
export async function getSecret(secretName: string): Promise<string> {
  // For development, return a dummy secret. Replace with secure retrieval in production.
  if (secretName === "STRIPE_SECRET_KEY") {
    return process.env.STRIPE_SECRET_KEY || "sk_test_dummy";
  }
  throw new Error(`Secret not found: ${secretName}`);
}
