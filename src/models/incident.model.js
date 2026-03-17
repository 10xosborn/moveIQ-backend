import mongoose from "mongoose";

const incidentSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      trim: true,
      enum: ["Heavy Traffic", "Roadblock", "Accident"],
    },

    latitude: {
      type: Number,
      required: true,
    },

    longitude: {
      type: Number,
      required: true,
    },

    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    route: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Route",
      default: null,
    },
  },
  { timestamps: true }
);

const Incident = mongoose.model("Incident", incidentSchema);

export default Incident;