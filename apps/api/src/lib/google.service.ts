import { OAuth2Client } from "google-auth-library";

import type { GoogleUserPayload } from "../types/auth.types.js";
import config from "../config/index.js"

const client = new OAuth2Client(config.GOOGLE_CLIENT_ID);

export const verifyGoogleToken = async (
    idToken: string,
): Promise<GoogleUserPayload> => {
    const ticket = await client.verifyIdToken({
        idToken,
        audience: config.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
        throw new Error("Invalid Google ID token");
    }
    console.log("payload data :", payload);

    return {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        emailVerified: payload.email_verified ?? false,
    };
};