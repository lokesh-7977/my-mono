import "server-only";
import { cookies } from "next/headers";

import { getSession } from "@/api/auth/auth.api";
import type { AuthSession } from "@/api/auth/auth.types";

/**
 * Resolves the current session during SSR by forwarding the refresh-token
 * cookie from the incoming request to the backend. Used to render the
 * correct auth state (Login vs. Logout) on first paint, avoiding a
 * client-side flash of the wrong state.
 */
export async function getServerSession(): Promise<AuthSession | null> {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!refreshToken) return null;

  return getSession(`refreshToken=${refreshToken}`);
}
