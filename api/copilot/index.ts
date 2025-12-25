import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { cosmosClient } from "../lib/cosmos";
import { authenticate, hasRequiredRole, Roles } from "../lib/auth";
import { telemetryClient } from "../lib/insights";
import OpenAI from "openai";
import { v4 as uuid } from "uuid";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function httpTrigger(context: Context, req: HttpRequest): Promise<void> {
  try {
    const { userId, roles: userRoles } = await authenticate(req);
    if (!hasRequiredRole(["user", "premium", "admin"], userRoles)) {
      context.res = { status: 403, body: { error: 'Forbidden: Insufficient role' } };
      return;
    }

    const container = cosmosClient.database("litreelabdb").container("copilotThreads");

    if (req.method === "POST") {
      const { prompt, threadId } = req.body;
      if (!prompt) throw new Error("Missing prompt");

      let thread;
      if (threadId) {
        // Fetch existing thread (idempotent: no duplicate creation)
        const { resource } = await container.item(threadId, threadId).read();
        if (!resource || resource.userId !== userId) throw new Error("Thread not found or unauthorized");
        thread = resource;
      } else {
        // Create new thread
        const newThreadId = uuid();
        thread = {
          id: newThreadId,
          userId,
          messages: [],
          createdAt: new Date().toISOString()
        };
        await container.items.create(thread);
      }

      // Add user message
      thread.messages.push({ role: "user", content: prompt });

      // Call OpenAI (with context from thread)
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",  // Or latest model
        messages: thread.messages
      });
      const reply = completion.choices[0].message.content;

      // Add assistant reply
      thread.messages.push({ role: "assistant", content: reply });

      // Update thread
      await container.item(thread.id, thread.id).replace(thread);

      telemetryClient.trackEvent({ name: "CopilotPromptProcessed", properties: { userId, threadId: thread.id, promptLength: prompt.length } });
      context.res = { status: 200, body: { reply, threadId: thread.id } };
      return;
    }

    if (req.method === "GET" && req.query.threadId) {
      // Get thread history
      const threadId = req.query.threadId as string;
      const { resource: thread } = await container.item(threadId, threadId).read();
      if (!thread || thread.userId !== userId) throw new Error("Thread not found or unauthorized");

      telemetryClient.trackEvent({ name: "CopilotThreadRetrieved", properties: { userId, threadId } });
      context.res = { status: 200, body: thread };
      return;
    }

    context.res = { status: 405, body: "Method not allowed" };
  } catch (err) {
    const error = err as Error;
    context.log.error(`Copilot Error: ${error.message}`);
    telemetryClient.trackException({ exception: error, properties: { userId: req.headers['x-user-id'] } });
    context.res = { status: 500, body: `Error: ${error.message}` };
  }
};

export default httpTrigger;
