import { Context, HttpRequest } from "@azure/functions";
import { SignalRMessage } from "@azure/functions";

export default async function httpTrigger(context: Context, req: HttpRequest): Promise<void> {
  const message = req.body.message;
  context.bindings.signalRMessages = [{ target: "newMessage", arguments: [message] }] as SignalRMessage[];
  context.res = { status: 200, body: { success: true } };
}
