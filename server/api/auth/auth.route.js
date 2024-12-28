import express from "express";
import { registerUser } from "./auth.controller.js";

const router = express.Router();

router.post("/register", registerUser);
