import express from 'express';
import { getAdminDashboardStats } from './system_admin.controller.js';
import protectRoute from "../../middlewares/protectRoute.js"


const router = express.Router();

router.get("/dashboardStats", protectRoute, getAdminDashboardStats)

export default router;