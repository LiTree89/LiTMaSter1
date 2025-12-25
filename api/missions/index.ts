import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { cosmosClient } from "../lib/cosmos";  // Assumes lib/cosmos.ts exports CosmosClient
import { authenticate } from "../lib/auth";  // JWT middleware from lib/auth.ts
import { telemetryClient } from "../lib/insights";  // App Insights client from lib/insights.ts
import { v4 as uuid } from "uuid";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  try {
    // Authenticate user
    const userId = await authenticate(req);  // Throws if unauthorized

    const container = cosmosClient.database("litreelabdb").container("missions");

    if (req.method === "GET") {
      // List missions for user
      const { resources } = await container.items.query({
        query: "SELECT * FROM c WHERE c.userId = @userId",
        parameters: [{ name: "@userId", value: userId }]
      }).fetchAll();
      telemetryClient.trackEvent({ name: "MissionsListed", properties: { userId, count: resources.length } });
      context.res = { status: 200, body: resources };
      return;
    }

    if (req.method === "POST" && req.url.endsWith("/start")) {
      // Start new mission (idempotent: check if already started)
      const { type, title, target } = req.body;
      if (!type || !title || !target) throw new Error("Missing required fields");

      const missionId = uuid();
      const newMission = {
        id: missionId,
        userId,
        type,
        title,
        status: "in-progress",
        progress: 0,
        target,
        reward: { litbits: 50 },  // Example reward
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Idempotency: Check if similar mission exists
      const { resources: existing } = await container.items.query({
        query: "SELECT * FROM c WHERE c.userId = @userId AND c.type = @type AND c.status = 'in-progress'",
        parameters: [{ name: "@userId", value: userId }, { name: "@type", value: type }]
      }).fetchAll();
      if (existing.length > 0) {
        telemetryClient.trackEvent({ name: "MissionStartDuplicate", properties: { userId, type } });
        context.res = { status: 200, body: { message: "Mission already in progress", mission: existing[0] } };
        return;
      }

      await container.items.create(newMission);
      telemetryClient.trackEvent({ name: "MissionStarted", properties: { userId, missionId } });
      context.res = { status: 201, body: newMission };
      return;
    }

    if (req.method === "POST" && req.url.endsWith("/complete")) {
      // Complete mission (idempotent: check status)
      const { missionId } = req.body;
      if (!missionId) throw new Error("Missing missionId");

      const { resource: mission } = await container.item(missionId, missionId).read();
      if (!mission || mission.userId !== userId) throw new Error("Mission not found or unauthorized");

      if (mission.status === "completed") {
        telemetryClient.trackEvent({ name: "MissionCompleteDuplicate", properties: { userId, missionId } });
        context.res = { status: 200, body: { message: "Mission already completed", mission } };
        return;
      }

      mission.status = "completed";
      mission.updatedAt = new Date().toISOString();
      await container.item(missionId, missionId).replace(mission);

      // Trigger reward (call wallet earn - assume /api/wallet/earn exists or integrate)
      const walletContainer = cosmosClient.database("litreelabdb").container("walletTransactions");
      await walletContainer.items.create({
        id: uuid(),
        userId,
        type: "earn",
        amount: mission.reward.litbits,
        source: `mission:${missionId}`,
        timestamp: new Date().toISOString()
      });

      telemetryClient.trackEvent({ name: "MissionCompleted", properties: { userId, missionId, reward: mission.reward.litbits } });
      context.res = { status: 200, body: { message: "Mission completed and reward added", mission } };
      return;
    }

    context.res = { status: 405, body: "Method not allowed" };
  } catch (err) {
    const error = err as Error;
    context.log.error(`Missions Error: ${error.message}`);
    telemetryClient.trackException({ exception: error, properties: { userId: req.headers['x-user-id'] } });
    context.res = { status: 500, body: `Error: ${error.message}` };
  }
};

export default httpTrigger;
