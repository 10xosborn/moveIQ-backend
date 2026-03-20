import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import authRoutes from "./routes/auth.routes.js";
import incidentRoutes from "./routes/incident.routes.js";
import routeRoutes from "./routes/route.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import activityRoutes from "./routes/activity.routes.js";
import reportRoutes from "./routes/report.routes.js";
import { authLimiter, generalLimiter } from "./middlewares/rateLimit.middleware.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

// middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// rate limiting
app.use("/api/auth", authLimiter);
app.use(generalLimiter);

// routes
app.use("/api/auth", authRoutes);
app.use("/api/incidents", incidentRoutes);
app.use("/api/routes", routeRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/reports", reportRoutes);

// Health check route
app.get("/health", (req, res) => {
  res.json({
    success: true,
    uptime: process.uptime(),
    status: "OK",
  });
});

// test route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "MoveIQ API is running",
  });
});

// error handler
app.use(errorHandler);

// 404 handler 
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

export default app;