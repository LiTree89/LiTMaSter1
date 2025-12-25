import { InvocationContext, HttpRequest, HttpResponseInit } from "@azure/functions";
// Ensure you have installed Google Pay integration dependencies
// Ensure you have ../lib/keyvault implemented and exported getSecret
// import Google Pay integration here (to be added)
// import { getSecret } from "../lib/keyvault/index";
import { verifyRole } from "../lib/auth";

export default async function httpTrigger(context: InvocationContext, req: HttpRequest): Promise<HttpResponseInit> {
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
      !("customerId" in body) || typeof (body as any).customerId !== "string" ||
      !("amount" in body) || typeof (body as any).amount !== "number" ||
      !("description" in body) || typeof (body as any).description !== "string" ||
      ("recurring" in body && typeof (body as any).recurring !== "boolean")
    ) {
      throw new Error("Invalid request body");
    }
    const { customerId, amount, description, recurring } = body as {
      customerId: string;
      amount: number;
      description: string;
      recurring?: boolean;
    };

    // TODO: Integrate Google Pay here
    // Placeholder response for now
    return {
      status: 200,
      jsonBody: { success: true, invoiceUrl: "GOOGLE_PAY_URL_PLACEHOLDER" }
    } as HttpResponseInit;
  } catch (err) {
    context.error("Invoice creation failed:", err);
    return {
      status: 400,
      jsonBody: { error: (err as Error).message }
    } as HttpResponseInit;
  }
}
