import { type Context } from "hono";
import type {
    GoogleLoginRequest,
    ClientInfo
} from "../types/index.js";

import * as AuthService from "../services/auth.service.js"
import * as setRefresh from "../helper/jwt.helper.js"
import ApiResponse from "../utils/api-response.js";
import { CustomError } from "../utils/custom-error.js";
import { logger } from "../utils/logger.js";
import { getCookie } from "hono/cookie";


const getClientInfo = (c: Context): ClientInfo => ({
    userAgent: c.req.header("user-agent"),
    ipAddress: c.req.header("x-forwarded-for") || c.req.header("x-real-ip"),
});




export const googleLogin = async (c: Context): Promise<Response> => {
    try {
        const body = await c.req.json<GoogleLoginRequest>();
        const clientInfo = getClientInfo(c);

        const result = await AuthService.googleLogin(body, clientInfo);

        setRefresh.setRefreshTokenCookie(c, result.refreshToken);

        logger.info(
            { userId: result.id, email: result.email },
            "Google login successful",
        );

        return ApiResponse.success(
            "Google login successful",
            {
                name: result.name,
                email: result.email,
                accessToken: result.accessToken,
            },
        ).send(c);
    } catch (error) {
        logger.error({ error }, "Google login failed");

        if (error instanceof CustomError) {
            return ApiResponse.error(
                error.message,
                error.statusCode,
            ).send(c);
        }

        return ApiResponse.error(
            "Invalid Google token",
            401,
        ).send(c);
    }
};


export const logout = async (
    c: Context,
): Promise<Response> => {
    try {
        const userId = c.get("userId") as string | undefined;
        const sessionId = c.get("sessionId") as string | undefined;

        if (!userId || !sessionId) {
            logger.warn(
                "Logout attempt without authenticated session",
            );

            return ApiResponse.error(
                "Unauthorized",
                401,
            ).send(c);
        }

        const result = await AuthService.logout({
            userId,
            sessionId,
        });

        setRefresh.clearRefreshTokenCookie(c);

        logger.info(
            { userId, sessionId },
            "Logout successful",
        );

        return ApiResponse.success(
            result.message,
        ).send(c);
    } catch (error) {
        logger.error(
            { error },
            "Logout failed",
        );

        if (error instanceof CustomError) {
            return ApiResponse.error(
                error.message,
                error.statusCode,
            ).send(c);
        }

        return ApiResponse.error(
            "An error occurred during logout",
            500,
        ).send(c);
    }
};


export const refresh = async (
    c: Context,
): Promise<Response> => {
    try {
        const refreshToken = getCookie(
            c,
            "refreshToken",
        );

        if (!refreshToken) {
            logger.warn(
                "Token refresh attempted without refresh token",
            );

            return ApiResponse.error(
                "Refresh token missing",
                401,
            ).send(c);
        }

        const result = await AuthService.refresh(
            refreshToken,
        );

        setRefresh.setRefreshTokenCookie(
            c,
            result.refreshToken,
        );

        logger.info(
            "Token refreshed successfully",
        );

        return ApiResponse.success(
            "Token refreshed successfully",
            {
                accessToken: result.accessToken,
            },
        ).send(c);
    } catch (error) {
        logger.error(
            { error },
            "Token refresh failed",
        );

        if (error instanceof CustomError) {
            return ApiResponse.error(
                error.message,
                error.statusCode,
            ).send(c);
        }

        return ApiResponse.error(
            "An error occurred while refreshing token",
            500,
        ).send(c);
    }
};


