import Incident from "../models/incident.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { successResponse } from "../utils/apiResponse.js";

// TODO: Move DB queries to service/database layers when this module grows
export const getReportsFeed = asyncHandler(async (req, res) => {
  const reports = await Incident.find()
    .populate("reportedBy", "name email")
    .sort({ createdAt: -1 })
    .limit(20);

  return successResponse(res, { reports, count: reports.length });
});