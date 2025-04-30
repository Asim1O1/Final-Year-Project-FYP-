import express from "express";
import protectRoute from "../../middlewares/protectRoute.js";
import {
  getAllUsers,
  getUserById,
  getUserStats,
  updateUser,
} from "./user.controller.js";

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
