import notificationRoutes from "./routes/notification.routes.js";
import activityRoutes from "./routes/activity.routes.js";

app.use("/api/auth", authRoutes);
app.use("/api/incidents", incidentRoutes);
app.use("/api/routes", routeRoutes);
app.use("/api/notifications", notificationRoutes);
//app.use("/api/activities", activityRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/activities", activityRoutes);