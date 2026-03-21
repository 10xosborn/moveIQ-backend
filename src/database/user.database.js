import User from "../models/user.model.js";

export const createUserDB = async (userData) => {
  return await User.create(userData);
};

export const findUserByEmailOrPhoneDB = async (email, phone) => {
  const conditions = [];
  if (email) conditions.push({ email });
  if (phone) conditions.push({ phone });
  if (conditions.length === 0) return null;

  return await User.findOne({ $or: conditions });
};

export const findUserByIdDB = async (id, excludePassword = true) => {
  const query = User.findById(id);
  return excludePassword ? await query.select("-password") : await query;
};

export const findUserByEmailDB = async (email, excludeId = null) => {
  const query = { email };
  if (excludeId) query._id = { $ne: excludeId };
  return await User.findOne(query);
};

export const findUserByPhoneDB = async (phone, excludeId = null) => {
  const query = { phone };
  if (excludeId) query._id = { $ne: excludeId };
  return await User.findOne(query);
};

export const findUserByResetTokenDB = async (hashedToken) => {
  return await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
};

export const saveUserDB = async (user) => {
  return await user.save();
};

export const findUserByEmailOnlyDB = async (email) => {
  return await User.findOne({ email });
};

export const findUserByVerificationTokenDB = async (token) => {
  return await User.findOne({ verificationToken: token });
};

export const clearRefreshTokenDB = async (userId) => {
  return await User.findByIdAndUpdate(userId, { refreshToken: null });
};
