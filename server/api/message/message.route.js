import express from "express";
import { 
  getContactsForSidebar, 
  sendMessage, 
  markMessagesAsRead, 
  getMessages 
} from "./message.controller.js";
import protectRoute from "../../middlewares/protectRoute.js";
import upload from "../../imageUpload/multerConfig.js";

const router = express.Router();

// 📌 Get all chat contacts (users & doctors)
router.get("/contacts", protectRoute, getContactsForSidebar);

// 📌 Send a message (supports text & image)
router.post("/send/:id", protectRoute, upload.single("image"), sendMessage);

// 📌 Mark messages as read
router.post("/mark-read", protectRoute, markMessagesAsRead);

// 📌 Get messages between two users
router.get("/messages/:id",protectRoute, getMessages);

export default router;
