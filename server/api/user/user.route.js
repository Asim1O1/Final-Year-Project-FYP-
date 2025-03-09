import express from "express";
import { getAllUsers, getUserById, updateUser } from "./user.controller.js";
import protectRoute from "../../middlewares/protectRoute.js";

const router = express.Router();
// Get all users with pagination
router.get("/", protectRoute, getAllUsers);

// Get a single user by ID
router.get("/:id", protectRoute, getUserById);

// Update a user
router.put("/:id", protectRoute, updateUser);

export default router;
