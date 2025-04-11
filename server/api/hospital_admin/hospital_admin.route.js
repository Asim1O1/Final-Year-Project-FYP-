import express from "express";
import {
  createHospitalAdmin,
  deleteHospitalAdmin,
  getAllHospitalAdmins,
  getDashboardStatsForHospitalAdmin,
  getHospitalAdminById,
  updateHospitalAdmin,
} from "./hospitalAdmin.controller.js";
import protectRoute from "../../middlewares/protectRoute.js";

const router = express.Router();

router.get("/", protectRoute, getAllHospitalAdmins);
router.get("/dashboardStats", protectRoute, getDashboardStatsForHospitalAdmin);
router.get("/:id", protectRoute, getHospitalAdminById);
router.post("/", protectRoute, createHospitalAdmin);
router.put("/:id", protectRoute, updateHospitalAdmin);
router.delete("/:id", protectRoute, deleteHospitalAdmin);


export default router;
