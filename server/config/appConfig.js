import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

const appConfig = Object.freeze({
  port: process.env.PORT,
  mongo_uri: process.env.MONGO_URI,
  jwt_secret: process.env.JWT_SECRET_KEY,
  refresh_secret: process.env.REFRESH_TOKEN_SECRET
});

export default appConfig;
