import Incident from "../models/incident.model.js";
import Route from "../models/route.model.js";

export const getActivitiesFeed = async (req, res) => {
  try {
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

    res.status(200).json({
      success: true,
      count: activities.length,
      data: {
        activities,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};