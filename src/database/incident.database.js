import Incident from "../models/incident.model.js";

export const createIncidentDB = async (data) => {
  return await Incident.create(data);
};

export const findAllIncidentsDB = async () => {
  return await Incident.find()
    .populate("reportedBy", "name email")
    .sort({ createdAt: -1 });
};

export const findIncidentByIdDB = async (id) => {
  return await Incident.findById(id);
};

export const findIncidentByIdPopulatedDB = async (id) => {
  return await Incident.findById(id).populate("reportedBy", "name email");
};

export const findNearbyIncidentsDB = async (lat, lng, range = 0.1) => {
  return await Incident.find({
    latitude: { $gte: lat - range, $lte: lat + range },
    longitude: { $gte: lng - range, $lte: lng + range },
  }).populate("reportedBy", "name email");
};

export const findIncidentsByRouteDB = async (routeId) => {
  return await Incident.find({ route: routeId })
    .populate("reportedBy", "name email")
    .sort({ createdAt: -1 });
};

export const deleteIncidentByIdDB = async (id) => {
  return await Incident.findByIdAndDelete(id);
};

export const countActiveIncidentsByRouteDB = async (routeId) => {
  return await Incident.countDocuments({
    route: routeId,
    status: "active",
  });
};

export const saveIncidentDB = async (incident) => {
  return await incident.save();
};

export const findIncidentWithCommentsDB = async (id) => {
  return await Incident.findById(id).populate("comments.user", "name email");
};
