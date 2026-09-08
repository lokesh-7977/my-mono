import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { UpdateOnboardingProfileSchema } from "../validators/onboarding.validator.js";
import { updateOnboardingProfile } from "../controllers/onboarding.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

export const onboardingRoutes = new OpenAPIHono();

const ErrorSchema = z
  .object({
    success: z.boolean().openapi({ example: false }),
    message: z.string().openapi({ example: "Error message" }),
  })
  .openapi("ErrorResponse");

const SuccessSchema = z
  .object({
    success: z.boolean().openapi({ example: true }),
    message: z.string().openapi({ example: "Success message" }),
    data: z.any().optional(),
  })
  .openapi("SuccessResponse");

onboardingRoutes.openapi(
  createRoute({
    method: "patch",
    path: "/profile",
    tags: ["Onboarding"],
    summary: "Update onboarding profile",
    security: [
      {
        bearerAuth: [],
      },
    ],
    request: {
      body: {
        content: {
          "application/json": {
            schema: UpdateOnboardingProfileSchema,
          },
        },
      },
    },
    responses: {
      200: {
        content: {
          "application/json": {
            schema: SuccessSchema,
          },
        },
        description: "Onboarding profile updated successfully",
      },
      400: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description: "Invalid request body",
      },
      401: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description: "Unauthorized",
      },
      404: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description: "User not found",
      },
      500: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description: "Failed to update onboarding profile",
      },
    },
    middleware: [authMiddleware],
  }),
  updateOnboardingProfile as any,
);
