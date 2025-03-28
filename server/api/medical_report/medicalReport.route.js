import express from 'express';
import { uploadMedicalReport } from './medicalReport.controller.js';
import upload from '../../imageUpload/multerConfig.js';


const router = express.Router();

router.post("/",upload.single("reportFile"), uploadMedicalReport)

export default router;