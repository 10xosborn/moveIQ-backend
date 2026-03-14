import express from "express";
import {
  createIncident,
  getIncidents,
  getIncidentById,
  updateIncident,
  deleteIncident,
} from "../controllers/incident.controller.js";

import protect from "../middlewares/auth.middleware.js";

const router = express.Router();

// create incident
router.post("/", protect, createIncident);

// get all incidents
router.get("/", protect, getIncidents);

// get single incident
router.get("/:id", protect, getIncidentById);

// update incident
router.put("/:id", protect, updateIncident);

// delete incident
router.delete("/:id", protect, deleteIncident);

export default router;