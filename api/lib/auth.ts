
import jwt from "jsonwebtoken";
import { HttpRequest } from "@azure/functions";
import { getSecret } from "./secrets";

export type Roles = "user" | "premium" | "admin";

export async function authenticate(req: HttpRequest): Promise<{ userId: string; roles: Roles[] }> {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) throw new Error("Unauthorized: No token provided");

  const jwtSecret = await getSecret("JWT-SECRET");

  try {
    const decoded = jwt.verify(token, jwtSecret) as { userId: string; roles?: Roles[] };
    return { userId: decoded.userId, roles: decoded.roles || ["user"] };
  } catch {
    throw new Error("Unauthorized: Invalid or expired token");
  }
}

export function hasRequiredRole(required: Roles[], userRoles: Roles[]): boolean {
  return required.some(role => userRoles.includes(role));
}
