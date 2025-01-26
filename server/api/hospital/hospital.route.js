import express from "express";
import { addHospital } from "./hospital.controller.js";
import upload from "../../imageUpload/multerConfig.js";
import protectRoute from "../../middlewares/protectRoute.js";

const router = express.Router();

router.post("/addHospital",protectRoute, upload.single("hospitalImage"), addHospital);


export default router;  