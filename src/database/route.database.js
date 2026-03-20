import Route from "../models/route.model.js";

// Create route
export const createRouteDB = async (routeData) => {
  return await Route.create(routeData);
};

// Get all routes
export const getAllRoutesDB = async () => {
  return await Route.find().sort({ createdAt: -1 });
};

// Get route by ID
export const getRouteByIdDB = async (id) => {
  return await Route.findById(id);
};

// Get route by ID with populated createdBy
export const getRouteByIdPopulatedDB = async (id) => {
  return await Route.findById(id).populate("createdBy", "name email phone");
};

// Get route by slug
export const getRouteBySlugDB = async (slug) => {
  return await Route.findOne({ slug });
};

// Delete route
export const deleteRouteByIdDB = async (id) => {
  return await Route.findByIdAndDelete(id);
};

// Update route status
export const updateRouteStatusDB = async (slug, status) => {
  return await Route.findOneAndUpdate(
    { slug },
    { status, lastUpdated: new Date() },
    { new: true }
  );
};

// Search routes by name, startLocation, or endLocation
export const searchRoutesDB = async (query) => {
  return await Route.find({
    $or: [
      { name: { $regex: query, $options: "i" } },
      { startLocation: { $regex: query, $options: "i" } },
      { endLocation: { $regex: query, $options: "i" } },
    ],
  });
};