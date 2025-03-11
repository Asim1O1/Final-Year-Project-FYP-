import express from "express";
import {
  completeKhaltiPayment,
  initiatePayment,
} from "./payment.controller.js";

const router = express.Router();

// Route to initiate payment
router.post("/initiate-payment", initiatePayment);

// Route to complete Khalti payment (webhook)
router.get("/complete-khalti-payment", completeKhaltiPayment);

export default router;
