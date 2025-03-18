import express from "express";
import {
  bookDoctorAppointment,
  deleteAppointments,
  getAppointmentById,
  getAvailableTimeSlots,
  getDoctorAppointments,
  getUserAppointments,
  updateAppointmentStatus,
} from "./appointment.controller.js";
import protectRoute from "../../middlewares/protectRoute.js";

const router = express.Router();

router.post("/book", protectRoute, bookDoctorAppointment);
// Route to get available time slots for a doctor on a specific date
router.get("/available-slots/:doctorId/:date", getAvailableTimeSlots);

// Route to get all appointments for a specific user
router.get("/user-appointments/:userId", protectRoute, getUserAppointments);

// Route to get all appointments for a specific doctor
router.get(
  "/doctor-appointments/:doctorId",
  protectRoute,
  getDoctorAppointments
);

router.get("/:appointmentId", protectRoute, getAppointmentById);

router.patch("/:appointmentId/status", updateAppointmentStatus);

router.post("/delete", protectRoute, deleteAppointments);

export default router;
