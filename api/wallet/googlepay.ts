import { HttpRequest, InvocationContext, HttpResponseInit } from "@azure/functions";
import braintree from "braintree";
import { sendEmail } from "../lib/sendEmail";

export default async function httpTrigger(context: InvocationContext, req: HttpRequest): Promise<HttpResponseInit> {
  try {
    const { nonce, amount, email } = await req.json();
    if (!nonce || !amount) {
      return { status: 400, jsonBody: { error: "Missing nonce or amount" } };
    }

    // Braintree gateway setup (use env vars in production)
    const gateway = new braintree.BraintreeGateway({
      environment: braintree.Environment.Sandbox, // or Production
      merchantId: process.env.BRAINTREE_MERCHANT_ID || "your_merchant_id",
      publicKey: process.env.BRAINTREE_PUBLIC_KEY || "your_public_key",
      privateKey: process.env.BRAINTREE_PRIVATE_KEY || "your_private_key",
    });

    const saleRequest = {
      amount: amount.toString(),
      paymentMethodNonce: nonce,
      options: { submitForSettlement: true },
    };
    const result = await gateway.transaction.sale(saleRequest);
    if (result.success) {
      await sendEmail({
        to: email || "dyingbreed243@gmail.com",
        subject: "Google Pay Payment Received",
        text: `Payment of $${amount} received via Google Pay. Transaction ID: ${result.transaction.id}`,
      });
      return { status: 200, jsonBody: { success: true, transaction: result.transaction } };
    } else {
      return { status: 500, jsonBody: { error: result.message } };
    }
  } catch (err) {
    context.error("Google Pay payment failed:", err);
    return { status: 500, jsonBody: { error: (err as Error).message } };
  }
}
