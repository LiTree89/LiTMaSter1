import { Context, HttpRequest } from "@azure/functions";
import fetch from "node-fetch";
import { getSecret } from "../lib/keyvault";

export default async function httpTrigger(context: Context, req: HttpRequest): Promise<void> {
  try {
    const { amount, description } = req.body;
    if (!amount || isNaN(amount) || amount <= 0) throw new Error("Invalid amount");
    if (!description || typeof description !== "string") throw new Error("Invalid description");

    const apiKey = await getSecret("COINBASE_API_KEY");

    const response = await fetch("https://api.commerce.coinbase.com/charges", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CC-Api-Key": apiKey,
      },
      body: JSON.stringify({
        name: description,
        pricing_type: "fixed_price",
        local_price: { amount, currency: "USD" },
      }),
    });

    const data = await response.json();
    context.res = { status: 200, body: { success: true, cryptoUrl: data.data.hosted_url } };
  } catch (err) {
    context.log.error("Crypto invoice creation failed:", err);
    context.res = { status: 400, body: { error: (err as Error).message } };
  }
}
