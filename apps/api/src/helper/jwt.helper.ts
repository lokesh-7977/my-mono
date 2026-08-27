import type { Context } from "hono";
import { deleteCookie, setCookie } from "hono/cookie";
import config from "../config/index.js";

const parseDurationToSeconds = (duration: string): number => {
    const match = duration.match(/^(\d+)([smhd])$/);

    if (!match) {
        throw new Error(`Invalid duration format: ${duration}`);
    }

    const value = Number(match[1]);
    const unit = match[2];

    switch (unit) {
        case "s":
            return value;
        case "m":
            return value * 60;
        case "h":
            return value * 60 * 60;
        case "d":
            return value * 24 * 60 * 60;
    }

    return 0;
};

const REFRESH_TOKEN_MAX_AGE = parseDurationToSeconds(
    config.REFRESH_TOKEN_EXPIRY,
);

export const setRefreshTokenCookie = (
    c: Context,
    refreshToken: string,
): void => {
    setCookie(c, "refreshToken", refreshToken, {
        httpOnly: true,
        secure: config.NODE_ENV === "production",
        sameSite: "Lax",
        path: "/api/auth/refresh",
        maxAge: REFRESH_TOKEN_MAX_AGE,
    });
};

export const clearRefreshTokenCookie = (c: Context): void => {
    deleteCookie(c, "refreshToken", {
        path: "/api/auth/refresh",
    });
};