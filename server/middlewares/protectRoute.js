import jwt from "jsonwebtoken";
import appConfig from "../config/appConfig.js";
import userModel from "../models/user.model.js";
import doctorModel from "../models/doctor.model.js"; // Import doctor model
import createResponse from "../utils/responseBuilder.js";

const protectRoute = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      (req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : null);

    if (!token) {
      return res.status(401).json(
        createResponse({
          isSuccess: false,
          statusCode: 401,
          message: "Authentication required. Please log in.",
          error: null,
        })
      );
    }

    // Verify and decode token
    const decoded = jwt.verify(token, appConfig.jwt_secret);
    console.log("tHE DECOED IS", decoded);

    // Validate token structure
    if (!decoded?.sub || !decoded?.accountType) {
      return res.status(401).json(
        createResponse({
          isSuccess: false,
          statusCode: 401,
          message: "Invalid token structure",
          error: null,
        })
      );
    }

    let account;
    const { sub, accountType } = decoded;

    // Check account type and fetch appropriate model
    switch (accountType) {
      case "user":
        account = await userModel.findById(sub).select("-password");
        break;
      case "doctor":
        account = await doctorModel.findById(sub).select("-password");
        break;
      default:
        return res.status(401).json(
          createResponse({
            isSuccess: false,
            statusCode: 401,
            message: "Invalid account type",
            error: null,
          })
        );
    }

    if (!account) {
      return res.status(404).json(
        createResponse({
          isSuccess: false,
          statusCode: 404,
          message: `${accountType} not found`,
          error: null,
        })
      );
    }

    // Attach account info to request
    req.user = account;
    req.accountType = accountType; // Add account type to request
    next();
  } catch (error) {
    // Handle different error types
    if (error.name === "TokenExpiredError") {
      return res.status(401).json(
        createResponse({
          isSuccess: false,
          statusCode: 401,
          message: "Token expired, please log in again.",
          error: null,
        })
      );
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json(
        createResponse({
          isSuccess: false,
          statusCode: 401,
          message: "Invalid token",
          error: null,
        })
      );
    }

    console.error("Error in protectRoute:", error);
    return res.status(500).json(
      createResponse({
        isSuccess: false,
        statusCode: 500,
        message: "Internal server error",
        error: error.message,
      })
    );
  }
};

export default protectRoute;
