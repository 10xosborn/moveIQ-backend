import mongoose from "mongoose";
import Route from "../models/route.model.js";
import Incident from "../models/incident.model.js";
import {
  saveRouteService,
  getAllRoutesService,
  getSingleRouteService,
  deleteRouteService,
} from "../services/route.service.js";

/*
Save route
This endpoint saves a new route
POST /api/routes
*/
export const saveRoute = async (req, res) => {
  try {
    const { name, startLocation, endLocation, distance, estimatedDuration } =
      req.body;

    // check required fields
    if (!name || !startLocation || !endLocation) {
      return res.status(400).json({
        success: false,
        message: "name, startLocation, and endLocation are required",
      });
    }

    // save route using service
    const route = await saveRouteService({
      name: name.trim(),
      startLocation: startLocation.trim(),
      endLocation: endLocation.trim(),
      distance,
      estimatedDuration,
      createdBy: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: "Route saved successfully",
      data: {
        route,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to save route",
    });
  }
};

/*
Get all saved routes
This endpoint gets all saved routes
GET /api/routes
*/
export const getAllRoutes = async (req, res) => {
  try {
    const routes = await getAllRoutesService();

    return res.status(200).json({
      success: true,
      count: routes.length,
      data: {
        routes,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch routes",
    });
  }
};

/*
Get single saved route
This endpoint gets one route by id
GET /api/routes/:id
*/
export const getSingleRoute = async (req, res) => {
  try {
    const { id } = req.params;

    // check if route id is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid route ID",
      });
    }

    const route = await getSingleRouteService(id);

    if (!route) {
      return res.status(404).json({
        success: false,
        message: "Route not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        route,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch route",
    });
  }
};

/*
Delete saved route
This endpoint deletes a route by id
DELETE /api/routes/:id
*/
export const deleteRoute = async (req, res) => {
  try {
    const { id } = req.params;

    // check if route id is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid route ID",
      });
    }

    const deletedRoute = await deleteRouteService(id);

    if (!deletedRoute) {
      return res.status(404).json({
        success: false,
        message: "Route not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Route deleted successfully",
      data: {
        route: deletedRoute,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete route",
    });
  }
};

/*
Search routes
This endpoint searches for routes by name, start location, or end location
GET /api/routes/search?q=lekki
*/
export const searchRoutes = async (req, res) => {
  try {
    const { q } = req.query;

    // check if search query is provided
    if (!q || q.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    // find matching routes
    const routes = await Route.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { startLocation: { $regex: q, $options: "i" } },
        { endLocation: { $regex: q, $options: "i" } },
      ],
    });

    return res.status(200).json({
      success: true,
      count: routes.length,
      data: {
        routes,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to search routes",
      error: error.message,
    });
  }
};

/*
Get route details
This endpoint gets full details of a route by id
GET /api/routes/:id/details
*/
export const getRouteDetails = async (req, res) => {
  try {
    const { id } = req.params;

    // check if route id is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid route ID",
      });
    }

    // find route and populate the user who created it
    const route = await Route.findById(id).populate(
      "createdBy",
      "name email phone"
    );

    if (!route) {
      return res.status(404).json({
        success: false,
        message: "Route not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        route,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get route details",
      error: error.message,
    });
  }
};

/*
Get route history
This endpoint gets all routes from newest to oldest
GET /api/routes/history
*/
export const getRouteHistory = async (req, res) => {
  try {
    const routes = await Route.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: routes.length,
      data: {
        routes,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get route history",
      error: error.message,
    });
  }
};

/*
Get route incidents
This endpoint gets all incidents related to a route
GET /api/routes/:id/incidents
*/
export const getRouteIncidents = async (req, res) => {
  try {
    const { id } = req.params;

    // check if route id is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid route ID",
      });
    }

    // check if the route exists
    const route = await Route.findById(id);

    if (!route) {
      return res.status(404).json({
        success: false,
        message: "Route not found",
      });
    }

    // get incidents linked to this route
    const incidents = await Incident.find({ route: id }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: incidents.length,
      data: {
        incidents,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get route incidents",
      error: error.message,
    });
  }
};