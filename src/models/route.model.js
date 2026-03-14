import mongoose from "mongoose";

const routeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Route name is required"],
      trim: true,
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
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Route = mongoose.model("Route", routeSchema);

export default Route;