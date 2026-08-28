import { z } from "@hono/zod-openapi";

export const GoogleLoginSchema = z.object({
    idToken: z.string().min(1),
});
