import jwt from "jsonwebtoken";
import appConfig from "../config/appConfig.js";

export const generateAccessToken = (userId) => {
  try {
    const jwtSecret = appConfig.jwt_secret;
    if (!jwtSecret) throw new Error("JWT Secret is not defined!");
    return jwt.sign({ sub: userId }, jwtSecret, { expiresIn: "30m" });
  } catch (error) {
    throw new Error(`Error generating access token: ${error.message}`);
  }
};
export const generateRefreshToken = (userId) => {
  try {
    const refreshTokenSecret = appConfig.refresh_secret;
    if (!refreshTokenSecret)
      throw new Error("Refresh Token Secret is not defined!");

    return jwt.sign({ sub: userId }, refreshTokenSecret, { expiresIn: "24h" });
  } catch (error) {
    throw new Error(`Error generating refresh token: ${error.message}`);
  }
};
