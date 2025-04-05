import { getRecentActivities } from "./activity.controller.js";
import express from "express";
import protectRoute from "../../middlewares/protectRoute.js";

const router = express.Router();

router.get("/activities", protectRoute, getRecentActivities);

export default router;