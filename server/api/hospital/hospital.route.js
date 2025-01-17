import express from "express";
import { addHospital } from "./hospital.controller.js";
import upload from "../../imageUpload/multerConfig.js";

const router = express.Router();

router.post("/addHospital",upload.single("hospitalImage"), addHospital);


export default router;  