import { InvocationContext, HttpRequest, HttpResponseInit } from "@azure/functions";
// Ensure you have installed Stripe: npm install stripe @types/stripe --save
// Ensure you have ../lib/keyvault implemented and exported getSecret
import Stripe from "stripe";
import { getSecret } from "../lib/keyvault";
import { verifyRole } from "../lib/auth";

  try {
    // Role-based authentication
    const userRole = req.headers.get("x-user-role") || "";
    if (!verifyRole(userRole, ["admin", "billing"])) {
      return {
        status: 403,
        jsonBody: { error: "Forbidden: Insufficient permissions" }
      } as HttpResponseInit;
    }

    // Input validation with type guard
    const body = await req.json();
    if (
      typeof body !== "object" || body === null ||
      typeof body.customerId !== "string" ||
      typeof body.amount !== "number" ||
      typeof body.description !== "string" ||
      ("recurring" in body && typeof body.recurring !== "boolean")
    ) {
      throw new Error("Invalid request body");
    }
    const { customerId, amount, description, recurring } = body as {
      customerId: string;
      amount: number;
      description: string;
      recurring?: boolean;
    };

    // Load Stripe secret from Key Vault
    const stripeSecret = await getSecret("STRIPE_SECRET_KEY");
    const stripe = new Stripe(stripeSecret, { apiVersion: "2024-04-10" });

    // Adaptive pricing logic
    const finalAmount = recurring ? amount * 0.9 : amount; // 10% discount for subscriptions

    // Create invoice item
    await stripe.invoiceItems.create({
      customer: customerId,
      amount: Math.round(finalAmount * 100),
      currency: "usd",
      description,
    });

    // Create and finalize invoice
    const invoice = await stripe.invoices.create({
      customer: customerId,
      auto_advance: true,
      collection_method: recurring ? "charge_automatically" : "send_invoice",
    });

    context.log(`Invoice created for ${customerId}: ${invoice.id}`);
    return {
      status: 200,
      jsonBody: { success: true, invoiceUrl: invoice.hosted_invoice_url }
    } as HttpResponseInit;
  } catch (err) {
    context.error("Invoice creation failed:", err);
    return {
      status: 400,
      jsonBody: { error: (err as Error).message }
    } as HttpResponseInit;
  }
}
}
