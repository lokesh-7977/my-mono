import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";

import { CreateMasterTrekSchema } from "../validators/master-trek.validator.js";


import { createMasterTrek } from "../controllers/master-trek.controller.js";

import {authMiddleware,requireRole} from "../middlewares/auth.middleware.js"

export const MasterTrekRoutes = new OpenAPIHono();



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




MasterTrekRoutes.openapi(
  createRoute({
    method: "post",
    path: "/",

    tags: ["Trek"],

    summary: "Create master trek",

    security: [
      {
        bearerAuth: [],
      },
    ],

    request: {
      body: {
        content: {
          "application/json": {
            schema: CreateMasterTrekSchema,
          },
        },
      },
    },

    responses: {
      201: {
        content: {
          "application/json": {
            schema: SuccessSchema,
          },
        },
        description: "Trek created successfully",
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

      403: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description: "Forbidden - Admin only",
      },

      500: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description: "Failed to create trek",
      },
    },

    middleware: [
      authMiddleware,
      requireRole("ADMIN"),
    ],
  }),

  createMasterTrek as any,
);
