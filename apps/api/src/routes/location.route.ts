import {
  createRoute,
  OpenAPIHono,
  z,
} from "@hono/zod-openapi";

import { searchLocations } from "../controllers/location.controller.js";
import { SearchLocationQuerySchema } from "../validators/location.validator.js";

export const LocationRoutes =
  new OpenAPIHono();

const ErrorSchema = z
  .object({
    success: z.boolean().openapi({
      example: false,
    }),
    message: z.string().openapi({
      example: "Error message",
    }),
  })
  .openapi("LocationErrorResponse");

const SuccessSchema = z
  .object({
    success: z.boolean().openapi({
      example: true,
    }),
    message: z.string().openapi({
      example:
        "Locations fetched successfully",
    }),
    data: z.any().optional(),
  })
  .openapi("LocationSuccessResponse");

LocationRoutes.openapi(
  createRoute({
    method: "get",
    path: "/",

    tags: ["Location"],

    summary: "Search locations",

      request: {
      query: SearchLocationQuerySchema,
    },


    responses: {
      200: {
        content: {
          "application/json": {
            schema: SuccessSchema,
          },
        },
        description:
          "Locations fetched successfully",
      },

      400: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description:
          "Search query is required",
      },

      500: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description:
          "Failed to fetch locations",
      },
    },
  }),

  searchLocations as any,
);