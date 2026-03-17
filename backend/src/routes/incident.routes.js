import express from "express";
import {
  createIncident,
  getIncidents,
  getIncidentById,
  updateIncident,
  deleteIncident,
  getNearbyIncidents,
  getIncidentsByRoute,
} from "../controllers/incident.controller.js";

import protect from "../middlewares/auth.middleware.js";

const router = express.Router();

// create incident
router.post("/", protect, createIncident);

// get all incidents
router.get("/", protect, getIncidents);

// get nearby incidents
router.get("/nearby", protect, getNearbyIncidents);

// get incidents by route
router.get("/route/:routeId", protect, getIncidentsByRoute);

// upvote incident
router.patch("/:id/upvote", protect, upvoteIncident);

// downvote incident
router.patch("/:id/downvote", protect, downvoteIncident);


// get single incident
router.get("/:id", protect, getIncidentById);

// update incident
router.put("/:id", protect, updateIncident);

// delete incident
router.delete("/:id", protect, deleteIncident);

export default router;