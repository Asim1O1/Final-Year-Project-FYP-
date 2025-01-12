import express from "express";
import { addHospital } from "./hospital.controller.js";

const router = express.Router();

router.post("/addHospital", addHospital);


export default router;