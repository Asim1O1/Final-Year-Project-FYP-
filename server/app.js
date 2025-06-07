import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

import activityRoute from "./api/activity/activity.route.js";
import appointmentRoute from "./api/appointment/appointment.route.js";
import authRoute from "./api/auth/auth.route.js";
import campaignRoute from "./api/campaign/campaign.route.js";
import doctorRoute from "./api/doctor/doctor.route.js";
import hospitalRoute from "./api/hospital/hospital.route.js";
import hospitalAdminRoute from "./api/hospital_admin/hospital_admin.route.js";
import reportRoute from "./api/medical_report/medicalReport.route.js";
import medicalTestRoute from "./api/medical_test/medical_test.route.js";
import messageRoute from "./api/message/message.route.js";
import notificationRoute from "./api/notification/notification.route.js";
import paymentRoute from "./api/payment/payment.route.js";
import systemAdminRoute from "./api/system_admin/system_admin.route.js";
import userRoute from "./api/user/user.route.js";

import globalErrorHandler from "./middlewares/globalErrorHandler.js";

const app = express();

// MIDDLEWARES
app.use(
  cors({
    origin: [" http://localhost:5173", "https://medconnect-client.netlify.app"],

    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ROUTES
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api", hospitalRoute);
app.use("/api/doctor", doctorRoute);
app.use("/api/hospitalAdmin", hospitalAdminRoute);
app.use("/api/appointments", appointmentRoute);
app.use("/api/campaigns", campaignRoute);
app.use("/api/notifications", notificationRoute);
app.use("/api/payments", paymentRoute);
app.use("/api/messages", messageRoute);
app.use("/api/report", reportRoute);
app.use("/api/medicalTest", medicalTestRoute);
app.use("/api/systemAdmin", systemAdminRoute);
app.use("/api/systemAdmin", activityRoute);

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
