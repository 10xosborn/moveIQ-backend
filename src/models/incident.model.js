import mongoose from "mongoose";

// incident schema
const incidentSchema = new mongoose.Schema(
  {
    // type of report
    type: {
      type: String,
      required: true,
      trim: true,
      enum: ["Heavy Traffic", "Roadblock", "Accident"],
    },

    // location coordinates
    latitude: {
      type: Number,
      required: true,
    },

    longitude: {
      type: Number,
      required: true,
    },

    // user who reported
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Incident = mongoose.model("Incident", incidentSchema);

export default Incident;