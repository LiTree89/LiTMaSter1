// Minimal mock for getSecret. Replace with real Azure Key Vault integration as needed.
export async function getSecret(secretName: string): Promise<string> {
  // For development, return a dummy secret. Replace with secure retrieval in production.
  // Add Google Pay secrets here as needed
  throw new Error(`Secret not found: ${secretName}`);
}
