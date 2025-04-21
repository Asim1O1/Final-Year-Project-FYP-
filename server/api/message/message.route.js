import express from "express";
import {
  getContactsForSidebar,
  sendMessage,
  markMessagesAsRead,
  getMessages,
} from "./message.controller.js";
import protectRoute from "../../middlewares/protectRoute.js";
import upload from "../../imageUpload/multerConfig.js";

const router = express.Router();

router.get("/contacts", protectRoute, getContactsForSidebar);

router.post("/send/:id", protectRoute, upload.single("image"), sendMessage);

router.post("/mark-read", protectRoute, markMessagesAsRead);

router.get("/messages/:id", protectRoute, getMessages);

export default router;
