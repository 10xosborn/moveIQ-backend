import express from "express";
import {
  saveRoute,
  getAllRoutes,
  getSingleRoute,
  deleteRoute,
} from "../controllers/route.controller.js";
import protect from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protect, saveRoute);
router.get("/", getAllRoutes);
router.get("/:id", getSingleRoute);
router.delete("/:id", protect, deleteRoute);

export default router;