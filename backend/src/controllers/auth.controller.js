const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/auth/user.model");

// create token
function signToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

// POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check required fields
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "name, email, and password are required" });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    // check if user exists
    const userExists = await User.findOne({ email: cleanEmail });
    if (userExists) {
      return res
        .status(409)
        .json({ success: false, message: "Email already registered" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const user = await User.create({
      name: cleanName,
      email: cleanEmail,
      password: hashedPassword,
    });

    // token
    const token = signToken(user._id);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check required fields
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "email and password are required" });
    }

    const cleanEmail = email.trim().toLowerCase();

    // find user
    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // token
    const token = signToken(user._id);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    // req.user should be set by auth middleware
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }

    const user = await User.findById(req.user.id).select("-password");

    return res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};