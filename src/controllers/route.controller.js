import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { successResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import {
  saveRouteService,
  getAllRoutesService,
  getSingleRouteService,
  deleteRouteService,
  searchRoutesService,
  getRouteDetailsService,
  getRouteHistoryService,
  getRouteIncidentsService,
} from "../services/route.service.js";

// POST /api/routes
export const saveRoute = asyncHandler(async (req, res) => {
  const { name, startLocation, endLocation, distance, estimatedDuration } = req.body;

  if (!name || !startLocation || !endLocation) {
    throw new ApiError("name, startLocation, and endLocation are required", 400);
  }

  const route = await saveRouteService({
    name: name.trim(),
    startLocation: startLocation.trim(),
    endLocation: endLocation.trim(),
    distance,
    estimatedDuration,
    createdBy: req.user.id,
  });

  return successResponse(res, { route }, "Route saved successfully", 201);
});

// GET /api/routes
export const getAllRoutes = asyncHandler(async (req, res) => {
  const routes = await getAllRoutesService();
  return successResponse(res, { routes, count: routes.length });
});

// GET /api/routes/:id
export const getSingleRoute = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError("Invalid route ID", 400);
  }

  const route = await getSingleRouteService(id);

  if (!route) {
    throw new ApiError("Route not found", 404);
  }

  return successResponse(res, { route });
});

// DELETE /api/routes/:id
export const deleteRoute = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError("Invalid route ID", 400);
  }

  const deletedRoute = await deleteRouteService(id);

  if (!deletedRoute) {
    throw new ApiError("Route not found", 404);
  }

  return successResponse(res, { route: deletedRoute }, "Route deleted successfully");
});

// GET /api/routes/search?q=lekki
export const searchRoutes = asyncHandler(async (req, res) => {
  const { q } = req.query;

  if (!q || q.trim() === "") {
    throw new ApiError("Search query is required", 400);
  }

  const routes = await searchRoutesService(q);
  return successResponse(res, { routes, count: routes.length });
});

// GET /api/routes/:id/details
export const getRouteDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError("Invalid route ID", 400);
  }

  const route = await getRouteDetailsService(id);
  return successResponse(res, { route });
});

// GET /api/routes/history
export const getRouteHistory = asyncHandler(async (req, res) => {
  const routes = await getRouteHistoryService();
  return successResponse(res, { routes, count: routes.length });
});

// GET /api/routes/:id/incidents
export const getRouteIncidents = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError("Invalid route ID", 400);
  }

  const incidents = await getRouteIncidentsService(id);
  return successResponse(res, { incidents, count: incidents.length });
});