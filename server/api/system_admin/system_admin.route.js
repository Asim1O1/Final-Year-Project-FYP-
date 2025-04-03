import express from "express";
import {
  getAdminDashboardStats,
  getUsersForAdmin,
  getDoctorsForAdmin,
  handleAccountStatus,
} from "./system_admin.controller.js";
import protectRoute from "../../middlewares/protectRoute.js";

const router = express.Router();

// Get admin dashboard stats
router.get("/dashboardStats", protectRoute, getAdminDashboardStats);

// Get all users with role "user"
router.get("/users", protectRoute, getUsersForAdmin);

// Get all doctors
router.get("/doctors", protectRoute, getDoctorsForAdmin);

// Deactivate account (Doctor, User, Hospital Admin)
router.patch(
  "/accountStatus/:accountId/:role",
  protectRoute,
  handleAccountStatus
);

export default router;
