import { HttpRequest, InvocationContext, HttpResponseInit } from "@azure/functions";
import Stripe from "stripe";
import { getSecret } from "../lib/keyvault/index";

export default async function httpTrigger(context: InvocationContext, req: HttpRequest): Promise<HttpResponseInit> {
  try {
    const { amount, currency = "usd", description } = await req.json();
    if (!amount || !description) {
      return { status: 400, jsonBody: { error: "Missing amount or description" } };
    }

    // Get Stripe secret key
    const stripeSecret = await getSecret("STRIPE_SECRET_KEY");
    const stripe = new Stripe(stripeSecret, { apiVersion: "2022-11-15" });

    // Create a PaymentIntent for Google Pay
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency,
      payment_method_types: ["card"], // Google Pay uses card type
      description,
    });

    return {
      status: 200,
      jsonBody: {
        clientSecret: paymentIntent.client_secret,
        publishableKey: await getSecret("STRIPE_PUBLISHABLE_KEY")
      }
    };
  } catch (err) {
    context.error("Google Pay payment failed:", err);
    return { status: 500, jsonBody: { error: (err as Error).message } };
  }
}
