import Incident from "../models/incident.model.js";
import Activity from "../models/activity.model.js";

export const createIncident = async (req, res) => {
  try {
    const { type, latitude, longitude, route } = req.body;

    if (!type || latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        success: false,
        message: "Type, latitude and longitude are required",
      });
    }

    const incident = await Incident.create({
      type,
      latitude,
      longitude,
      route,
      reportedBy: req.user.id,
    });

    await Activity.create({
      user: req.user.id,
      incident: incident._id,
      route: incident.route,
      action: "reported",
      message: `${req.user.name || "A user"} reported a ${incident.type}`,
      type: "incident",
    });

    return res.status(201).json({
      success: true,
      message: "Incident reported successfully",
      data: { incident },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getIncidents = async (req, res) => {
  try {
    const incidents = await Incident.find()
      .populate("reportedBy", "name email")
      .populate("route", "name startLocation endLocation")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: incidents.length,
      data: { incidents },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getIncidentById = async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id)
      .populate("reportedBy", "name email")
      .populate("route", "name startLocation endLocation")
      .populate("comments.user", "name email");

    if (!incident) {
      return res.status(404).json({
        success: false,
        message: "Incident not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: { incident },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateIncident = async (req, res) => {
  try {
    const incident = await Incident.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!incident) {
      return res.status(404).json({
        success: false,
        message: "Incident not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Incident updated successfully",
      data: { incident },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteIncident = async (req, res) => {
  try {
    const incident = await Incident.findByIdAndDelete(req.params.id);

    if (!incident) {
      return res.status(404).json({
        success: false,
        message: "Incident not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Incident deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getNearbyIncidents = async (req, res) => {
  try {
    const { latitude, longitude } = req.query;

    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude are required",
      });
    }

    const lat = Number(latitude);
    const lng = Number(longitude);

    const incidents = await Incident.find({
      latitude: { $gte: lat - 0.1, $lte: lat + 0.1 },
      longitude: { $gte: lng - 0.1, $lte: lng + 0.1 },
    }).populate("reportedBy", "name email");

    return res.status(200).json({
      success: true,
      count: incidents.length,
      data: { incidents },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getIncidentsByRoute = async (req, res) => {
  try {
    const incidents = await Incident.find({ route: req.params.routeId })
      .populate("reportedBy", "name email")
      .populate("route", "name startLocation endLocation")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: incidents.length,
      data: { incidents },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Comment text is required",
      });
    }

    const incident = await Incident.findById(id);
    if (!incident) {
      return res.status(404).json({
        success: false,
        message: "Incident not found",
      });
    }

    incident.comments.push({
      user: req.user.id,
      text: text.trim(),
    });

    await incident.save();

    await Activity.create({
      user: req.user.id,
      incident: incident._id,
      route: incident.route,
      action: "commented",
      message: `${req.user.name || "A user"} commented on a ${incident.type} incident`,
      type: "incident",
    });

    return res.status(201).json({
      success: true,
      message: "Comment added successfully",
      data: { comments: incident.comments },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getComments = async (req, res) => {
  try {
    const { id } = req.params;

    const incident = await Incident.findById(id).populate(
      "comments.user",
      "name email"
    );

    if (!incident) {
      return res.status(404).json({
        success: false,
        message: "Incident not found",
      });
    }

    return res.status(200).json({
      success: true,
      count: incident.comments.length,
      data: { comments: incident.comments },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { id, commentId } = req.params;

    const incident = await Incident.findById(id);
    if (!incident) {
      return res.status(404).json({
        success: false,
        message: "Incident not found",
      });
    }

    const comment = incident.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    if (comment.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "User not authorized to delete this comment",
      });
    }

    comment.deleteOne();
    await incident.save();

    return res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const upvoteIncident = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const incident = await Incident.findById(id);
    if (!incident) {
      return res.status(404).json({
        success: false,
        message: "Incident not found",
      });
    }

    incident.downvotes = incident.downvotes.filter(
      (uid) => uid.toString() !== userId.toString()
    );

    const isUpvoted = incident.upvotes.some(
      (uid) => uid.toString() === userId.toString()
    );

    if (isUpvoted) {
      incident.upvotes = incident.upvotes.filter(
        (uid) => uid.toString() !== userId.toString()
      );
    } else {
      incident.upvotes.push(userId);
    }

    await incident.save();

    return res.status(200).json({
      success: true,
      data: { incident },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const downvoteIncident = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const incident = await Incident.findById(id);
    if (!incident) {
      return res.status(404).json({
        success: false,
        message: "Incident not found",
      });
    }

    incident.upvotes = incident.upvotes.filter(
      (uid) => uid.toString() !== userId.toString()
    );

    const isDownvoted = incident.downvotes.some(
      (uid) => uid.toString() === userId.toString()
    );

    if (isDownvoted) {
      incident.downvotes = incident.downvotes.filter(
        (uid) => uid.toString() !== userId.toString()
      );
    } else {
      incident.downvotes.push(userId);
    }

    await incident.save();

    return res.status(200).json({
      success: true,
      data: { incident },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const markIncidentAsStillThere = async (req, res) => {
  try {
    const { id } = req.params;

    const incident = await Incident.findById(id);

    if (!incident) {
      return res.status(404).json({
        success: false,
        message: "Incident not found",
      });
    }

    incident.status = "stillThere";
    await incident.save();

    await Activity.create({
      user: req.user.id,
      incident: incident._id,
      route: incident.route,
      action: "stillThere",
      message: `${req.user.name || "A user"} marked a ${incident.type} incident as still there`,
      type: "incident",
    });

    return res.status(200).json({
      success: true,
      message: "Incident marked as still there",
      data: { incident },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const markIncidentAsCleared = async (req, res) => {
  try {
    const { id } = req.params;

    const incident = await Incident.findById(id);

    if (!incident) {
      return res.status(404).json({
        success: false,
        message: "Incident not found",
      });
    }

    incident.status = "cleared";
    await incident.save();

    await Activity.create({
      user: req.user.id,
      incident: incident._id,
      route: incident.route,
      action: "cleared",
      message: `${req.user.name || "A user"} marked a ${incident.type} incident as cleared`,
      type: "incident",
    });

    return res.status(200).json({
      success: true,
      message: "Incident marked as cleared",
      data: { incident },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};