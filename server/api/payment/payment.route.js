import express from "express";
import {
  completeKhaltiPayment,
  getUserPayments,
  initiatePayment,
} from "./payment.controller.js";

import protectRoute from "../../middlewares/protectRoute.js";

const router = express.Router();

// Route to initiate payment
router.post("/initiate-payment", protectRoute, initiatePayment);

router.get("/complete-khalti-payment", completeKhaltiPayment);

router.get("/user-payments", protectRoute, getUserPayments);

export default router;
