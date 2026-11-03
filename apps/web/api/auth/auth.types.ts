export interface AuthUser {
  name: string | null;
  email: string;
  avatarUrl: string | null;
}

export interface AuthSession {
  user: AuthUser;
  accessToken: string;
}

export interface GoogleLoginResponseData {
  name: string | null;
  email: string;
  avatarUrl: string | null;
  accessToken: string;
}

export interface SessionResponseData {
  user: {
    id: string;
    name: string | null;
    email: string;
    role: string;
    avatarUrl: string | null;
  };
  accessToken: string;
}
