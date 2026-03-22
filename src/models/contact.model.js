import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },

    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    message: {
      type: String,
      required: [true, "Message is required"],
    },

    status: {
      type: String,
      enum: ["NEW", "READ", "RESOLVED"],
      default: "NEW",
    },
  },
  { timestamps: true }
);

const Contact = mongoose.model("Contact", contactSchema);

export default Contact;