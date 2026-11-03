import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import { cors } from "hono/cors";

import { authRoutes } from "./routes/auth.route.js";
import { onboardingRoutes } from "./routes/onboarding.route.js";
import { adminVendorRoutes } from "./routes/admin-vendor.route.js";
import { teamRoutes } from "./routes/team.route.js";
import { MasterTrekRoutes } from "./routes/master-trek.route.js";
import { LocationRoutes } from "./routes/location.route.js";
import config from "./config/index.js";

const app = new OpenAPIHono();

app.use(
    "*",
    cors({
        origin: config.WEB_ORIGIN,
        credentials: true,
    }),
);

app.openAPIRegistry.registerComponent(
    "securitySchemes",
    "bearerAuth",
    {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
    },
);


// OpenAPI documentation
app.doc("/openapi.json", {
    openapi: "3.0.0",

    info: {
        title: "My API",
        version: "1.0.0",
        description: "My Hono API",
    },
});

// Swagger UI
app.get(
    "/swagger",
    swaggerUI({
        url: "/openapi.json",
    }),
);

// Routes
app.route("/api/auth", authRoutes);
app.route("/api/onboarding", onboardingRoutes);
app.route("/api/admin", adminVendorRoutes);
app.route("/api/team", teamRoutes);
app.route("/api/treks", MasterTrekRoutes);
app.route("/api/locations", LocationRoutes);


// Basic route
app.get("/", (c) => {
    return c.text("API is running");
});

export { app };

