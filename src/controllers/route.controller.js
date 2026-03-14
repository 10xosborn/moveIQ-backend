import mongoose from "mongoose";
import {
  saveRouteService,
  getAllRoutesService,
  getSingleRouteService,
  deleteRouteService,
} from "../services/route.service.js";

export const saveRoute = async (req, res) => {
  try {
    const { name, startLocation, endLocation, distance, estimatedDuration } = req.body;

    if (!name || !startLocation || !endLocation) {
      return res.status(400).json({
        success: false,
        message: "name, startLocation, and endLocation are required",
      });
    }

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

export const getSingleRoute = async (req, res) => {
  try {
    const { id } = req.params;

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

export const deleteRoute = async (req, res) => {
  try {
    const { id } = req.params;

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