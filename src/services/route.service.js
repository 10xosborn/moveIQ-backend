import {
  createRouteDB,
  getAllRoutesDB,
  getRouteByIdDB,
  getRouteByIdPopulatedDB,
  deleteRouteByIdDB,
  getRouteBySlugDB,
  updateRouteStatusDB,
  searchRoutesDB,
} from "../database/route.database.js";
import { countActiveIncidentsByRouteDB, findIncidentsByRouteDB } from "../database/incident.database.js";
import { ROUTE_STATUS } from "../utils/constants.js";
import { ApiError } from "../utils/apiError.js";

// Save route
export const saveRouteService = async (routeData) => {
  return await createRouteDB(routeData);
};

// Get all routes
export const getAllRoutesService = async () => {
  return await getAllRoutesDB();
};

// Get single route
export const getSingleRouteService = async (id) => {
  return await getRouteByIdDB(id);
};

// Delete route
export const deleteRouteService = async (id) => {
  return await deleteRouteByIdDB(id);
};

// Search routes
export const searchRoutesService = async (query) => {
  return await searchRoutesDB(query);
};

// Get route details (with populated createdBy)
export const getRouteDetailsService = async (id) => {
  const route = await getRouteByIdPopulatedDB(id);
  if (!route) throw new ApiError("Route not found", 404);
  return route;
};

// Get route history (all routes sorted by newest)
export const getRouteHistoryService = async () => {
  return await getAllRoutesDB();
};

// Get route incidents
export const getRouteIncidentsService = async (routeId) => {
  const route = await getRouteByIdDB(routeId);
  if (!route) throw new ApiError("Route not found", 404);
  return await findIncidentsByRouteDB(routeId);
};

// Validate routeSlug
export const validateRouteSlugService = async (slug) => {
  const route = await getRouteBySlugDB(slug);
  if (!route) throw new ApiError("Invalid route: route does not exist", 404);
  return route;
};

// Update route status based on active incidents
export const updateRouteStatusService = async (routeId) => {
  const route = await getRouteByIdDB(routeId);
  if (!route) throw new ApiError("Route not found", 404);

  const activeIncidents = await countActiveIncidentsByRouteDB(routeId);

  let status = ROUTE_STATUS.GREEN;
  if (activeIncidents >= 4) status = ROUTE_STATUS.RED;
  else if (activeIncidents >= 1) status = ROUTE_STATUS.YELLOW;

  return await updateRouteStatusDB(route.slug, status);
};