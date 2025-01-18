import express from "express";
import { handleUserRegistration, handleUserLogin, verifyUserAuthentication } from "./auth.controller.js";
import protectRoute from "../../middlewares/protectRoute.js";
import handleRefreshAccessToken from "../../utils/refreshAccessToken.js";

const router = express.Router();

router.post("/register", handleUserRegistration);
router.post("/login", handleUserLogin);
router.post("/refreshAcessToken",handleRefreshAccessToken )
router.get("/verifyUserAuth",protectRoute,  verifyUserAuthentication)

export default router;
