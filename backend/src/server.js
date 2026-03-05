const path = require("path");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.routes");
const incidentRoutes = require("./routes/incident.routes");

// load environment variables
dotenv.config({ path: path.join(__dirname, "../.env") });

const app = express();

// middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use("/api/incidents", incidentRoutes);

// test route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "MoveIQ API is running",
  });
});

// auth routes
app.use("/api/auth", authRoutes);

// connect to database
connectDB();

const PORT = process.env.PORT || 5000;

// start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});