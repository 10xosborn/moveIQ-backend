import express from "express";
import {
  saveRoute,
  getAllRoutes,
  getSingleRoute,
  deleteRoute,
  searchRoutes,
  getRouteDetails,
  getRouteHistory,
  getRouteIncidents,
} from "../controllers/route.controller.js";

import protect from "../middlewares/auth.middleware.js";
const router = express.Router();

// Create and get routes
router.post("/", protect, saveRoute);
router.get("/", getAllRoutes);

// Special routes must come before :id
router.get("/search", searchRoutes);
router.get("/history", getRouteHistory);

// Routes that depend on id
router.get("/:id/details", getRouteDetails);
router.get("/:id/incidents", getRouteIncidents);

// Generic id routes must be last
router.get("/:id", getSingleRoute);
router.delete("/:id", protect, deleteRoute);

export default router;