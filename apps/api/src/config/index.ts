import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
    ALG: z.string().min(1, "ALG is required"),

    JWT_ACCESS_SECRET: z
        .string()
        .min(32, "JWT_ACCESS_SECRET must be at least 32 characters"),

    JWT_REFRESH_SECRET: z
        .string()
        .min(32, "JWT_REFRESH_SECRET must be at least 32 characters"),

    ACCESS_TOKEN_EXPIRY: z.string().default("15m"),

    REFRESH_TOKEN_EXPIRY: z.string().default("7d"),

    GOOGLE_CLIENT_ID: z
        .string()
        .min(1, "GOOGLE_CLIENT_ID is required"),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
    console.error("Invalid environment variables:");
    console.error(z.treeifyError(parsedEnv.error));
    process.exit(1);
}

const config = parsedEnv.data;

export type Config = z.infer<typeof envSchema>;

export default config;