import crypto from "crypto";
import jwt from "jsonwebtoken";
import appConfig from "../config/appConfig.js";
export const generateAccessToken = (userId, accountType) => {
  try {
    const jwtSecret = appConfig.jwt_secret;
    if (!jwtSecret) throw new Error("JWT Secret is not defined!");

    return jwt.sign({ sub: userId, accountType }, jwtSecret, {
      expiresIn: "30m",
    });
  } catch (error) {
    throw new Error(`Error generating access token: ${error.message}`);
  }
};
export const generateRefreshToken = (userId, accountType) => {
  try {
    const refreshTokenSecret = appConfig.refresh_secret;
    if (!refreshTokenSecret)
      throw new Error("Refresh Token Secret is not defined!");

    return jwt.sign({ sub: userId, accountType }, refreshTokenSecret, {
      expiresIn: "24h",
    });
  } catch (error) {
    throw new Error(`Error generating refresh token: ${error.message}`);
  }
};

export const generatePasswordResetToken = () => {
  // Generate a 6-digit numeric OTP
  const resetToken = Math.floor(100000 + Math.random() * 900000).toString();

  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set expiry time (10 minutes from now)
  const expiresAt = Date.now() + 10 * 60 * 1000;

  return {
    resetToken,
    hashedToken,
    expiresAt,
  };
};
