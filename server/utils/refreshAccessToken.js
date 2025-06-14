import jwt from "jsonwebtoken";
import appConfig from "../config/appConfig.js";
import { generateAccessToken } from "./generateAuthToken.js";
import createResponse from "./responseBuilder.js";

const handleRefreshAccessToken = async (req, res, next) => {
  const refreshToken = req?.cookies?.refreshToken;
  console.log("The refresh token is", refreshToken);

  if (!refreshToken) {
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

  try {
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, appConfig.refresh_secret);

    // Generate a new access token with accountType
    const newAccessToken = generateAccessToken(
      decoded.sub,
      decoded.accountType
    );

    console.log("Generated new access token:", newAccessToken);

    // Set the new access token as a cookie
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 15 * 60 * 1000,
    });

    // Send the response
    return res.status(200).json(
      createResponse({
        isSuccess: true,
        statusCode: 200,
        message: "Access token refreshed successfully.",
        data: { accessToken: newAccessToken },
        error: null,
      })
    );
  } catch (error) {
    console.error("Error verifying refresh token:", error.message);

    // Handle different JWT errors
    if (error.name === "TokenExpiredError") {
      return res.status(401).json(
        createResponse({
          isSuccess: false,
          statusCode: 401,
          message: "Refresh token has expired. Please log in again.",
          error: error.message,
        })
      );
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json(
        createResponse({
          isSuccess: false,
          statusCode: 401,
          message: "Invalid refresh token. Access denied.",
          error: error.message,
        })
      );
    }

    // General error handling
    return res.status(500).json(
      createResponse({
        isSuccess: false,
        statusCode: 500,
        message: "An error occurred while refreshing the access token.",
        error: error.message,
      })
    );

  }
};
export default handleRefreshAccessToken;
