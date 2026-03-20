import { asyncHandler } from "../utils/asyncHandler.js";
import { successResponse } from "../utils/apiResponse.js";
import {
  registerUser,
  loginUser,
  updateProfileService,
  forgotPasswordService,
  resetPasswordService,
} from "../services/auth.service.js";

// POST /api/auth/register
export const register = asyncHandler(async (req, res) => {
  const result = await registerUser(req.body);
  return successResponse(res, result, "User registered successfully", 201);
});

// POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const result = await loginUser(req.body);
  return successResponse(res, result, "Login successful");
});

// GET /api/auth/current-user
export const getCurrentUser = asyncHandler(async (req, res) => {
  return successResponse(res, { user: req.user });
});

// PUT /api/auth/profile
export const updateProfile = asyncHandler(async (req, res) => {
  const result = await updateProfileService(req.user.id, req.body);
  return successResponse(res, result, "Profile updated successfully");
});

// POST /api/auth/logout
export const logout = asyncHandler(async (req, res) => {
  return successResponse(res, null, "Logout successful");
});

// POST /api/auth/forgot-password
export const forgotPassword = asyncHandler(async (req, res) => {
  const resetToken = await forgotPasswordService(req.body);
  return successResponse(res, { resetToken }, "Reset token generated successfully");
});

// POST /api/auth/reset-password/:token
export const resetPassword = asyncHandler(async (req, res) => {
  await resetPasswordService(req.params.token, req.body.password);
  return successResponse(res, null, "Password reset successful");
});