import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import 'dotenv/config'
import config from "../config/index.js"

const Accesssecret = new TextEncoder().encode(
    config.JWT_ACCESS_SECRET
);

const Refreshsecret = new TextEncoder().encode(
    config.JWT_REFRESH_SECRET
);

export interface TokenPayload extends JWTPayload {
    id: string;
    sessionId: string,
}

export const signAccessToken = async (
    payload: {
        id: string,
        sessionId: string

    }
) => {
    const jwt = await new SignJWT({ id: payload.id, sessionId: payload.sessionId })
        .setProtectedHeader({ alg: config.ALG })
        .setIssuedAt()
        .setExpirationTime(config.ACCESS_TOKEN_EXPIRY!)
        .sign(Accesssecret)

    return jwt;
}


export const signRefreshToken = async (
    payload: {
        id: string,
        sessionId: string
    }
) => {
    const jwt = await new SignJWT({ id: payload.id, sessionId: payload.sessionId })
        .setProtectedHeader({ alg: config.ALG })
        .setIssuedAt()
        .setExpirationTime(config.REFRESH_TOKEN_EXPIRY!)
        .sign(Refreshsecret)

    return jwt;
}


export const verifyAccessToken = async (
    token: string,
): Promise<TokenPayload> => {
    try {
        const { payload } = await jwtVerify(token, Accesssecret);
        console.log("payload of access : ", payload);

        return payload as TokenPayload;
    } catch (error) {

        throw new Error("Invalid access token");
    }
};


export const verifyRefreshToken = async (
    token: string,
): Promise<TokenPayload> => {
    try {
        const { payload } = await jwtVerify(token, Refreshsecret);
        return payload as TokenPayload;
    } catch (error) {

        throw new Error("Invalid refresh token");
    }
};

