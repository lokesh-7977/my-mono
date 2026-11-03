export interface AuthUser {
  name: string | null;
  email: string;
}

export interface AuthSession {
  user: AuthUser;
  accessToken: string;
}

export interface GoogleLoginResponseData {
  name: string | null;
  email: string;
  accessToken: string;
}

export interface SessionResponseData {
  user: {
    id: string;
    name: string | null;
    email: string;
    role: string;
  };
  accessToken: string;
}
