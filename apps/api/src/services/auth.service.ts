import { logger } from "../utils/logger.js";
import type {
    GoogleLoginRequest,
    ClientInfo,
    AuthUserResponse,
    LogoutData,
    MessageResponse,
    RefreshResponse,
} from "../types/index.js";
import { verifyGoogleToken } from "../lib/google.service.js";
import * as AuthRepository from "../repositories/auth.repository.js";
import { uuidv7 } from "uuidv7";
import * as JwtService from "../lib/jwt.service.js";
import argon2 from "argon2";
import { CustomError } from "../utils/custom-error.js";




const getSessionExpiry = (): Date => {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    return expiresAt;
};


export const googleLogin = async (
    data: GoogleLoginRequest,
    clientInfo: ClientInfo = {},
): Promise<AuthUserResponse> => {
    const googleUser = await verifyGoogleToken(data.idToken);

    let user = await AuthRepository.findByEmail(googleUser.email);

    if (!user) {
        user = await AuthRepository.create({
            id: uuidv7(),
            email: googleUser.email,
            name: googleUser.name ?? "",
            googleId: googleUser.id,
            avatarUrl: googleUser.picture,
        });

        logger.info(
            { userId: user.id, email: user.email },
            "Google user created",
        );
    }

    if (user.status !== "ACTIVE" || user.isDeleted) {
        logger.warn(
            {
                userId: user.id,
                status: user.status,
            },
            "Google login blocked for disabled account",
        );

        throw new CustomError("Account is disabled", 403);
    }

    const sessionId = uuidv7();

    const accessToken = await JwtService.signAccessToken({
        id: user.id,
        sessionId,
        role: user.role,
    });

    const refreshToken = await JwtService.signRefreshToken({
        id: user.id,
        sessionId,
        role: user.role,
    });

    const refreshTokenHash = await argon2.hash(refreshToken);

    await AuthRepository.createSession({
        id: sessionId,
        userId: user.id,
        refreshTokenHash,
        expiresAt: getSessionExpiry(),
        ipAddress: clientInfo.ipAddress,
        userAgent: clientInfo.userAgent,
    });

    logger.info(
        {
            userId: user.id,
            sessionId,
            role: user.role,
        },
        "Google login session created",
    );

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        accessToken,
        refreshToken,
    };
};




export const logout = async (
    data: LogoutData,
): Promise<MessageResponse> => {
    const session = await AuthRepository.revokeSession(
        data.sessionId,
        data.userId,
    );

    if (!session) {
        logger.warn(
            {
                userId: data.userId,
                sessionId: data.sessionId,
            },
            "Logout failed: session not found",
        );

        throw new CustomError(
            "Session not found",
            404,
        );
    }

    logger.info(
        {
            userId: data.userId,
            sessionId: data.sessionId,
        },
        "User logged out successfully",
    );

    return {
        message: "Logged out successfully",
    };
};

export const refresh = async (
    refreshToken: string,
): Promise<RefreshResponse> => {
    let payload;

    try {
        payload = await JwtService.verifyRefreshToken(
            refreshToken,
        );
    } catch {
        logger.warn(
            "Refresh failed: invalid or expired refresh token",
        );

        throw new CustomError(
            "Invalid or expired refresh token",
            401,
        );
    }

    const {
        id: userId,
        sessionId,
        role,
    } = payload;

    const session =
        await AuthRepository.findSessionById(sessionId);

    if (!session) {
        logger.warn(
            { userId, sessionId },
            "Refresh failed: session not found",
        );

        throw new CustomError(
            "Session not found",
            401,
        );
    }

    if (session.userId !== userId) {
        logger.warn(
            { userId, sessionId },
            "Refresh failed: invalid session ownership",
        );

        throw new CustomError(
            "Invalid session",
            401,
        );
    }

    if (session.isRevoked) {
        logger.warn(
            { userId, sessionId },
            "Refresh failed: session revoked",
        );

        throw new CustomError(
            "Session has been revoked",
            401,
        );
    }

    if (session.expiresAt <= new Date()) {
        logger.warn(
            { userId, sessionId },
            "Refresh failed: session expired",
        );

        throw new CustomError(
            "Session has expired",
            401,
        );
    }

    const isValid = await argon2.verify(
        session.refreshTokenHash,
        refreshToken,
    );

    if (!isValid) {
        logger.warn(
            { userId, sessionId },
            "Refresh failed: token hash mismatch",
        );

        throw new CustomError(
            "Invalid refresh token",
            401,
        );
    }

    const newRefreshToken =
        await JwtService.signRefreshToken({
            id: userId,
            sessionId,
            role,
        });

    const newAccessToken =
        await JwtService.signAccessToken({
            id: userId,
            sessionId,
            role,
        });

    const newRefreshTokenHash =
        await argon2.hash(newRefreshToken);

    const newExpiresAt = new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000,
    );

    await AuthRepository.updateSession(
        sessionId,
        newRefreshTokenHash,
        newExpiresAt,
    );

    logger.info(
        { userId, sessionId },
        "Refresh token rotated successfully",
    );

    return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
    };
};


