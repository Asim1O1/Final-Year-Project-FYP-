import express from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
  getUserStats, // 👈 Import the new controller
} from "./user.controller.js";
import protectRoute from "../../middlewares/protectRoute.js";

const router = express.Router();

// Get all users with pagination
router.get("/", protectRoute, getAllUsers);

// ✅ Get user stats (add this before :id route to avoid conflict)
router.get("/stats/:id", protectRoute, getUserStats);

// Get a single user by ID
router.get("/:id", protectRoute, getUserById);

// Update a user
router.put("/:id", protectRoute, updateUser);

export default router;
