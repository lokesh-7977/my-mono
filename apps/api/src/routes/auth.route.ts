import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import {
    GoogleLoginSchema
} from "../validators/auth.validators.js"

import { googleLogin } from "../controllers/auth.controllers.js"

export const authRoutes = new OpenAPIHono();

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



authRoutes.openapi(
    createRoute({
        method: "post",
        path: "/google",

        tags: ["Auth"],

        summary: "Login or signup with Google",

        request: {
            body: {
                content: {
                    "application/json": {
                        schema: GoogleLoginSchema,
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
                description: "Google authentication successful",
            },

            400: {
                content: {
                    "application/json": {
                        schema: ErrorSchema,
                    },
                },
                description: "Invalid request",
            },

            401: {
                content: {
                    "application/json": {
                        schema: ErrorSchema,
                    },
                },
                description: "Invalid Google token",
            },
        },
    }),

    googleLogin as any,
);