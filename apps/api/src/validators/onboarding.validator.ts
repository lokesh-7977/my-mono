import { z } from "@hono/zod-openapi";

export const UpdateOnboardingProfileSchema = z.object({
  firstName: z.string().min(1).openapi({
    example: "Ayaan",
  }),

  lastName: z.string().min(1).openapi({
    example: "Ahmed Abbasi",
  }),

  phone: z.string().min(10).openapi({
    example: "9876543210",
  }),

  address: z.string().min(1).openapi({
    example: "Malviya Nagar",
  }),

  city: z.string().min(1).openapi({
    example: "Jaipur",
  }),

  state: z.string().min(1).openapi({
    example: "Rajasthan",
  }),

  country: z.string().min(1).openapi({
    example: "India",
  }),

  pinCode: z.string().min(6).openapi({
    example: "302017",
  }),

  languages: z.array(z.string()).min(1).openapi({
    example: ["Hindi", "English"],
  }),

  avatarUrl: z.string().url().optional().openapi({
    example: "https://example.com/profile.jpg",
  }),
});
