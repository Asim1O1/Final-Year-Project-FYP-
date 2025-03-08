import express from "express";
import {
  clearAllNotifications,
  getUserNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "./notification.controller.js";
import protectRoute from "../../middlewares/protectRoute.js";

const router = express.Router();

router.get("/", protectRoute, getUserNotifications);
router.put("/:id/read", protectRoute, markNotificationAsRead);

router.put("/mark-all-as-read", protectRoute, markAllNotificationsAsRead);

router.delete("/clear-all", protectRoute, clearAllNotifications);

export default router;
