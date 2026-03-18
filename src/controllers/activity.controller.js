import Activity from "../models/activity.model.js";

export const getActivitiesFeed = async (req, res) => {
  try {
    const activities = await Activity.find()
      .populate("user", "name email")
      .populate("incident", "type status latitude longitude createdAt")
      .populate("route", "name startLocation endLocation")
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    return res.status(200).json({
      success: true,
      count: activities.length,
      data: { activities },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};