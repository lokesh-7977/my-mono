export const packageEndpoints = {
  byId: (id: string) => ({
    key: "package-by-id",
    endpoint: `/package/public/${id}`,
  }),
} as const;
