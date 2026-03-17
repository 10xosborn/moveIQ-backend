import Incident from "../models/incident.model.js";

export const getReportsFeed = async (req, res) => {
  try {
    const reports = await Incident.find()
      .populate("reportedBy", "name email")
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({
      success: true,
      count: reports.length,
      data: {
        reports,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};