import { Hono } from "hono";
import { cors } from "hono/cors";
import { secureHeaders } from "hono/secure-headers";
import { requestId } from "hono/request-id";
import type { CloudflareBindings } from "./types";
import consultRoutes from "./routes/consult";

interface HealthStatus {
  status: "healthy" | "unhealthy";
  timestamp: string;
  uptime: number;
  requestId: string;
}

type Env = {
  ENVIRONMENT: "development" | "staging" | "production";
  ENABLE_DETAILED_LOGGING: boolean;
  ENABLE_PERFORMANCE_MONITORING: boolean;
};

const app = new Hono<{ Bindings: CloudflareBindings }>();
const startTime = Date.now();

/* ------------------------- ENV NORMALIZATION ------------------------- */

const parseEnv = (env: CloudflareBindings): Env => ({
  ENVIRONMENT: (env.ENVIRONMENT as Env["ENVIRONMENT"]) ?? "production",
  ENABLE_DETAILED_LOGGING: env.ENABLE_DETAILED_LOGGING === "true",
  ENABLE_PERFORMANCE_MONITORING: env.ENABLE_PERFORMANCE_MONITORING === "true",
});

/* ------------------------- REQUEST ID ------------------------- */

app.use("*", requestId());

/* ------------------------- SECURITY HEADERS ------------------------- */

app.use("*", (c, next) => {
  const env = parseEnv(c.env);
  return secureHeaders({
    crossOriginResourcePolicy: "cross-origin",
    referrerPolicy: "no-referrer",
    xContentTypeOptions: "nosniff",
    xFrameOptions: "DENY",
    ...(env.ENVIRONMENT === "production"
      ? { strictTransportSecurity: "max-age=31536000; includeSubDomains" }
      : {}),
  })(c, next);
});

/* ------------------------- CORS ------------------------- */

const ALLOWED_ORIGINS = new Set([
  "http://localhost:3000",
  "http://localhost:3002",
  "https://AdnanTheCoder.com",
]);

app.use(
  "*",
  cors({
    origin: (origin) => {
      // Allow all Vercel preview deployments
      if (origin && (origin.includes('.vercel.app') || origin.includes('.pages.dev'))) {
        return origin;
      }
      return !origin || ALLOWED_ORIGINS.has(origin) ? origin ?? "*" : "";
    },
    allowHeaders: ["Content-Type", "Authorization", "X-Access-Token"],
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
    maxAge: 86400,
  })
);

/* ------------------------- CONDITIONAL LOGGING ------------------------- */

app.use("*", async (c, next) => {
  const env = parseEnv(c.env);

  if (env.ENVIRONMENT !== "development" || !env.ENABLE_DETAILED_LOGGING) {
    return next();
  }

  const id = c.get("requestId");
  const start = performance.now();

  console.log(`➡️ [${id}] ${c.req.method} ${c.req.url}`);

  await next();

  const duration = Math.round(performance.now() - start);
  console.log(`⬅️ [${id}] ${c.res.status} ${duration}ms`);
});

/* ------------------------- ERROR HANDLING ------------------------- */

app.onError((err, c) => {
  const requestId = c.get("requestId");
  const timestamp = new Date().toISOString();

  console.error(`[${timestamp}] [${requestId}]`, err);

  return c.json(
    {
      error: "Internal Server Error",
      requestId,
      timestamp,
    },
    500
  );
});

app.notFound((c) =>
  c.json(
    {
      error: "Not Found",
      requestId: c.get("requestId"),
      timestamp: new Date().toISOString(),
    },
    404
  )
);

app.get("/ready", (c) =>
  c.json(
    {
      ready: true,
      timestamp: new Date().toISOString(),
      requestId: c.get("requestId"),
    },
    200
  )
);

app.get("/live", (c) => c.json({ alive: true }));

/* ------------------------- METRICS (OPTIONAL) ------------------------- */

app.get("/metrics", (c) => {
  const env = parseEnv(c.env);

  if (!env.ENABLE_PERFORMANCE_MONITORING) {
    return c.text("Metrics disabled", 403);
  }

  return c.json({
    uptime: Date.now() - startTime,
    timestamp: new Date().toISOString(),
    environment: env.ENVIRONMENT,
    requestId: c.get("requestId"),
  });
});

/* ------------------------- SAMPLE API ------------------------- */

app.get("/message", (c) => {
  c.header("Cache-Control", "public, max-age=300");

  return c.json({
    message: "Hello from CF Server @MetaRepo By AdnanTheCoder!",
    timestamp: new Date().toISOString(),
    requestId: c.get("requestId"),
  });
});

/* ------------------------- ROUTES ------------------------- */

app.route("/consult", consultRoutes);


export default app;