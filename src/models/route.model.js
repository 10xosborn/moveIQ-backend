import mongoose from "mongoose";
import { ROUTE_STATUS } from "../utils/constants.js";

const routeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Route name is required"],
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    startLocation: {
      type: String,
      required: [true, "Start location is required"],
      trim: true,
    },

    endLocation: {
      type: String,
      required: [true, "End location is required"],
      trim: true,
    },

    distance: {
      type: Number,
      default: 0,
    },

    estimatedDuration: {
      type: Number,
      default: 0,
    },

    area: {
      type: String,
      trim: true,
    },

    junctions: [
      {
        type: String,
        trim: true,
      },
    ],

    status: {
      type: String,
      enum: Object.values(ROUTE_STATUS),
      default: ROUTE_STATUS.GREEN,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate slug from name if not provided
routeSchema.pre("validate", function () {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
});

const Route = mongoose.model("Route", routeSchema);

export default Route;