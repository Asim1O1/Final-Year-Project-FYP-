import express from "express";
import {
  bookDoctorAppointment,
  getAvailableTimeSlots,
  getDoctorAppointments,
  getUserAppointments,
} from "./appointment.controller.js";
import protectRoute from "../../middlewares/protectRoute.js";

const router = express.Router();

router.post("/book", bookDoctorAppointment);
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

export default router;
