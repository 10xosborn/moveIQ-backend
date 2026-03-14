import Route from "../models/route.model.js";

export const createRouteDB = async (routeData) => {
  return await Route.create(routeData);
};

export const getAllRoutesDB = async () => {
  return await Route.find().populate("createdBy", "name email");
};

export const getRouteByIdDB = async (id) => {
  return await Route.findById(id).populate("createdBy", "name email");
};

export const deleteRouteByIdDB = async (id) => {
  return await Route.findByIdAndDelete(id);
};