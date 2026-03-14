import express from "express";
import {
  getNotifications,
  markNotificationAsRead,
} from "../controllers/notification.controller.js";
import protect from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", protect, getNotifications);
router.patch("/:id/read", protect, markNotificationAsRead);

export default router;