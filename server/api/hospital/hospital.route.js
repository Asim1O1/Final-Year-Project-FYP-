import express from "express";
import {
  addHospital,
  deleteHospital,
  fetchHospitalById,
  fetchHospitals,
  updateHospital,
} from "./hospital.controller.js";
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
router.get("/hospitals/:id", fetchHospitalById);
router.put("/hospitals/:id", upload.single("hospitalImage"), updateHospital);
router.delete("/hospitals/:id", deleteHospital);

export default router;
