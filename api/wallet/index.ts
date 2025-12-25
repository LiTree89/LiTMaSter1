import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { cosmosClient } from "../lib/cosmos";
import { authenticate } from "../lib/auth";
import { telemetryClient } from "../lib/insights";
import { v4 as uuid } from "uuid";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  try {

    // Authenticate and check roles
    const userId = await authenticate(req);
    // Extract roles from JWT (assume authenticate returns decoded token with roles[] or userId)
    let userRoles: string[] = [];
    try {
      // If authenticate returns just userId, decode token again to get roles
      const authHeader = req.headers?.authorization;
      const token = authHeader?.split(' ')[1];
      if (token) {
        const decoded: any = require('jsonwebtoken').decode(token);
        if (decoded && Array.isArray(decoded.roles)) userRoles = decoded.roles;
      }
    } catch {}
    if (!userRoles.includes('user') && !userRoles.includes('admin')) {
      context.res = { status: 403, body: { error: 'Forbidden: Insufficient role' } };
      return;
    }

    const container = cosmosClient.database("litreelabdb").container("walletTransactions");

    if (req.method === "GET" && req.url.endsWith("/balance")) {
      // Compute balance from ledger (read-only, no idempotency needed)
      const { resources } = await container.items.query({
        query: "SELECT * FROM c WHERE c.userId = @userId",
        parameters: [{ name: "@userId", value: userId }]
      }).fetchAll();

      const balance = resources.reduce((sum, txn) => {
        return txn.type === "earn" ? sum + txn.amount : sum - txn.amount;
      }, 0);

      telemetryClient.trackEvent({ name: "WalletBalanceQueried", properties: { userId, balance } });
      context.res = { status: 200, body: { balance } };
      return;
    }

    if (req.method === "POST" && req.url.endsWith("/earn")) {
      // Earn transaction (idempotent: source-based check)
      const { amount, source } = req.body;
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

    if (req.method === "POST" && req.url.endsWith("/spend")) {
      // Spend transaction (idempotent: similar source check, plus balance validation)
      const { amount, source } = req.body;
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
      const currentBalance = allTxns.reduce((sum, txn) => txn.type === "earn" ? sum + txn.amount : sum - txn.amount, 0);
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
    context.log.error(`Wallet Error: ${error.message}`);
    telemetryClient.trackException({ exception: error, properties: { userId: req.headers['x-user-id'] } });
    context.res = { status: 500, body: `Error: ${error.message}` };
  }
};

export default httpTrigger;
