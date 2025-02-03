import express from "express";
import {
  createHospitalAdmin,
  getAllHospitalAdmins,
  getHospitalAdminById,
  updateHospitalAdmin,
} from "./hospitalAdmin.controller.js";
import protectRoute from "../../middlewares/protectRoute.js";

const router = express.Router();

router.get("/", protectRoute, getAllHospitalAdmins);
router.get("/:id", protectRoute, getHospitalAdminById);
router.post("/", protectRoute, createHospitalAdmin);
router.put("/:id", protectRoute, updateHospitalAdmin);


export default router;
