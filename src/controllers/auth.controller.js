import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/user.model.js";

// create token
function signToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

// POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || (!email && !phone) || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email or phone, and password are required",
      });
    }

    const cleanName = name.trim();
    const cleanEmail = email ? email.trim().toLowerCase() : undefined;
    const cleanPhone = phone ? phone.trim() : undefined;

    const userExists = await User.findOne({
      $or: [{ email: cleanEmail }, { phone: cleanPhone }],
    });

    if (userExists) {
      return res.status(409).json({
        success: false,
        message: "User already exists with this email or phone",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      password: hashedPassword,
    });

    const token = signToken(user._id);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, phone, password } = req.body;

    if ((!email && !phone) || !password) {
      return res.status(400).json({
        success: false,
        message: "Email or phone and password are required",
      });
    }

    const cleanEmail = email ? email.trim().toLowerCase() : undefined;
    const cleanPhone = phone ? phone.trim() : undefined;

    const user = await User.findOne({
      $or: [{ email: cleanEmail }, { phone: cleanPhone }],
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = signToken(user._id);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET /api/auth/current-user
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// PUT /api/auth/profile
export const updateProfile = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // check if new email is already used by another user
    if (email) {
      const cleanEmail = email.trim().toLowerCase();

      const existingEmailUser = await User.findOne({
        email: cleanEmail,
        _id: { $ne: req.user.id },
      });

      if (existingEmailUser) {
        return res.status(409).json({
          success: false,
          message: "Email already in use",
        });
      }

      user.email = cleanEmail;
    }

    // check if new phone is already used by another user
    if (phone) {
      const cleanPhone = phone.trim();

      const existingPhoneUser = await User.findOne({
        phone: cleanPhone,
        _id: { $ne: req.user.id },
      });

      if (existingPhoneUser) {
        return res.status(409).json({
          success: false,
          message: "Phone already in use",
        });
      }

      user.phone = cleanPhone;
    }

    if (name) {
      user.name = name.trim();
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// POST /api/auth/logout
export const logout = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// POST /api/auth/forgot-password
export const forgotPassword = async (req, res) => {
  try {
    const { email, phone } = req.body;

    if (!email && !phone) {
      return res.status(400).json({
        success: false,
        message: "Provide email or phone",
      });
    }

    const cleanEmail = email ? email.trim().toLowerCase() : undefined;
    const cleanPhone = phone ? phone.trim() : undefined;

    const user = await User.findOne({
      $or: [{ email: cleanEmail }, { phone: cleanPhone }],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Reset token generated successfully",
      resetToken,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// POST /api/auth/reset-password/:token
export const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "New password is required",
      });
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};