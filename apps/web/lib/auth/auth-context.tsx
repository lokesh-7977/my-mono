"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";

import { googleLogin, logoutSession } from "@/api/auth/auth.api";
import type { AuthUser } from "@/api/auth/auth.types";

interface AuthContextValue {
  user: AuthUser | null;
  accessToken: string | null;
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  loginWithGoogle: (idToken: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
  /** Session resolved server-side (see lib/auth/server-session.ts), so the
   * correct auth state is already known on first paint — no client fetch,
   * no flash of the wrong Login/Logout state. */
  initialUser?: AuthUser | null;
  initialAccessToken?: string | null;
}

export function AuthProvider({
  children,
  initialUser = null,
  initialAccessToken = null,
}: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(initialUser);
  const [accessToken, setAccessToken] = useState<string | null>(
    initialAccessToken,
  );
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const openLoginModal = useCallback(() => {
    if (!user) setIsLoginModalOpen(true);
  }, [user]);
  const closeLoginModal = useCallback(() => setIsLoginModalOpen(false), []);

  const loginWithGoogle = useCallback(async (idToken: string) => {
    const session = await googleLogin(idToken);
    setUser(session.user);
    setAccessToken(session.accessToken);
    setIsLoginModalOpen(false);
  }, []);

  const logout = useCallback(async () => {
    if (accessToken) {
      await logoutSession(accessToken).catch(() => {});
    }
    setUser(null);
    setAccessToken(null);
  }, [accessToken]);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isLoginModalOpen,
        openLoginModal,
        closeLoginModal,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return ctx;
}
