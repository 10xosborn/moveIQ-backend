import express from "express";
import {
  createIncident,
  getIncidents,
  getIncidentById,
  updateIncident,
  deleteIncident,
  getNearbyIncidents,
  getIncidentsByRoute,
  addComment,
  getComments,
  deleteComment,
  upvoteIncident,
  downvoteIncident,
  markIncidentAsStillThere,
  markIncidentAsCleared,
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

// add comment
router.post("/:id/comments", protect, addComment);

// get comments
router.get("/:id/comments", protect, getComments);

// delete comment
router.delete("/:id/comments/:commentId", protect, deleteComment);

// votes
router.patch("/:id/upvote", protect, upvoteIncident);
router.patch("/:id/downvote", protect, downvoteIncident);

// incident status
router.patch("/:id/still-there", protect, markIncidentAsStillThere);
router.patch("/:id/cleared", protect, markIncidentAsCleared);

// get single incident
router.get("/:id", protect, getIncidentById);

// update incident
router.put("/:id", protect, updateIncident);

// delete incident
router.delete("/:id", protect, deleteIncident);

export default router;