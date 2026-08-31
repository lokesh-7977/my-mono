import { UserRole } from "@mono/database";

export interface CreateUserData {
  id: string;
  email: string;
  name: string;
  googleId: string;
  avatarUrl?: string | null;
}

export interface CreateSessionData {
  id: string;
  userId: string;
  refreshTokenHash: string;
  expiresAt: Date;
  ipAddress?: string | null;
  userAgent?: string | null;
}

export interface GoogleLoginRequest {
  idToken: string;
}

export interface ClientInfo {
  userAgent?: string;
  ipAddress?: string;
}

export interface GoogleUserPayload {
  id: string;
  email: string;
  name?: string;
  picture?: string;
  emailVerified: boolean;
}

export interface AuthUserResponse {
  id: string;
  name: string | null;
  email: string;
  role: UserRole;
  accessToken: string;
  refreshToken: string;
}
export type LogoutData = {
  sessionId: string;
  userId: string;
};

export type MessageResponse = {
  message: string;
};

export type RefreshResponse = {
  accessToken: string;
  refreshToken: string;
};