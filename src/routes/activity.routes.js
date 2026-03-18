import express from "express";
import { getActivitiesFeed } from "../controllers/activity.controller.js";
import protect from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", protect, getActivitiesFeed);

export default router;