import app from "./app.js"
import mongoose from "mongoose"

const PORT = process.env.PORT || 5000
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/Incidents"

const startServer = async () => {
  try {
    await mongoose.connect(MONGO_URI)

    console.log("Database connected")

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  } catch (error) {
    console.error(error)
  }
}

startServer()