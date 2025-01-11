import express from "express";
import { handleUserRegistration, handleUserLogin } from "./auth.controller.js";

const router = express.Router();

router.post("/register", handleUserRegistration);
router.post("/login", handleUserLogin);

export default router;
