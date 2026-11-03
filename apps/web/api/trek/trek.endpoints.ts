export const trekEndpoints = {
  bySlug: (slug: string) => ({
    key: "trek-by-slug",
    endpoint: `/treks/public/slug/${slug}`,
  }),
} as const;
