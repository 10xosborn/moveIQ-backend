import {
  createRouteDB,
  getAllRoutesDB,
  getRouteByIdDB,
  deleteRouteByIdDB,
} from "../database/route.database.js";

export const saveRouteService = async (routeData) => {
  return await createRouteDB(routeData);
};

export const getAllRoutesService = async () => {
  return await getAllRoutesDB();
};

export const getSingleRouteService = async (id) => {
  return await getRouteByIdDB(id);
};

export const deleteRouteService = async (id) => {
  return await deleteRouteByIdDB(id);
};