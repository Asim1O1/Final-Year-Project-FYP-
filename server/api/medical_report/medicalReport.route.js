import express from "express";
import {
  deleteReport,
  downloadReport,
  fetchAllReports,
  fetchCompletedTestsByEmail,
  getUserMedicalReports,
  uploadMedicalReport,
} from "./medicalReport.controller.js";
import upload from "../../imageUpload/multerConfig.js";

import protectRoute from "../../middlewares/protectRoute.js";

const router = express.Router();

router.post(
  "/",
  protectRoute,
  upload.single("reportFile"),
  uploadMedicalReport
);
router.get("/userReport", protectRoute, getUserMedicalReports);
router.get("/hospitalReport", protectRoute, fetchAllReports);
router.get("/download/:reportId", protectRoute, downloadReport);
router.delete("/:reportId", protectRoute, deleteReport);
router.get("/completed-tests", protectRoute, fetchCompletedTestsByEmail);

export default router;
