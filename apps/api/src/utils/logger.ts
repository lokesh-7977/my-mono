import pino from "pino";

const redactPaths = [
    "password",
    "newPassword",
    "currentPassword",
    "accessToken",
    "refreshToken",
    "token",
    "otp",
    "req.headers.authorization",
    "req.headers.cookie",
];

const isProduction =
    process.env.NODE_ENV === "production" ||
    process.env.VERCEL_ENV === "production" ||
    !!process.env.VERCEL;

const logger = pino({
    level: isProduction ? "warn" : process.env.LOG_LEVEL || "info",
    redact: {
        paths: redactPaths,
        censor: "[REDACTED]",
    },
    ...(isProduction && {
        formatters: {
            level: (label) => ({ level: label }),
        },
    }),
});

export { logger };