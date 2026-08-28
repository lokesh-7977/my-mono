import { logger } from "../utils/logger.js";
import type {
    GoogleLoginRequest,
    ClientInfo,
    AuthUserResponse
} from "../types/auth.types.ts";
import { verifyGoogleToken } from "../lib/google.service.js";
import * as AuthRepository from "../Repositories/auth.repository.js";
import { uuidv7 } from "uuidv7";
import { signAccessToken, signRefreshToken } from "../lib/jwt.service.js";
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

    const accessToken = await signAccessToken({
        id: user.id,
        sessionId,
        role: user.role,
    });

    const refreshToken = await signRefreshToken({
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