import express from "express";
import {
  register,
  login,
  getCurrentUser,
  updateProfile,
  logout,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";
import protect from "../middlewares/auth.middleware.js";

const router = express.Router();

// register new user
router.post("/register", register);

// login user
router.post("/login", login);

// get current logged-in user
router.get("/current-user", protect, getCurrentUser);

// update user profile
router.put("/profile", protect, updateProfile);

// logout user
router.post("/logout", protect, logout);

// forgot password
router.post("/forgot-password", forgotPassword);

// reset password
router.post("/reset-password/:token", resetPassword);

export default router;