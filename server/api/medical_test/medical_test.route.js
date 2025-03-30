import express from "express";
import { bulkDeleteMedicalTests, createMedicalTest, deleteMedicalTest, getMedicalTestById, getMedicalTests, updateMedicalTest } from "./medical_test.controller.js";
import protectRoute from "../../middlewares/protectRoute.js"
import upload from "../../imageUpload/multerConfig.js";
const router = express.Router();


// ✅ Create a new medical test
router.post("/",protectRoute,upload.single('testImage'), createMedicalTest);

// ✅ Get all medical tests (with pagination & filtering)
router.get("/", getMedicalTests);

// ✅ Get a single medical test by ID
router.get("/:id", getMedicalTestById);

// ✅ Update a medical test by ID
router.put("/:id",upload.single('testImage'), updateMedicalTest);

// ✅ Delete a single medical test by ID
router.delete("/:id", deleteMedicalTest);

// ✅ Bulk delete medical tests
router.delete("/", bulkDeleteMedicalTests);

export default router;