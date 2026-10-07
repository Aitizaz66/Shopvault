import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { allowedOrigins } from "./config/origins.js";
import { csrfProtect, csrfToken } from "./middleware/csrf.js";
import errorHandler from "./middleware/errorHandler.js";
import { httpError } from "./utils/httpError.js";

export function createApp() {
  const app = express();
  const origins = allowedOrigins();
  app.disable("x-powered-by");
  app.set("trust proxy", Number(process.env.TRUST_PROXY_HOPS || 1));
  app.use(cors({
    origin(origin, callback) {
      if (!origin || origins.has(origin)) return callback(null, true);
      callback(httpError(403, "This website is not allowed to access the API"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "X-CSRF-Token", "Idempotency-Key"],
  }));
  app.use(cookieParser());
  app.use(express.json({ limit: "100kb" }));
  app.get("/api/auth/csrf", csrfToken);
  app.use("/api", csrfProtect);
  const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 100, skipSuccessfulRequests: true, standardHeaders: true, legacyHeaders: false,
    message: { success: false, message: "Too many requests. Please try again later." } });
  app.use("/api/auth", authLimiter, authRoutes);
  app.use("/api/products", productRoutes);
  app.use("/api/orders", orderRoutes);
  app.use("/api/reviews", reviewRoutes);
  app.use("/api/admin", adminRoutes);
  app.get("/api/health", (req, res) => {
    const healthy = mongoose.connection.readyState === 1;
    res.status(healthy ? 200 : 503).json({ success: healthy, message: healthy ? "Server is running" : "Database unavailable" });
  });
  app.get("/", (req, res) => res.json({ success: true, message: "ShopVault API is running", health: "/api/health" }));
  app.use((req, res) => res.status(404).json({ success: false, message: "Route not found" }));
  app.use(errorHandler);
  return app;
}
