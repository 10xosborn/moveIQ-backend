import express from "express";
import { getReportsFeed } from "../controllers/report.controller.js";

const router = express.Router();

router.get("/feed", getReportsFeed);

export default router;