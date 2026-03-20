import express from "express";
import { getActivitiesFeed } from "../controllers/activity.controller.js";

const router = express.Router();

router.get("/", getActivitiesFeed);

export default router;