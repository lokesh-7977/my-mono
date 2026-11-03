export const authEndpoints = {
  google: {
    key: "google",
    endpoint: "/auth/google",
  },
  refresh: {
    key: "refresh",
    endpoint: "/auth/refresh",
  },
  session: {
    key: "session",
    endpoint: "/auth/session",
  },
  me: {
    key: "me",
    endpoint: "/auth/me",
  },
  logout: {
    key: "logout",
    endpoint: "/auth/logout",
  },
} as const;
