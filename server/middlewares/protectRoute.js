import jwt from "jsonwebtoken";
import appConfig from "../config/appConfig.js";
import userModel from "../models/user.model.js";
import createResponse from "../utils/responseBuilder.js";

const protectRoute = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      (req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : null);

    console.log("The token is: ", token);

    if (!token) {
      return res.status(401).json(
        createResponse({
          isSuccess: false,
          statusCode: 401,
          message:
            "Authentication required. Please log in to access this resource.",
          error: null,
        })
      );
    }

    const decoded = jwt.verify(token, appConfig.jwt_secret);
    console.log("Decoded token:", decoded);

    if (!decoded?.sub) {
      return res.status(401).json(
        createResponse({
          isSuccess: false,
          statusCode: 401,
          message: "Invalid token, access denied.",
          error: null,
        })
      );
    }
    console.log("The decoded token is: ", decoded);

    const user = await userModel.findById(decoded.sub?.sub || decoded.sub).select("-password");

    console.log("The user is: ", user);

    if (!user) {
      return res.status(404).json(
        createResponse({
          isSuccess: false,
          statusCode: 404,
          message: "User not found.",
          error: null,
        })
      );
    }

    // Attach user object to the request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json(
        createResponse({
          isSuccess: false,
          statusCode: 401,
          message: "Token expired, please log in again.",
          error: null,
        })
      );
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json(
        createResponse({
          isSuccess: false,
          statusCode: 401,
          message: "Invalid token, access denied.",
          error: null,
        })
      );
    }

    console.error("Error in protectRoute middleware: ", error);

    return res.status(500).json(
      createResponse({
        isSuccess: false,
        statusCode: 500,
        message: "An error occurred while processing your request.",
        error: error.message,
      })
    );
  }
};

export default protectRoute;
