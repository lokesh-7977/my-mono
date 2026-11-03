import { apiRequest, ApiError } from "../service/api-handler";
import { authEndpoints } from "./auth.endpoints";
import type {
  AuthSession,
  AuthUser,
  GoogleLoginResponseData,
  SessionResponseData,
} from "./auth.types";

export { ApiError };

export async function googleLogin(idToken: string): Promise<AuthSession> {
  const data = await apiRequest<GoogleLoginResponseData>({
    url: authEndpoints.google.endpoint,
    method: "POST",
    data: { idToken },
  });

  return {
    user: { name: data.name, email: data.email, avatarUrl: data.avatarUrl },
    accessToken: data.accessToken,
  };
}

export async function refreshSession(): Promise<{ accessToken: string }> {
  return apiRequest<{ accessToken: string }>({
    url: authEndpoints.refresh.endpoint,
    method: "POST",
  });
}

/**
 * Checks for an active session without rotating the refresh token, so it's
 * safe to call on every page load (e.g. from a Server Component during SSR).
 * On the client, the browser attaches the cookie automatically via
 * `withCredentials`; on the server, pass the cookie header manually since
 * there's no browser cookie jar to rely on.
 */
export async function getSession(
  cookieHeader?: string,
): Promise<AuthSession | null> {
  try {
    const data = await apiRequest<SessionResponseData>({
      url: authEndpoints.session.endpoint,
      headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
    });

    return {
      user: {
        name: data.user.name,
        email: data.user.email,
        avatarUrl: data.user.avatarUrl,
      },
      accessToken: data.accessToken,
    };
  } catch {
    return null;
  }
}

export async function getCurrentUser(accessToken: string): Promise<AuthUser> {
  return apiRequest<AuthUser>({
    url: authEndpoints.me.endpoint,
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export async function logoutSession(accessToken: string): Promise<void> {
  await apiRequest<void>({
    url: authEndpoints.logout.endpoint,
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}
