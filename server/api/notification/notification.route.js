import express from "express";
import {
  clearAllNotifications,
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "./notification.controller.js";
import protectRoute from "../../middlewares/protectRoute.js";

const router = express.Router();

router.put("/mark-all-as-read", protectRoute, markAllNotificationsAsRead);
router.get("/", protectRoute, getNotifications);
router.delete("/clear-all", protectRoute, clearAllNotifications);
router.put("/:id/read", protectRoute, markNotificationAsRead);


export default router;
