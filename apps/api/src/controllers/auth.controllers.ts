import { type Context } from "hono";
import type {
    GoogleLoginRequest,
    ClientInfo
} from "../types/auth.types.ts";

import * as AuthService from "../services/auth.service.js"
import * as setRefresh from "../helper/jwt.helper.js"
import ApiResponse from "../utils/api-response.js";
import { CustomError } from "../utils/custom-error.js";
import { logger } from "../utils/logger.js";


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
