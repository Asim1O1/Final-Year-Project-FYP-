import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoute from "./api/auth/auth.route.js";
import hospitalRoute from "./api/hospital/hospital.route.js";
import doctorRoute from "./api/doctor/doctor.route.js"
import hospitalAdminRoute from "./api/hospital_admin/hospital_admin.route.js"
import globalErrorHandler from "./middlewares/globalErrorHandler.js";

const app = express();

// MIDDLEWARES
app.use(
  cors({
    origin: " http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ROUTES
app.use("/api/auth", authRoute);
app.use("/api", hospitalRoute);
app.use("/api/doctor", doctorRoute)
app.use("/api/hospitalAdmin", hospitalAdminRoute);

// Health check route
app.get("/", (req, res) => {
  res.status(200).send("MedConnect platform up and running!");
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use(globalErrorHandler);

export default app;
