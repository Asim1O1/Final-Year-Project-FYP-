import express from "express";
import {
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getAllDoctors,
  getDoctorById,
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

export default router;
