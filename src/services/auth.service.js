import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";
import { env } from "../config/env.js";
import { ApiError } from "../utils/apiError.js";
import {
  createUserDB,
  findUserByEmailOrPhoneDB,
  findUserByIdDB,
  findUserByEmailDB,
  findUserByPhoneDB,
  findUserByResetTokenDB,
  saveUserDB,
  findUserByEmailOnlyDB,
  findUserByVerificationTokenDB,
  clearRefreshTokenDB,
} from "../database/user.database.js";

const signAccessToken = (id) => {
  return jwt.sign({ id }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
};

const signRefreshToken = (id) => {
  return jwt.sign({ id }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  });
};

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
});

export const registerUser = async ({ name, email, phone, password }) => {
  const cleanEmail = email ? email.trim().toLowerCase() : undefined;
  const cleanPhone = phone ? phone.trim() : undefined;

  const userExists = await findUserByEmailOrPhoneDB(cleanEmail, cleanPhone);
  if (userExists) {
    throw new ApiError("User already exists with this email or phone", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const verificationToken = crypto.randomBytes(32).toString("hex");

  const user = await createUserDB({
    name: name.trim(),
    email: cleanEmail,
    phone: cleanPhone,
    password: hashedPassword,
    provider: "local",
    isVerified: false,
    verificationToken,
  });

  const accessToken = signAccessToken(user._id);
  const refreshToken = signRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await saveUserDB(user);

  return { user: sanitizeUser(user), accessToken, refreshToken, verificationToken };
};

export const loginUser = async ({ email, phone, password }) => {
  const cleanEmail = email ? email.trim().toLowerCase() : undefined;
  const cleanPhone = phone ? phone.trim() : undefined;

  const user = await findUserByEmailOrPhoneDB(cleanEmail, cleanPhone);
  if (!user) throw new ApiError("Invalid credentials", 401);

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new ApiError("Invalid credentials", 401);

  const accessToken = signAccessToken(user._id);
  const refreshToken = signRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await saveUserDB(user);

  return { user: sanitizeUser(user), accessToken, refreshToken };
};

// Google Login
const googleClient = new OAuth2Client(env.GOOGLE_CLIENT_ID);

export const googleLoginService = async (credential) => {
  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  const { email, name } = payload;

  if (!email) {
    throw new ApiError("Google account has no email", 400);
  }

  let user = await findUserByEmailOnlyDB(email);

  // Account linking: local user logs in with Google for the first time
  if (user && user.provider === "local") {
    user.provider = "google";
    user.isVerified = true;
    await saveUserDB(user);
  }

  // Creates user if does not exist
  if (!user) {
    user = await createUserDB({
      name,
      email,
      provider: "google",
      isVerified: true,
    });
  }

  const accessToken = signAccessToken(user._id);
  const refreshToken = signRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await saveUserDB(user);

  return { user: sanitizeUser(user), accessToken, refreshToken };
};

// Refresh Token
export const refreshTokenService = async (token) => {
  if (!token) throw new ApiError("No refresh token provided", 401);

  let decoded;
  try {
    decoded = jwt.verify(token, env.JWT_REFRESH_SECRET);
  } catch {
    throw new ApiError("Invalid or expired refresh token", 401);
  }

  const user = await findUserByIdDB(decoded.id, false);
  if (!user || user.refreshToken !== token) {
    throw new ApiError("Invalid refresh token", 401);
  }

  const accessToken = signAccessToken(user._id);
  return { accessToken };
};

// Email Verification
export const verifyEmailService = async (token) => {
  const user = await findUserByVerificationTokenDB(token);
  if (!user) throw new ApiError("Invalid verification token", 400);

  user.isVerified = true;
  user.verificationToken = undefined;
  await saveUserDB(user);
};

// Logout
export const logoutService = async (userId) => {
  await clearRefreshTokenDB(userId);
};

export const updateProfileService = async (userId, { name, email, phone }) => {
  const user = await findUserByIdDB(userId, false);
  if (!user) throw new ApiError("User not found", 404);

  if (email) {
    const cleanEmail = email.trim().toLowerCase();
    const existing = await findUserByEmailDB(cleanEmail, userId);
    if (existing) throw new ApiError("Email already in use", 409);
    user.email = cleanEmail;
  }

  if (phone) {
    const cleanPhone = phone.trim();
    const existing = await findUserByPhoneDB(cleanPhone, userId);
    if (existing) throw new ApiError("Phone already in use", 409);
    user.phone = cleanPhone;
  }

  if (name) user.name = name.trim();

  await saveUserDB(user);
  return { user: sanitizeUser(user) };
};

export const forgotPasswordService = async ({ email, phone }) => {
  const cleanEmail = email ? email.trim().toLowerCase() : undefined;
  const cleanPhone = phone ? phone.trim() : undefined;

  const user = await findUserByEmailOrPhoneDB(cleanEmail, cleanPhone);
  if (!user) throw new ApiError("User not found", 404);

  // Will block Google users from password reset flow
  if (user.provider === "google") {
    throw new ApiError("Please login using Google", 400);
  }

  const resetToken = crypto.randomBytes(32).toString("hex");

  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  await saveUserDB(user);
  return resetToken;
};

export const resetPasswordService = async (token, password) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await findUserByResetTokenDB(hashedToken);
  if (!user) throw new ApiError("Invalid or expired token", 400);

  // This blocks Google users from resetting password
  if (user.provider === "google") {
    throw new ApiError("Google accounts do not support password reset", 400);
  }

  user.password = await bcrypt.hash(password, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await saveUserDB(user);
};