import Incident from "../models/incident.model.js";

export const createIncident = async (req, res) => {
  try {
    const { type, latitude, longitude, route } = req.body;

    if (!type || latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        success: false,
        message: "Type, latitude and longitude are required",
      });
    }

    const incident = await Incident.create({
      type,
      latitude,
      longitude,
      route,
      reportedBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Incident reported successfully",
      data: { incident },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getIncidents = async (req, res) => {
  try {
    const incidents = await Incident.find().populate("reportedBy", "name email");

    res.status(200).json({
      success: true,
      count: incidents.length,
      data: { incidents },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getIncidentById = async (req, res) => {
  try {
    const { id } = req.params;

    const incident = await Incident.findById(id).populate("reportedBy", "name email");

    if (!incident) {
      return res.status(404).json({
        success: false,
        message: "Incident not found",
      });
    }

    res.status(200).json({
      success: true,
      data: { incident },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getNearbyIncidents = async (req, res) => {
  try {
    const { latitude, longitude } = req.query;

    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude are required",
      });
    }

    const lat = Number(latitude);
    const lng = Number(longitude);

    const incidents = await Incident.find({
      latitude: { $gte: lat - 0.1, $lte: lat + 0.1 },
      longitude: { $gte: lng - 0.1, $lte: lng + 0.1 },
    }).populate("reportedBy", "name email");

    res.status(200).json({
      success: true,
      count: incidents.length,
      data: { incidents },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateIncident = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, latitude, longitude, route } = req.body;

    const incident = await Incident.findById(id);

    if (!incident) {
      return res.status(404).json({
        success: false,
        message: "Incident not found",
      });
    }

    if (type !== undefined) incident.type = type;
    if (latitude !== undefined) incident.latitude = latitude;
    if (longitude !== undefined) incident.longitude = longitude;
    if (route !== undefined) incident.route = route;

    await incident.save();

    res.status(200).json({
      success: true,
      message: "Incident updated successfully",
      data: { incident },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteIncident = async (req, res) => {
  try {
    const { id } = req.params;

    const incident = await Incident.findById(id);

    if (!incident) {
      return res.status(404).json({
        success: false,
        message: "Incident not found",
      });
    }

    await incident.deleteOne();

    res.status(200).json({
      success: true,
      message: "Incident deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete incident",
      error: error.message,
    });
  }
};

export const getIncidentsByRoute = async (req, res) => {
  try {
    const { routeId } = req.params;

    const incidents = await Incident.find({ route: routeId })
      .populate("reportedBy", "name email")
      .populate("route");

    res.status(200).json({
      success: true,
      count: incidents.length,
      data: { incidents },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};