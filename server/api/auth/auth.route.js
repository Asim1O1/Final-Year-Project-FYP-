import express from "express";
import {
  handleUserRegistration,
  handleUserLogin,
  verifyUserAuthentication,
  handleUserLogout,
  handleForgotPassword,
  handlePasswordReset,
  handleOtpVerification,
} from "./auth.controller.js";
import protectRoute from "../../middlewares/protectRoute.js";
import handleRefreshAccessToken from "../../utils/refreshAccessToken.js";

import otpRateLimiter from "../../middlewares/otpRateLimiter.js";

const router = express.Router();

router.post("/register", handleUserRegistration);
router.post("/login", handleUserLogin);
router.post("/logout", protectRoute, handleUserLogout);
router.post("/refreshAccessToken", handleRefreshAccessToken);
router.get("/verifyUserAuth", protectRoute, verifyUserAuthentication);
router.post("/forgotPassword", otpRateLimiter, handleForgotPassword);
router.post("/verifyOtp", otpRateLimiter, handleOtpVerification);
router.post("/resetPassword", handlePasswordReset);

export default router;
