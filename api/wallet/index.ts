import { Context, HttpRequest } from "azure-functions-ts-essentials";
import { cosmosClient } from "../lib/cosmos.ts";
import { authenticate, hasRequiredRole, Roles } from "../lib/auth";
import { telemetryClient } from "../lib/insights";
import { v4 as uuid } from "uuid";

const httpTrigger = async function (context: Context, req: HttpRequest): Promise<void> {
  try {

    // Authenticate and check roles
    // Use HttpRequest type for authenticate
    const { userId, roles: userRoles } = await authenticate(req);
    if (!hasRequiredRole(["user", "admin"], userRoles)) {
      context.res = { status: 403, body: { error: 'Forbidden: Insufficient role' } };
      return;
    }

    const container = cosmosClient.database("litreelabdb").container("walletTransactions");

    if (req.method === "GET" && req.originalUrl && req.originalUrl.includes("/balance")) {
      // Compute balance from ledger (read-only, no idempotency needed)
      const { resources } = await container.items.query({
        query: "SELECT * FROM c WHERE c.userId = @userId",
        parameters: [{ name: "@userId", value: userId }]
      }).fetchAll();

      const balance = resources.reduce((sum: number, txn: { type: string; amount: number }) => {
        return txn.type === "earn" ? sum + txn.amount : sum - txn.amount;
      }, 0);

      telemetryClient.trackEvent({ name: "WalletBalanceQueried", properties: { userId, balance } });
      context.res = { status: 200, body: { balance } };
      return;
    }

    if (req.method === "POST" && req.originalUrl && req.originalUrl.includes("/earn")) {
      // Earn transaction (idempotent: source-based check)
      let body = req.body;
      if (typeof body === 'string') body = JSON.parse(body);
      const { amount, source } = body || {};
      if (!amount || !source) throw new Error("Missing amount or source");

      // Check if transaction already exists for this source
      const { resources: existing } = await container.items.query({
        query: "SELECT * FROM c WHERE c.userId = @userId AND c.source = @source",
        parameters: [{ name: "@userId", value: userId }, { name: "@source", value: source }]
      }).fetchAll();
      if (existing.length > 0) {
        telemetryClient.trackEvent({ name: "WalletEarnDuplicate", properties: { userId, source } });
        context.res = { status: 200, body: { message: "Transaction already processed", transaction: existing[0] } };
        return;
      }

      const txn = {
        id: uuid(),
        userId,
        type: "earn",
        amount,
        source,
        timestamp: new Date().toISOString()
      };
      await container.items.create(txn);

      telemetryClient.trackEvent({ name: "WalletEarned", properties: { userId, amount, source } });
      context.res = { status: 201, body: txn };
      return;
    }

    if (req.method === "POST" && req.originalUrl && req.originalUrl.includes("/spend")) {
      // Spend transaction (idempotent: similar source check, plus balance validation)
      let body = req.body;
      if (typeof body === 'string') body = JSON.parse(body);
      const { amount, source } = body || {};
      if (!amount || !source) throw new Error("Missing amount or source");

      // Idempotency check
      const { resources: existing } = await container.items.query({
        query: "SELECT * FROM c WHERE c.userId = @userId AND c.source = @source",
        parameters: [{ name: "@userId", value: userId }, { name: "@source", value: source }]
      }).fetchAll();
      if (existing.length > 0) {
        telemetryClient.trackEvent({ name: "WalletSpendDuplicate", properties: { userId, source } });
        context.res = { status: 200, body: { message: "Transaction already processed", transaction: existing[0] } };
        return;
      }

      // Validate balance (compute to ensure sufficient funds)
      const { resources: allTxns } = await container.items.query({
        query: "SELECT * FROM c WHERE c.userId = @userId",
        parameters: [{ name: "@userId", value: userId }]
      }).fetchAll();
      const currentBalance = allTxns.reduce((sum: number, txn: { type: string; amount: number }) => txn.type === "earn" ? sum + txn.amount : sum - txn.amount, 0);
      if (currentBalance < amount) throw new Error("Insufficient balance");

      const txn = {
        id: uuid(),
        userId,
        type: "spend",
        amount,
        source,
        timestamp: new Date().toISOString()
      };
      await container.items.create(txn);

      telemetryClient.trackEvent({ name: "WalletSpent", properties: { userId, amount, source } });
      context.res = { status: 201, body: txn };
      return;
    }

    context.res = { status: 405, body: "Method not allowed" };
  } catch (err) {
    const error = err as Error;
    if (context.log) context.log.error(`Wallet Error: ${error.message}`);
    telemetryClient.trackException({ exception: error, properties: { userId: req.headers?.["x-user-id"] || "unknown" } });
    context.res = { status: 500, body: `Error: ${error.message}` };
  }
};

export default httpTrigger;
