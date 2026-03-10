import express from "express";
import {
  register,
  login,
  getMe,
  updateProfile,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";

import protect from "../middleware/auth.middleware.js";

const router = express.Router();

// register new user
router.post("/register", register);

// login user
router.post("/login", login);

// get current logged-in user
router.get("/me", protect, getMe);

// update user profile
router.put("/profile", protect, updateProfile);

// forgot password
router.post("/forgot-password", forgotPassword);

// reset password
router.post("/reset-password/:token", resetPassword);

export default router;