import Incident from "../models/incident.model.js";
import Route from "../models/route.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { successResponse } from "../utils/apiResponse.js";

// TODO: Move DB queries to service/database layers when this module grows
export const getActivitiesFeed = asyncHandler(async (req, res) => {
  const incidents = await Incident.find()
    .populate("reportedBy", "name email")
    .sort({ createdAt: -1 })
    .limit(10);

  const routes = await Route.find()
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 })
    .limit(10);

  const incidentActivities = incidents.map((incident) => ({
    type: "incident",
    message: `${incident.reportedBy?.name || "A user"} reported a ${incident.type}`,
    data: incident,
    createdAt: incident.createdAt,
  }));

  const routeActivities = routes.map((route) => ({
    type: "route",
    message: `${route.createdBy?.name || "A user"} saved route ${route.name}`,
    data: route,
    createdAt: route.createdAt,
  }));

  const activities = [...incidentActivities, ...routeActivities].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return successResponse(res, { activities, count: activities.length });
});