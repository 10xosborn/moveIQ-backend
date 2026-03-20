import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
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
} from "../database/user.database.js";

const signToken = (id) => {
  return jwt.sign({ id }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
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

  const user = await createUserDB({
    name: name.trim(),
    email: cleanEmail,
    phone: cleanPhone,
    password: hashedPassword,
  });

  const token = signToken(user._id);
  return { user: sanitizeUser(user), token };
};

export const loginUser = async ({ email, phone, password }) => {
  const cleanEmail = email ? email.trim().toLowerCase() : undefined;
  const cleanPhone = phone ? phone.trim() : undefined;

  const user = await findUserByEmailOrPhoneDB(cleanEmail, cleanPhone);
  if (!user) throw new ApiError("Invalid credentials", 401);

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new ApiError("Invalid credentials", 401);

  const token = signToken(user._id);
  return { user: sanitizeUser(user), token };
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

  user.password = await bcrypt.hash(password, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await saveUserDB(user);
};