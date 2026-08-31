import { prisma } from "../utils/prisma.js";
import type { CreateUserData, CreateSessionData } from "../types/index.js";

export const create = async (data: CreateUserData) => {
    return prisma.user.create({
        data: {
            id: data.id,
            email: data.email,
            name: data.name,
            googleId: data.googleId,
            avatarUrl: data.avatarUrl,
        },
    });
};

export const createSession = async (data: CreateSessionData) => {
    return prisma.session.create({ data });
};

export const findByEmail = async (email: string) => {
    return prisma.user.findUnique({ where: { email } });
};

export const revokeSession = async (
    sessionId: string,
    userId: string,
) => {
    const session = await prisma.session.findFirst({
        where: {
            id: sessionId,
            userId,
        },
    });

    if (!session) {
        return null;
    }

    return prisma.session.update({
        where: {
            id: sessionId,
        },
        data: {
            isRevoked: true,
        },
    });
};


export const findSessionById = async (
    sessionId: string,
) => {
    return prisma.session.findUnique({
        where: {
            id: sessionId,
        },
    });
};

export const updateSession = async (
    sessionId: string,
    refreshTokenHash: string,
    expiresAt: Date,
) => {
    return prisma.session.update({
        where: {
            id: sessionId,
        },
        data: {
            refreshTokenHash,
            expiresAt,
        },
    });
};