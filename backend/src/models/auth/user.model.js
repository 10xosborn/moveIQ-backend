const mongoose = require("mongoose");

// user schema
const userSchema = new mongoose.Schema(
  {
    // user's name
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // user's email
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    // hashed password
    password: {
      type: String,
      required: true,
    },

    // user role
    role: {
      type: String,
      enum: ["user", "moderator"],
      default: "user",
    },

    // number of reports made by user
    reportsCount: {
      type: Number,
      default: 0,
    },

    // last time user was active
    lastActiveAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

module.exports = mongoose.model("User", userSchema);