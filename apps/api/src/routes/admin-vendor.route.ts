import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { getPendingVendorApplications } from "../controllers/admin-vendor.controller.js";
import { authMiddleware, requireRole } from "../middlewares/auth.middleware.js";

export const adminVendorRoutes = new OpenAPIHono();

const ErrorSchema = z
  .object({
    success: z.boolean().openapi({ example: false }),
    message: z.string().openapi({ example: "Error message" }),
  })
  .openapi("AdminVendorErrorResponse");

const SuccessSchema = z
  .object({
    success: z.boolean().openapi({ example: true }),
    message: z.string().openapi({ example: "Success message" }),
    data: z.any().optional(),
  })
  .openapi("AdminVendorSuccessResponse");

adminVendorRoutes.openapi(
  createRoute({
    method: "get",
    path: "/vendors/pending",
    tags: ["Admin Vendor Review"],
    summary: "Get pending vendor applications",
    security: [
      {
        bearerAuth: [],
      },
    ],
    responses: {
      200: {
        content: {
          "application/json": {
            schema: SuccessSchema,
          },
        },
        description: "Pending vendor applications fetched successfully",
      },
      401: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description: "Unauthorized",
      },
      403: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description: "Forbidden - Insufficient permissions",
      },
      500: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description: "Failed to fetch pending vendor applications",
      },
    },
    middleware: [authMiddleware, requireRole("ADMIN")],
  }),
  getPendingVendorApplications as any,
);
