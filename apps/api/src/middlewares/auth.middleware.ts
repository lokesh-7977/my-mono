import type { Context, Next } from "hono";
import ApiResponse from "../utils/api-response.js";
import * as JwtService from "../lib/jwt.service.js";

export const authMiddleware = async (
  c: Context,
  next: Next,
): Promise<Response | void> => {
  const authHeader = c.req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return ApiResponse.error(
      "Unauthorized - Missing token",
      401,
    ).send(c);
  }

  const token = authHeader.slice(7);

  try {
    const payload = await JwtService.verifyAccessToken(token);

    c.set("userId", payload.id);
    c.set("sessionId", payload.sessionId);

    await next();
  } catch (error) {
    return ApiResponse.error(
      "Unauthorized - Invalid or expired token",
      401,
    ).send(c);
  }
};
