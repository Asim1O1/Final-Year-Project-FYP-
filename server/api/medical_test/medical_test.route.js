import express from "express";

import {
  bulkDeleteMedicalTests,
  createMedicalTest,
  deleteMedicalTest,
  bookMedicalTest,
  getMedicalTestById,
  getMedicalTests,
  updateMedicalTest,
  getHospitalTestBookings,
  getUserTestBookings,
  updateTestBookingStatus,
} from "./medical_test.controller.js";
import protectRoute from "../../middlewares/protectRoute.js";
import upload from "../../imageUpload/multerConfig.js";
const router = express.Router();

router.get(
  "/hospitalAdmin-tests",
  protectRoute,
  (req, res, next) => {
    req.query.isHospitalAdmin = "true";
    req.query.adminHospitalId = req.user.hospital;
    next();
  },
  getMedicalTests
);

router.post("/", protectRoute, upload.single("testImage"), createMedicalTest);

router.get("/", getMedicalTests);
// New hospital admin route for viewing only their tests

router.get(
  "/hospital-bookings/:hospitalId",
  protectRoute,
  getHospitalTestBookings
);
router.get("/user-bookings", protectRoute, getUserTestBookings);

router.get("/:id", getMedicalTestById);

router.put("/:id", upload.single("testImage"), updateMedicalTest);

router.delete("/:id", deleteMedicalTest);

router.delete("/", bulkDeleteMedicalTests);

router.post("/:testId/bookings", protectRoute, bookMedicalTest);

router.put("/:bookingId/status", protectRoute, updateTestBookingStatus);

export default router;
