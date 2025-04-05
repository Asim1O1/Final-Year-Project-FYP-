import express from "express";
import {
  clearAllNotifications,
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "./notification.controller.js";
import protectRoute from "../../middlewares/protectRoute.js";

const router = express.Router();

router.get("/", protectRoute, getNotifications);
router.put("/:id/read", protectRoute, markNotificationAsRead);

router.put("/mark-all-as-read", protectRoute, markAllNotificationsAsRead);

router.delete("/clear-all", protectRoute, clearAllNotifications);

export default router;
