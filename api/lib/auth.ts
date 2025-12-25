import jwt from "jsonwebtoken";
import { HttpRequest } from "@azure/functions";

export async function authenticate(req: HttpRequest): Promise<string> {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) throw new Error("Unauthorized: No token provided");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    return decoded.userId;
  } catch (err) {
    throw new Error("Unauthorized: Invalid token");
  }
}
