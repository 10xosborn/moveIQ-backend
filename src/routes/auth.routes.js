import express from "express";
import {
  register,
  login,
  googleLogin,
  refreshToken,
  verifyEmail,
  getCurrentUser,
  updateProfile,
  logout,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";
import protect from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validation.middleware.js";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateProfileSchema,
} from "../validators/auth.validator.js";

const router = express.Router();

// register new user
router.post("/register", validate(registerSchema), register);

// login user
router.post("/login", validate(loginSchema), login);

// google login
router.post("/google", googleLogin);

// refresh access token
router.post("/refresh-token", refreshToken);

// verify email
router.get("/verify-email/:token", verifyEmail);

// get current logged-in user
router.get("/current-user", protect, getCurrentUser);

// update user profile
router.put("/profile", protect, validate(updateProfileSchema), updateProfile);

// logout user
router.post("/logout", protect, logout);

// forgot password
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);

// reset password
router.post("/reset-password/:token", validate(resetPasswordSchema), resetPassword);

export default router;