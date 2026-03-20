import Notification from "../models/notification.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { successResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";

// TODO: Move DB queries to service/database layers when this module grows

// GET /api/notifications
export const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user.id }).sort({
    createdAt: -1,
  });

  return successResponse(res, {
    notifications,
    count: notifications.length,
  });
});

// PATCH /api/notifications/:id/read
export const markNotificationAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    throw new ApiError("Notification not found", 404);
  }

  notification.isRead = true;
  await notification.save();

  return successResponse(res, { notification }, "Notification marked as read");
});