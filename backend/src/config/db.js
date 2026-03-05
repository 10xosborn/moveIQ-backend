const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // check if MongoDB URI exists
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing in .env");
    }

    // connect to MongoDB
    const connection = await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected:", connection.connection.host);
  } catch (error) {
    console.log("MongoDB connection error:", error.message);

    // stop the app if database fails
    process.exit(1);
  }
};

module.exports = connectDB;