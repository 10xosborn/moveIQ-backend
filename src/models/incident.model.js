import mongoose from "mongoose"

const commentSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true
    },
    comment: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
)

const incidentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    status: {
      type: String,
      enum: ["still-there", "cleared"],
      default: "still-there"
    },
    upvotes: {
      type: Number,
      default: 0
    },
    downvotes: {
      type: Number,
      default: 0
    },
    comments: [commentSchema]
  },
  { timestamps: true }
)

const Incident = mongoose.model("Incident", incidentSchema)

export default Incident