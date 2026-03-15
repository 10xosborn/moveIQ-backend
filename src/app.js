import express from "express"
import incidentRoutes from "./routes/incident.routes.js"

const app = express()

app.use(express.json())

app.use("/api/incidents", incidentRoutes)

app.get("/", (req, res) => {
  res.send("Test API is running")
})

export default app