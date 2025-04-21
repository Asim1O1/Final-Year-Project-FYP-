import express from "express";
import {
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getAllDoctors,
  getDoctorById,
  getDoctorsBySpecialization,
  getDoctorDashboardStats,
  getDoctorAppointmentSummary,
} from "./doctor.controller.js";
import protectRoute from "../../middlewares/protectRoute.js";
import upload from "../../imageUpload/multerConfig.js";

const router = express.Router();

router.post(
  "/",
  protectRoute,
  upload.fields([
    { name: "certificationImage", maxCount: 1 },
    { name: "doctorProfileImage", maxCount: 1 },
  ]),
  createDoctor
);
// ✅ Get Doctor Dashboard Stats
router.get("/dashboard/stats", protectRoute, getDoctorDashboardStats);
router.get("/appointments/summary", protectRoute, getDoctorAppointmentSummary);

router.put(
  "/:id",
  protectRoute,
  upload.fields([
    { name: "doctorProfileImage", maxCount: 1 },
    { name: "certificationImage", maxCount: 1 },
  ]),
  updateDoctor
);

// ✅ Delete a Doctor
router.delete("/:id", protectRoute, deleteDoctor);

// ✅ Get a Single Doctor by ID
router.get("/:id", getDoctorById);

// ✅ Get All Doctors (with filters & pagination)
router.get("/", getAllDoctors);

// ✅ Get Doctors by Specialization (with pagination)
router.get("/specialization/:specialization", getDoctorsBySpecialization);

export default router;
