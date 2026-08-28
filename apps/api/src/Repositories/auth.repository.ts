import { prisma } from "../utils/prisma.js";
import type { CreateUserData, CreateSessionData } from "../types/auth.types.js";

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