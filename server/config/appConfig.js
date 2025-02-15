import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

const appConfig = Object.freeze({
  port: process.env.PORT,
  mongo_uri: process.env.MONGO_URI,
  jwt_secret: process.env.JWT_SECRET_KEY,
  refresh_secret: process.env.REFRESH_TOKEN_SECRET,
  smtp_host: process.env.SMTP_HOST,
  smtp_port: process.env.SMTP_PORT,
  smtp_user: process.env.SMTP_USER,
  smtp_pass: process.env.SMTP_PASS,
  smtp_secure: process.env.SMTP_SECURE,
});

export default appConfig;
