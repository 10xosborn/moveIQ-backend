const mongoose = require("mongoose");

// incident schema
const incidentSchema = new mongoose.Schema(
  {
    // type of report
    type: {
      type: String,
      required: true,
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
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Incident", incidentSchema);