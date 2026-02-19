import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { env } from "./config/env.js";
import { generalLimiter } from "./middleware/rateLimiter.js";
import { errorHandler } from "./middleware/errorHandler.js";
import authRoutes from "./routes/auth.routes.js";
import leadRoutes from "./routes/lead.routes.js";

const app = express();

// ─── Global Middleware ──────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());
app.use(generalLimiter);

// ─── Health Check ───────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({ success: true, message: "Lead Management API is running", timestamp: new Date().toISOString() });
});

// ─── Routes ─────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/leads", leadRoutes);

// ─── 404 Handler ────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, error: "Route not found" });
});

// ─── Global Error Handler ───────────────────────────────────
app.use(errorHandler);

// ─── Start Server ───────────────────────────────────────────
app.listen(env.PORT, () => {
  console.log(`🚀 Server running on http://localhost:${env.PORT}`);
  console.log(`📋 Environment: ${env.NODE_ENV}`);
});

export default app;
