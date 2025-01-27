import express from "express";
import {
  handleUserRegistration,
  handleUserLogin,
  verifyUserAuthentication,
  handleUserLogout,
} from "./auth.controller.js";
import protectRoute from "../../middlewares/protectRoute.js";
import handleRefreshAccessToken from "../../utils/refreshAccessToken.js";

const router = express.Router();

router.post("/register", handleUserRegistration);
router.post("/login", handleUserLogin);
router.post("/logout", protectRoute, handleUserLogout);
router.post("/refreshAccessToken", handleRefreshAccessToken);
router.get("/verifyUserAuth", protectRoute, verifyUserAuthentication);

export default router;
