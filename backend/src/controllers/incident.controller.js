const Incident = require("../models/incident.model");

// create new incident report
exports.createIncident = async (req, res) => {
  try {
    const { type, latitude, longitude } = req.body;

    // check required fields
    if (!type || !latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: "type, latitude and longitude are required",
      });
    }

    // create incident
    const incident = await Incident.create({
      type,
      latitude,
      longitude,
      reportedBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Incident reported successfully",
      data: incident,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// get all incidents
exports.getIncidents = async (req, res) => {
  try {
    const incidents = await Incident.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: incidents,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};