const express = require("express");
const router = express.Router();

const incidentController = require("../controllers/incident.controller");
const protect = require("../middleware/auth.middleware");

// create report
router.post("/", protect, incidentController.createIncident);

// get reports
router.get("/", incidentController.getIncidents);

module.exports = router;