import Incident from "../models/incident.model.js";

export const createIncident = async (req, res) => {
  res.status(501).json({
    success: false,
    message: "Create incident not implemented yet",
  });
};

export const getIncidents = async (req, res) => {
  res.status(501).json({
    success: false,
    message: "Get incidents not implemented yet",
  });
};

export const getIncidentById = async (req, res) => {
  res.status(501).json({
    success: false,
    message: "Get incident by id not implemented yet",
  });
};

export const updateIncident = async (req, res) => {
  res.status(501).json({
    success: false,
    message: "Update incident not implemented yet",
  });
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

    return res.status(200).json({
      success: true,
      message: "Incident deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete incident",
      error: error.message,
    });
  }
};