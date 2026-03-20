import { asyncHandler } from "../utils/asyncHandler.js";
import { successResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import {
  createIncidentService,
  getAllIncidentsService,
  getIncidentByIdService,
  getNearbyIncidentsService,
  getIncidentsByRouteService,
  updateIncidentService,
  deleteIncidentService,
  upvoteIncidentService,
  downvoteIncidentService,
  addCommentService,
  getCommentsService,
  deleteCommentService,
  markStillThereService,
  markClearedService,
} from "../services/incident.service.js";

// POST /api/incidents
export const createIncident = asyncHandler(async (req, res) => {
  const { type, latitude, longitude, route } = req.body;
  const incident = await createIncidentService({
    type,
    latitude,
    longitude,
    route,
    reportedBy: req.user.id,
  });
  return successResponse(res, { incident }, "Incident reported successfully", 201);
});

// GET /api/incidents
export const getIncidents = asyncHandler(async (req, res) => {
  const incidents = await getAllIncidentsService();
  return successResponse(res, { incidents, count: incidents.length });
});

// GET /api/incidents/:id
export const getIncidentById = asyncHandler(async (req, res) => {
  const incident = await getIncidentByIdService(req.params.id);
  return successResponse(res, { incident });
});

// GET /api/incidents/nearby?latitude=...&longitude=...
export const getNearbyIncidents = asyncHandler(async (req, res) => {
  const { latitude, longitude } = req.query;

  if (latitude === undefined || longitude === undefined) {
    throw new ApiError("Latitude and longitude are required", 400);
  }

  const incidents = await getNearbyIncidentsService(
    Number(latitude),
    Number(longitude)
  );
  return successResponse(res, { incidents, count: incidents.length });
});

// GET /api/incidents/route/:routeId
export const getIncidentsByRoute = asyncHandler(async (req, res) => {
  const incidents = await getIncidentsByRouteService(req.params.routeId);
  return successResponse(res, { incidents, count: incidents.length });
});

// PUT /api/incidents/:id
export const updateIncident = asyncHandler(async (req, res) => {
  const incident = await updateIncidentService(req.params.id, req.body);
  return successResponse(res, { incident }, "Incident updated successfully");
});

// DELETE /api/incidents/:id
export const deleteIncident = asyncHandler(async (req, res) => {
  await deleteIncidentService(req.params.id);
  return successResponse(res, null, "Incident deleted successfully");
});

// PATCH /api/incidents/:id/upvote
export const upvoteIncident = asyncHandler(async (req, res) => {
  const incident = await upvoteIncidentService(req.params.id, req.user.id);
  return successResponse(res, { incident });
});

// PATCH /api/incidents/:id/downvote
export const downvoteIncident = asyncHandler(async (req, res) => {
  const incident = await downvoteIncidentService(req.params.id, req.user.id);
  return successResponse(res, { incident });
});

// PATCH /api/incidents/:id/still-there
export const markStillThere = asyncHandler(async (req, res) => {
  const incident = await markStillThereService(req.params.id);
  return successResponse(res, { incident }, "Incident marked as still there");
});

// PATCH /api/incidents/:id/cleared
export const markCleared = asyncHandler(async (req, res) => {
  const incident = await markClearedService(req.params.id);
  return successResponse(res, { incident }, "Incident marked as cleared");
});

// POST /api/incidents/:id/comments
export const addComment = asyncHandler(async (req, res) => {
  const comments = await addCommentService(
    req.params.id,
    req.user.id,
    req.body.text
  );
  return successResponse(res, { comments }, "Comment added successfully", 201);
});

// GET /api/incidents/:id/comments
export const getComments = asyncHandler(async (req, res) => {
  const comments = await getCommentsService(req.params.id);
  return successResponse(res, { comments, count: comments.length });
});

// DELETE /api/incidents/:id/comments/:commentId
export const deleteComment = asyncHandler(async (req, res) => {
  await deleteCommentService(req.params.id, req.params.commentId, req.user.id);
  return successResponse(res, null, "Comment deleted successfully");
});