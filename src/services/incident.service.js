import { ApiError } from "../utils/apiError.js";
import {
  createIncidentDB,
  findAllIncidentsDB,
  findIncidentByIdDB,
  findIncidentByIdPopulatedDB,
  findNearbyIncidentsDB,
  findIncidentsByRouteDB,
  saveIncidentDB,
  findIncidentWithCommentsDB,
} from "../database/incident.database.js";

export const createIncidentService = async (data) => {
  return await createIncidentDB(data);
};

export const getAllIncidentsService = async () => {
  return await findAllIncidentsDB();
};

export const getIncidentByIdService = async (id) => {
  const incident = await findIncidentByIdPopulatedDB(id);
  if (!incident) throw new ApiError("Incident not found", 404);
  return incident;
};

export const getNearbyIncidentsService = async (lat, lng) => {
  return await findNearbyIncidentsDB(lat, lng);
};

export const getIncidentsByRouteService = async (routeId) => {
  return await findIncidentsByRouteDB(routeId);
};

export const updateIncidentService = async (id, data) => {
  const incident = await findIncidentByIdDB(id);
  if (!incident) throw new ApiError("Incident not found", 404);

  if (data.type !== undefined) incident.type = data.type;
  if (data.latitude !== undefined) incident.latitude = data.latitude;
  if (data.longitude !== undefined) incident.longitude = data.longitude;
  if (data.route !== undefined) incident.route = data.route;

  await saveIncidentDB(incident);
  return incident;
};

export const deleteIncidentService = async (id) => {
  const incident = await findIncidentByIdDB(id);
  if (!incident) throw new ApiError("Incident not found", 404);
  await incident.deleteOne();
};

export const upvoteIncidentService = async (incidentId, userId) => {
  const incident = await findIncidentByIdDB(incidentId);
  if (!incident) throw new ApiError("Incident not found", 404);

  // Remove from downvotes if present
  incident.downvotes = incident.downvotes.filter(
    (uid) => uid.toString() !== userId
  );

  // Toggle upvote
  const isUpvoted = incident.upvotes.some(
    (uid) => uid.toString() === userId
  );
  if (isUpvoted) {
    incident.upvotes = incident.upvotes.filter(
      (uid) => uid.toString() !== userId
    );
  } else {
    incident.upvotes.push(userId);
  }

  await saveIncidentDB(incident);
  return incident;
};

export const downvoteIncidentService = async (incidentId, userId) => {
  const incident = await findIncidentByIdDB(incidentId);
  if (!incident) throw new ApiError("Incident not found", 404);

  // FIX: Remove from upvotes if present (was missing before)
  incident.upvotes = incident.upvotes.filter(
    (uid) => uid.toString() !== userId
  );

  // Toggle downvote
  const isDownvoted = incident.downvotes.some(
    (uid) => uid.toString() === userId
  );
  if (isDownvoted) {
    incident.downvotes = incident.downvotes.filter(
      (uid) => uid.toString() !== userId
    );
  } else {
    incident.downvotes.push(userId);
  }

  await saveIncidentDB(incident);
  return incident;
};

export const addCommentService = async (incidentId, userId, text) => {
  const incident = await findIncidentByIdDB(incidentId);
  if (!incident) throw new ApiError("Incident not found", 404);

  incident.comments.push({ user: userId, text });
  await saveIncidentDB(incident);
  return incident.comments;
};

export const getCommentsService = async (incidentId) => {
  const incident = await findIncidentWithCommentsDB(incidentId);
  if (!incident) throw new ApiError("Incident not found", 404);
  return incident.comments;
};

export const deleteCommentService = async (incidentId, commentId, userId) => {
  const incident = await findIncidentByIdDB(incidentId);
  if (!incident) throw new ApiError("Incident not found", 404);

  const comment = incident.comments.id(commentId);
  if (!comment) throw new ApiError("Comment not found", 404);

  if (comment.user.toString() !== userId) {
    throw new ApiError("Not authorized to delete this comment", 403);
  }

  await comment.deleteOne();
  await saveIncidentDB(incident);
};

export const markStillThereService = async (incidentId) => {
  const incident = await findIncidentByIdDB(incidentId);
  if (!incident) throw new ApiError("Incident not found", 404);

  incident.status = "active";
  incident.expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000);
  await saveIncidentDB(incident);
  return incident;
};

export const markClearedService = async (incidentId) => {
  const incident = await findIncidentByIdDB(incidentId);
  if (!incident) throw new ApiError("Incident not found", 404);

  incident.status = "cleared";
  await saveIncidentDB(incident);
  return incident;
};