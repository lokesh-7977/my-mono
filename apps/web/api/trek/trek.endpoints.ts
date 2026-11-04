export const trekEndpoints = {
  bySlug: (slug: string) => ({
    key: "trek-by-slug",
    endpoint: `/master-trek/public/slug/${slug}`,
  }),
} as const;
