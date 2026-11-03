import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import {
    GoogleLoginSchema
} from "../validators/auth.validator.js"

import { googleLogin, logout, refresh, getCurrentUser, getSession } from "../controllers/auth.controller.js"

import { authMiddleware } from "../middlewares/auth.middleware.js";

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



authRoutes.openapi(
    createRoute({
        method: "post",
        path: "/logout",
        tags: ["Auth"],
        summary: "Logout current session",
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
                description: "Logged out successfully",
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
                description: "Session not found",
            },
        },
        middleware: [authMiddleware],
    }),
    logout as any,
);


authRoutes.openapi(
    createRoute({
        method: "post",
        path: "/refresh",
        tags: ["Auth"],
        summary: "Refresh access token",

        responses: {
            200: {
                content: {
                    "application/json": {
                        schema: SuccessSchema,
                    },
                },
                description: "Token refreshed successfully",
            },

            401: {
                content: {
                    "application/json": {
                        schema: ErrorSchema,
                    },
                },
                description: "Invalid or expired refresh token",
            },
        },
    }),

    refresh as any,
);


authRoutes.openapi(
    createRoute({
        method: "get",
        path: "/session",
        tags: ["Auth"],
        summary: "Check current session via the refresh-token cookie (no rotation)",
        responses: {
            200: {
                content: {
                    "application/json": {
                        schema: SuccessSchema,
                    },
                },
                description: "Session verified",
            },
            401: {
                content: {
                    "application/json": {
                        schema: ErrorSchema,
                    },
                },
                description: "No active session",
            },
        },
    }),
    getSession as any,
);


authRoutes.openapi(
    createRoute({
        method: "get",
        path: "/me",
        tags: ["Auth"],
        summary: "Get current authenticated user",
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
                description: "Current user fetched successfully",
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
        },
        middleware: [authMiddleware],
    }),
    getCurrentUser as any,
);

