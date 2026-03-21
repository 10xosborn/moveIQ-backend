import { asyncHandler } from "../utils/asyncHandler.js";
import { successResponse } from "../utils/apiResponse.js";
import {
  registerUser,
  loginUser,
  googleLoginService,
  refreshTokenService,
  verifyEmailService,
  logoutService,
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

// POST /api/auth/google
export const googleLogin = asyncHandler(async (req, res) => {
  const { credential } = req.body;

  if (!credential) {
    return res.status(400).json({
      success: false,
      message: "Google credential is required",
    });
  }

  const result = await googleLoginService(credential);
  return successResponse(res, result, "Google login successful");
});

// POST /api/auth/refresh-token
export const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  const result = await refreshTokenService(refreshToken);
  return successResponse(res, result, "Token refreshed");
});

// GET /api/auth/verify-email/:token
export const verifyEmail = asyncHandler(async (req, res) => {
  await verifyEmailService(req.params.token);
  return successResponse(res, null, "Email verified successfully");
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
  await logoutService(req.user.id);
  return successResponse(res, null, "Logged out successfully");
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