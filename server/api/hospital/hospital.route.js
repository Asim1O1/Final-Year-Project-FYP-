import express from "express";
import { addHospital, fetchHospitals } from "./hospital.controller.js";
import upload from "../../imageUpload/multerConfig.js";
import protectRoute from "../../middlewares/protectRoute.js";

const router = express.Router();

router.post(
  "/hospitals",
  protectRoute,
  upload.single("hospitalImage"),
  addHospital
);
router.get("/hospitals", fetchHospitals);

export default router;
